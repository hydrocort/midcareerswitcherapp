import { NextRequest, NextResponse } from 'next/server';
import { parseDocumentFromBuffer } from '@/lib/documentParser';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { text, fileName } = await parseDocumentFromBuffer(buffer, file.name);

    return NextResponse.json({
      text,
      fileName,
    });
  } catch (error) {
    console.error('Error parsing document:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to parse document' },
      { status: 500 }
    );
  }
}

