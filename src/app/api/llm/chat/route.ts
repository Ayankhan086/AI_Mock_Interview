import { NextResponse } from 'next/server';
import { interviewGraph } from '@/lib/langgraph';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId, message } = await req.json();

    if (!sessionId || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch the interview session
    const interview = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
      include: { user: true }
    });

    if (!interview || interview.userId !== session.id) {
      return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
    }

    // Reconstruct the history from transcript (assuming transcript is [{role: "ai"|"human", content: "..."}])
    const transcript: { role: string, content: string }[] = (interview.transcript as any) || [];
    
    // Convert to LangChain messages
    const lcMessages = transcript.map(m => 
      m.role === 'ai' ? new AIMessage(m.content) : new HumanMessage(m.content)
    );

    // Add the new human message
    lcMessages.push(new HumanMessage(message));

    // Run the graph
    const initialState = {
      messages: lcMessages,
      interviewType: interview.interviewType,
      userName: interview.user.name,
      jobRole: interview.user.jobRole || 'Professional',
      language: (interview as any).language || 'en-US',
      questionCount: Math.floor(transcript.length / 2),
    };

    const newState = await interviewGraph.invoke(initialState);
    const newMessages = newState.messages;
    const latestAiMessage = newMessages[newMessages.length - 1].content;

    // Save updated transcript
    const updatedTranscript = [
      ...transcript,
      { role: 'human', content: message },
      { role: 'ai', content: latestAiMessage }
    ];

    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: { transcript: updatedTranscript }
    });

    return NextResponse.json({ response: latestAiMessage }, { status: 200 });

  } catch (error: any) {
    console.error('LLM Chat Error:', error);
    if (error?.message?.includes('429') || error?.message?.includes('RateLimitQuotaExhaustedError') || error?.status === 429) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please wait a minute.' }, { status: 429 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
