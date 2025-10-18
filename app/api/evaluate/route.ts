import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getInitialEvaluation, generateClarifyingQuestions } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { conversationId } = await request.json();

    if (!conversationId) {
      return NextResponse.json(
        { error: 'Missing conversationId' },
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

    // Get initial evaluation
    const evaluation = await getInitialEvaluation(
      conversation.resumeText,
      conversation.jobDescription
    );

    // Generate clarifying questions
    const questions = await generateClarifyingQuestions(
      conversation.resumeText,
      conversation.jobDescription,
      evaluation.gaps
    );

    // Update conversation with initial evaluation
    const updatedConversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        initialScore: evaluation.score,
        initialEvaluation: JSON.stringify(evaluation),
        clarifyingQuestions: JSON.stringify(questions),
      },
    });

    return NextResponse.json({
      evaluation,
      questions,
      conversation: updatedConversation,
    });
  } catch (error) {
    console.error('Error evaluating resume:', error);
    return NextResponse.json(
      { error: 'Failed to evaluate resume' },
      { status: 500 }
    );
  }
}

