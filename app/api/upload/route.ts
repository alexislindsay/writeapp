import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    const allowedTypes = ['.txt', '.md', '.docx'];

    if (!allowedTypes.includes(ext)) {
      return NextResponse.json({
        error: `Invalid file type. Please upload one of: ${allowedTypes.join(', ')}`
      }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = '';

    // Extract text based on file type
    if (ext === '.txt' || ext === '.md') {
      // Plain text files - just decode
      extractedText = buffer.toString('utf-8');
    } else if (ext === '.docx') {
      // Use mammoth for DOCX files
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json({
        error: 'Could not extract text from document'
      }, { status: 400 });
    }

    // Return the extracted content
    return NextResponse.json({
      success: true,
      title: title || file.name.replace(/\.[^/.]+$/, ''),
      content: extractedText.trim(),
      filename: file.name
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      error: 'Failed to process document',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
