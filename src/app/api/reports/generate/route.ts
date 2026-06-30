import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { SystemMessage, HumanMessage } from '@langchain/core/messages';

const llm = new ChatGoogleGenerativeAI({
  model: 'gemini-2.5-flash',
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
    const formattedTranscript = transcript.map(t => `${t.role.toUpperCase()}: ${t.content}`).join('\n\n');

    const systemPrompt = `You are an expert HR Manager, Career Coach, and Technical Interviewer.
Please analyze the following interview transcript and generate a comprehensive, highly detailed feedback report.
The interview was for a ${interview.interviewType} interview type targeting a ${interview.user.jobRole || 'Professional'} role with a ${interview.user.experienceLevel || 'Mid-Level'} experience level.

Your feedback MUST be specific, actionable, and detail-oriented. Avoid generic advice. Quote specific answers from the transcript to highlight strengths or areas of improvement.

Return the report in EXACTLY this JSON format without any markdown code blocks:
{
  "overallScore": <integer from 0 to 100 representing the candidate's performance>,
  "strengths": ["Specific strength 1 with context", "Specific strength 2 with context"],
  "weaknesses": ["Specific area for improvement 1", "Specific area for improvement 2"],
  "detailedFeedback": "A comprehensive markdown formatted string containing the full report."
}

Guidelines for 'detailedFeedback' markdown:
- Use H3 (###) headers for sections.
- Include a 'Performance Overview' section.
- Include a 'Key Competencies' section breaking down Communication, Problem Solving, and Role-specific skills.
- Include an 'Actionable Next Steps' section giving the candidate 2-3 specific things to practice.
- Use bold text, bullet points, and blockquotes where appropriate to make the report readable and highly professional.`;

    const response = await llm.invoke([
      new SystemMessage(systemPrompt),
      new HumanMessage(`Transcript:\n${formattedTranscript}`)
    ]);

    let parsedResponse;
    try {
      let content = response.content as string;
      if (content.startsWith('\`\`\`json')) {
        content = content.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '').trim();
      }
      parsedResponse = JSON.parse(content);
    } catch (e) {
      console.error('Error parsing LLM response:', response.content);
      return NextResponse.json({ error: 'Failed to parse report' }, { status: 500 });
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
