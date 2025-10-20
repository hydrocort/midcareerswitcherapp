import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';

// DELETE - Delete an attempt
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const attemptId = params.id;

    // Get attempt to find audio file path
    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt) {
      return NextResponse.json(
        { error: 'Attempt not found' },
        { status: 404 }
      );
    }

    // Delete audio file if it exists
    if (attempt.audioPath) {
      try {
        const audioPath = path.join(process.cwd(), 'public', attempt.audioPath);
        await fs.unlink(audioPath);
        console.log('Deleted audio file:', audioPath);
      } catch (error) {
        console.error('Error deleting audio file:', error);
        // Continue even if file deletion fails
      }
    }

    // Delete attempt from database
    await prisma.attempt.delete({
      where: { id: attemptId },
    });

    return NextResponse.json({ success: true, message: 'Attempt deleted successfully' });
  } catch (error) {
    console.error('Error deleting attempt:', error);
    return NextResponse.json(
      { error: 'Failed to delete attempt' },
      { status: 500 }
    );
  }
}

