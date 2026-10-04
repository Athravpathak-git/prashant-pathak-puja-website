import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { requireAdmin } from '@/lib/auth';
import { checkRateLimit, validateImageMagicBytes, generateSafeFileName } from '@/lib/security';
import { query } from '@/lib/db';
import { logAudit } from '@/lib/audit';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

// Ensure directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

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
      return NextResponse.json({ error: 'कोणतीही फाईल निवडलेली नाही. / No file provided.' }, { status: 400 });
    }

    // Check size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'फाईल आकार १० MB पेक्षा लहान असावा. / File exceeds 10MB limit.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate actual magic bytes
    const magic = validateImageMagicBytes(buffer);
    if (!magic.valid || !magic.ext) {
      return NextResponse.json(
        { error: 'अवैध फाईल प्रकार. केवळ JPG, PNG किंवा WebP फाईल्स अनुमत आहेत. / Only JPG, PNG, WebP allowed.' },
        { status: 400 }
      );
    }

    // Generate safe random filename
    const safeFilename = generateSafeFileName(magic.ext);
    const targetPath = path.join(UPLOAD_DIR, safeFilename);

    // Prevent path traversal
    if (!targetPath.startsWith(UPLOAD_DIR)) {
      return NextResponse.json({ error: 'सुरक्षा त्रुटी: अवैध मार्ग. / Path traversal detected.' }, { status: 400 });
    }

    fs.writeFileSync(targetPath, buffer);

    const publicUrl = `/api/uploads/${safeFilename}`;

    // Store in media table
    const mediaRes = await query(`
      INSERT INTO media (filename, original_name, mime_type, file_size, category, url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, filename, url, created_at
    `, [
      safeFilename,
      file.name.slice(0, 200),
      `image/${magic.ext === 'jpg' ? 'jpeg' : magic.ext}`,
      file.size,
      category,
      publicUrl,
    ]);

    await logAudit('UPLOAD_MEDIA', 'media', mediaRes.rows[0].id, {
      filename: safeFilename,
      size: file.size,
      mime: magic.ext,
    }, req, auth.admin);

    return NextResponse.json({
      success: true,
      media: mediaRes.rows[0],
      url: publicUrl,
    });
  } catch (err: any) {
    console.error('[UPLOAD-ERROR]', err);
    return NextResponse.json(
      { error: 'अपलोड अयशस्वी. कृपया पुन्हा प्रयत्न करा. / Upload failed.' },
      { status: 500 }
    );
  }
}
