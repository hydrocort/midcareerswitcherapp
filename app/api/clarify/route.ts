import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getFinalEvaluation, InitialEvaluation } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { conversationId, answers } = await request.json();

    if (!conversationId || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    const initialEvaluation: InitialEvaluation = conversation.initialEvaluation
      ? JSON.parse(conversation.initialEvaluation)
      : null;

    if (!initialEvaluation) {
      return NextResponse.json(
        { error: 'Initial evaluation not found' },
        { status: 400 }
      );
    }

    // Get final evaluation
    const finalEvaluation = await getFinalEvaluation(
      conversation.resumeText,
      conversation.jobDescription,
      initialEvaluation,
      answers
    );

    // Update conversation with final evaluation
    const updatedConversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        clarifyingAnswers: JSON.stringify(answers),
        finalScore: finalEvaluation.score,
        finalEvaluation: JSON.stringify(finalEvaluation),
      },
    });

    return NextResponse.json({
      finalEvaluation,
      conversation: updatedConversation,
    });
  } catch (error) {
    console.error('Error processing clarifying answers:', error);
    return NextResponse.json(
      { error: 'Failed to process clarifying answers' },
      { status: 500 }
    );
  }
}

