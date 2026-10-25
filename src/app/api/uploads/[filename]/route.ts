import { NextRequest, NextResponse } from 'next/server';
import { getFileFromStorage } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { filename: string } }
) {
  const filename = params.filename;

  // Strict sanitization: alphanumeric, underscores, hyphens, and single dot for extension
  if (!filename || !/^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/.test(filename)) {
    return new NextResponse('Invalid filename', { status: 400 });
  }

  try {
    const file = await getFileFromStorage(filename);

    if (!file) {
      return new NextResponse('File not found', { status: 404 });
    }

    // If external storage redirect
    if (file.redirectUrl) {
      return NextResponse.redirect(file.redirectUrl, { status: 307 });
    }

    if (file.buffer) {
      const contentType = file.mimeType || 'application/octet-stream';

      return new NextResponse(new Uint8Array(file.buffer), {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Length': String(file.size || file.buffer.length),
          'Cache-Control': 'public, max-age=31536000, immutable',
          'X-Content-Type-Options': 'nosniff',
          'Accept-Ranges': 'bytes',
          ETag: `"${filename}"`,
        },
      });
    }

    return new NextResponse('File not found', { status: 404 });
  } catch (err: any) {
    console.error('[UPLOADS-SERVE-ERROR]', err);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
