import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { evaluateResponse } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { questionId, transcription, audioPath } = await request.json();

    if (!questionId || !transcription || !audioPath) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        conversation: true,
      },
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Evaluate the response
    const { feedback, isApproved } = await evaluateResponse(
      question.questionText,
      transcription,
      question.conversation.jobDescription,
      question.conversation.resumeText
    );

    // Save attempt
    const attempt = await prisma.attempt.create({
      data: {
        questionId,
        audioPath,
        transcription,
        feedback,
        isApproved,
      },
    });

    return NextResponse.json({ attempt, feedback, isApproved });
  } catch (error) {
    console.error('Error evaluating response:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to evaluate response';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

