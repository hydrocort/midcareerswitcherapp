import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateInterviewQuestions, FinalEvaluation } from '@/lib/openai';

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

    const finalEvaluation: FinalEvaluation = conversation.finalEvaluation
      ? JSON.parse(conversation.finalEvaluation)
      : null;

    if (!finalEvaluation) {
      return NextResponse.json(
        { error: 'Final evaluation not found' },
        { status: 400 }
      );
    }

    // Generate interview questions
    const questions = await generateInterviewQuestions(
      conversation.resumeText,
      conversation.jobDescription,
      finalEvaluation
    );

    // Save questions to database
    const savedQuestions = await Promise.all(
      questions.map((q) =>
        prisma.question.create({
          data: {
            conversationId,
            category: q.category,
            questionText: q.question,
          },
        })
      )
    );

    return NextResponse.json({ questions: savedQuestions });
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}

