import { NextRequest, NextResponse } from 'next/server';
import { textToSpeech } from '@/lib/elevenlabs';
import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const { text, questionId, conversationId } = await request.json();

    if (!text || !questionId || !conversationId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if audio already exists (caching)
    const audioDir = path.join(process.cwd(), 'public', 'audio', conversationId);
    const audioPath = path.join(audioDir, `${questionId}.mp3`);
    const publicPath = `/audio/${conversationId}/${questionId}.mp3`;

    if (existsSync(audioPath)) {
      return NextResponse.json({ audioUrl: publicPath });
    }

    // Generate audio
    const audioBuffer = await textToSpeech(text);

    // Create directory if it doesn't exist
    await fs.mkdir(audioDir, { recursive: true });

    // Save audio file
    await fs.writeFile(audioPath, audioBuffer);

    return NextResponse.json({ audioUrl: publicPath });
  } catch (error) {
    console.error('Error generating speech:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
}

