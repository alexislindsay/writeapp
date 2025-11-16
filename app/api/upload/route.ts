import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  if (!file) {
    return NextResponse.json({ error: 'No file' }, { status: 400 });
  }

  // Validate file extension
  const fileName = file.name.toLowerCase();
  const validExtensions = ['.pdf', '.doc', '.docx'];
  const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));

  if (!hasValidExtension) {
    return NextResponse.json({ error: 'Invalid file type. Please upload PDF, DOC, or DOCX files.' }, { status: 400 });
  }

  // Note: File storage is not implemented for serverless environment
  // In production, you would integrate with cloud storage like:
  // - Vercel Blob Storage
  // - AWS S3
  // - Cloudflare R2
  // - Google Cloud Storage

  return NextResponse.json({
    error: 'File upload not configured. Please set up cloud storage integration.',
    message: 'This feature requires cloud storage configuration for serverless deployment.'
  }, { status: 501 });
}
