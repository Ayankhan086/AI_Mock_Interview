import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { interviewType, language = 'en-US' } = await req.json();
    if (!interviewType) {
      return NextResponse.json({ error: 'Interview type is required' }, { status: 400 });
    }

    const interview = await prisma.interviewSession.create({
      data: {
        userId: session.id,
        interviewType,
        language,
        status: 'InProgress',
        transcript: []
      },
    });

    return NextResponse.json({ interview }, { status: 201 });
  } catch (error) {
    console.error('Error creating interview:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const interviews = await prisma.interviewSession.findMany({
      where: { userId: session.id },
      orderBy: { startedAt: 'desc' },
      include: { reports: true }
    });

    return NextResponse.json({ interviews }, { status: 200 });
  } catch (error) {
    console.error('Error fetching interviews:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
