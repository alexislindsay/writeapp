import { NextResponse } from 'next/server';
import path from 'path';

// Dynamic imports for document parsers
const getPdfParser = async () => {
  const pdfParse = await import('pdf-parse');
  return pdfParse.default;
};

const getMammoth = async () => {
  const mammoth = await import('mammoth');
  return mammoth;
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    if (!['.pdf', '.doc', '.docx'].includes(ext)) {
      return NextResponse.json({ error: 'Invalid file type. Please upload a PDF or Word document.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = '';

    // Extract text based on file type
    if (ext === '.pdf') {
      const pdfParse = await getPdfParser();
      const data = await pdfParse(buffer);
      extractedText = data.text;
    } else if (ext === '.docx') {
      const mammoth = await getMammoth();
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else if (ext === '.doc') {
      return NextResponse.json({
        error: 'Legacy .doc files are not supported. Please save as .docx or PDF.'
      }, { status: 400 });
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
