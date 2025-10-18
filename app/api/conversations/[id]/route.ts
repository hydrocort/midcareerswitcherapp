import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: params.id },
      include: {
        questions: {
          include: {
            attempts: {
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: 'Conversation not found' },
        { status: 404 }
      );
    }

    // Parse JSON strings
    const response = {
      ...conversation,
      clarifyingQuestions: conversation.clarifyingQuestions
        ? JSON.parse(conversation.clarifyingQuestions)
        : null,
      clarifyingAnswers: conversation.clarifyingAnswers
        ? JSON.parse(conversation.clarifyingAnswers)
        : null,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversation' },
      { status: 500 }
    );
  }
}

