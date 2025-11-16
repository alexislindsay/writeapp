import { NextResponse } from 'next/server';
import path from 'path';
import mammoth from 'mammoth';

// Force Node.js runtime for this API route
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const ext = path.extname(file.name).toLowerCase();
    const allowedTypes = ['.txt', '.md', '.docx', '.pdf'];

    if (!allowedTypes.includes(ext)) {
      return NextResponse.json({
        error: `Invalid file type. Please upload one of: ${allowedTypes.join(', ')}`
      }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let contentHtml = '';
    let contentType = 'html';

    // Convert documents to HTML (preserves images and formatting)
    if (ext === '.txt') {
      // Plain text - wrap in pre tag to preserve formatting
      const text = buffer.toString('utf-8');
      contentHtml = `<pre style="white-space: pre-wrap; font-family: inherit;">${text}</pre>`;
    } else if (ext === '.md') {
      // Markdown - convert to HTML (basic conversion)
      const text = buffer.toString('utf-8');
      // Simple markdown to HTML - you could use a library like marked for more features
      contentHtml = text
        .split('\n\n')
        .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
        .join('');
    } else if (ext === '.docx') {
      // Use mammoth to convert DOCX to HTML with embedded images
      const result = await mammoth.convertToHtml(
        { buffer },
        {
          convertImage: mammoth.images.imgElement(async (image) => {
            // Convert images to base64 data URLs
            const imageBuffer = await image.read();
            const base64 = imageBuffer.toString('base64');
            const contentType = image.contentType || 'image/png';
            return {
              src: `data:${contentType};base64,${base64}`
            };
          })
        }
      );
      contentHtml = result.value;
    } else if (ext === '.pdf') {
      // For PDFs, return the file as base64 to render client-side
      const base64 = buffer.toString('base64');
      contentType = 'pdf';
      contentHtml = base64; // Client will handle PDF rendering
    }

    if (!contentHtml || contentHtml.trim().length === 0) {
      return NextResponse.json({
        error: 'Could not process document'
      }, { status: 400 });
    }

    // Return the converted content
    return NextResponse.json({
      success: true,
      title: title || file.name.replace(/\.[^/.]+$/, ''),
      content: contentHtml,
      contentType,
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
