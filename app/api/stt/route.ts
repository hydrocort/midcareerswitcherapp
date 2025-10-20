import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudio } from '@/lib/openai';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const questionId = formData.get('questionId') as string;
    const conversationId = formData.get('conversationId') as string;

    if (!audioFile || !questionId || !conversationId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save audio file
    const audioDir = path.join(
      process.cwd(),
      'public',
      'audio',
      conversationId,
      'responses'
    );
    await fs.mkdir(audioDir, { recursive: true });

    const timestamp = Date.now();
    const audioFileName = `${questionId}_${timestamp}.webm`;
    const audioPath = path.join(audioDir, audioFileName);
    const publicPath = `/audio/${conversationId}/responses/${audioFileName}`;

    const buffer = Buffer.from(await audioFile.arrayBuffer());
    await fs.writeFile(audioPath, buffer);

    // Transcribe audio
    const transcription = await transcribeAudio(buffer);

    return NextResponse.json({
      transcription,
      audioPath: publicPath,
    });
  } catch (error) {
    console.error('Error transcribing audio:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to transcribe audio';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

