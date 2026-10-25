import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { checkRateLimit, validateMediaMagicBytes, generateSafeFileName } from '@/lib/security';
import { logAudit } from '@/lib/audit';
import { uploadMediaFile } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // 1. Admin authorization check
  const auth = await requireAdmin(req);
  if ('error' in auth) {
    return auth.error;
  }

  // 2. Rate limit check (uploads: 60/hr)
  const rate = checkRateLimit(req, 'upload', 60, 3600);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'अपलोड मर्यादा ओलांडली. कृपया नंतर प्रयत्न करा. / Rate limit exceeded.' },
      { status: 429 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const category = (formData.get('category') as string) || 'general';

    if (!file) {
      return NextResponse.json(
        { error: 'कोणतीही फाईल निवडलेली नाही. / No file provided.' },
        { status: 400 }
      );
    }

    // 3. Absolute ceiling check (50MB)
    const ABSOLUTE_MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > ABSOLUTE_MAX_SIZE) {
      return NextResponse.json(
        { error: 'फाईल आकार ५० MB पेक्षा जास्त असू नये. / File exceeds 50MB limit.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Validate magic bytes / file signature
    const magic = validateMediaMagicBytes(buffer);
    if (!magic.valid || !magic.ext || !magic.mime) {
      return NextResponse.json(
        {
          error:
            'अवैध फाईल प्रकार. केवळ JPG, PNG, WebP, GIF, SVG प्रतिमा आणि MP4, WebM व्हिडीओ अनुमत आहेत. / Only JPG, PNG, WebP, GIF, SVG images and MP4, WebM videos are allowed.',
        },
        { status: 400 }
      );
    }

    // 5. Specific type size limits: 10MB for images, 50MB for videos
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
    if (magic.type === 'image' && file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: 'प्रतिमेचा आकार कमाल १० MB असावा. / Image exceeds 10MB limit.' },
        { status: 400 }
      );
    }

    // 6. Generate random, unguessable safe filename
    const safeFilename = generateSafeFileName(magic.ext);

    // 7. Upload to persistent storage (Cloudinary, Vercel Blob, or PostgreSQL Database fallback)
    const storageResult = await uploadMediaFile({
      buffer,
      filename: safeFilename,
      originalName: file.name,
      mimeType: magic.mime,
      category,
    });

    // 8. Audit log entry
    await logAudit(
      'UPLOAD_MEDIA',
      'media',
      storageResult.id,
      {
        filename: safeFilename,
        originalName: file.name,
        size: file.size,
        mime: magic.mime,
        provider: storageResult.storageProvider,
      },
      req,
      auth.admin
    );

    return NextResponse.json({
      success: true,
      url: storageResult.url,
      fileUrl: storageResult.url, // Backwards compatibility for settings page
      media: storageResult,
      provider: storageResult.storageProvider,
    });
  } catch (err: any) {
    console.error('[UPLOAD-ERROR]', err);
    return NextResponse.json(
      { error: 'अपलोड अयशस्वी. कृपया पुन्हा प्रयत्न करा. / Upload failed.' },
      { status: 500 }
    );
  }
}
