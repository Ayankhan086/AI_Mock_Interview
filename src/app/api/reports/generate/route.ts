import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';

const llm = new ChatGoogleGenerativeAI({
  model: 'gemini-3.5-flash',
  maxOutputTokens: 2048,
  temperature: 0.2,
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || 'missing-key',
});

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    const interview = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      include: { user: true, reports: true }
    });

    if (!interview || interview.userId !== session.id) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    if (interview.reports && interview.reports.length > 0) {
      return NextResponse.json({ error: 'Report already generated', report: interview.reports[0] }, { status: 200 });
    }

    const transcript = interview.transcript as { role: string, content: string }[] || [];
    
    // Early exit if the user didn't say anything
    if (transcript.length === 0) {
      const fallbackReport = await prisma.report.create({
        data: {
          sessionId: interview.id,
          overallScore: 0,
          strengths: ["None (Interview ended before candidate spoke)"],
          weaknesses: ["Did not participate"],
          detailedFeedback: "### Performance Overview\nThe candidate ended the interview before answering any questions.\n\n### Actionable Next Steps\n- Ensure your microphone is working and permissions are granted.\n- Try again when you are ready to speak with the AI."
        }
      });

      if (interview.status !== 'Completed') {
        await prisma.interviewSession.update({
          where: { id: interview.id },
          data: { status: 'Completed', endedAt: new Date() }
        });
      }
      
      return NextResponse.json({ report: fallbackReport }, { status: 201 });
    }

    const formattedTranscript = transcript.map(t => `${t.role.toUpperCase()}: ${t.content}`).join('\n\n');

    const language = (interview as any).language || 'en-US';

    const systemPrompt = `You are an expert HR Manager, Career Coach, and Technical Interviewer.
Please analyze the following interview transcript and generate a comprehensive, highly detailed feedback report.
The interview was for a ${interview.interviewType} interview type targeting a ${interview.user.jobRole || 'Professional'} role with a ${interview.user.experienceLevel || 'Mid-Level'} experience level.

CRITICAL INSTRUCTION: You MUST write your ENTIRE feedback report strictly in the following language/locale: ${language}. Do not use English unless the requested language is English.

Your feedback MUST be specific, actionable, and detail-oriented. Avoid generic advice. Quote specific answers from the transcript to highlight strengths or areas of improvement.

Output your report using the following EXACT structure. Do not use JSON. Use these exact tags:

<score>
[integer from 0 to 100]
</score>

<strengths>
- [specific strength 1]
- [specific strength 2]
</strengths>

<weaknesses>
- [specific weakness 1]
- [specific weakness 2]
</weaknesses>

<detailedFeedback>
[Write your comprehensive markdown report here. Guidelines: Use H3 (###) headers for sections. Include a 'Performance Overview' section. Include a 'Key Competencies' section breaking down Communication, Problem Solving, and Role-specific skills. Include an 'Actionable Next Steps' section giving the candidate 2-3 specific things to practice. Use bold text, bullet points, and blockquotes where appropriate to make the report readable and highly professional.]
</detailedFeedback>`;

    const response = await llm.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(`Transcript:\n${formattedTranscript}`)
    ]);

    let parsedResponse;
    try {
      const content = response.content as string;
      
      const scoreMatch = content.match(/<score>([\s\S]*?)<\/score>/);
      const strengthsMatch = content.match(/<strengths>([\s\S]*?)<\/strengths>/);
      const weaknessesMatch = content.match(/<weaknesses>([\s\S]*?)<\/weaknesses>/);
      const feedbackMatch = content.match(/<detailedFeedback>([\s\S]*?)<\/detailedFeedback>/);
      
      if (!scoreMatch || !feedbackMatch) {
         throw new Error("Missing required XML tags in LLM response");
      }
      
      const overallScore = parseInt(scoreMatch[1].trim(), 10) || 0;
      
      const strengthsText = strengthsMatch ? strengthsMatch[1].trim() : "No strengths identified";
      const strengths = strengthsText.split('\n').map(s => s.replace(/^[-*]\s*/, '').trim()).filter(Boolean);
      
      const weaknessesText = weaknessesMatch ? weaknessesMatch[1].trim() : "No weaknesses identified";
      const weaknesses = weaknessesText.split('\n').map(s => s.replace(/^[-*]\s*/, '').trim()).filter(Boolean);
      
      const detailedFeedback = feedbackMatch[1].trim();

      parsedResponse = { overallScore, strengths, weaknesses, detailedFeedback };
      
    } catch (e) {
      console.error('Error parsing LLM response:', response.content);
      
      // Fallback response if AI failed to return valid tags
      parsedResponse = {
        overallScore: 0,
        strengths: ["None identified"],
        weaknesses: ["AI was unable to process the transcript."],
        detailedFeedback: "### Error\nThe AI failed to generate a properly formatted report for this session. This is usually caused by an LLM parsing error or too short of a transcript."
      };
    }

    const report = await prisma.report.create({
      data: {
        sessionId: interview.id,
        overallScore: parsedResponse.overallScore,
        strengths: parsedResponse.strengths,
        weaknesses: parsedResponse.weaknesses,
        detailedFeedback: parsedResponse.detailedFeedback,
      }
    });

    // Mark session as completed if it wasn't
    if (interview.status !== 'Completed') {
      await prisma.interviewSession.update({
        where: { id: interview.id },
        data: { status: 'Completed', endedAt: new Date() }
      });
    }

    return NextResponse.json({ report }, { status: 201 });

  } catch (error) {
    console.error('Report Generation Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
