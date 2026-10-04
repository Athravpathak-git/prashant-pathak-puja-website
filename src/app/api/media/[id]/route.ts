import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import fs from 'fs';
import path from 'path';
import { logAudit } from '@/lib/audit';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(req);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const id = Number(params.id);
    const res = await query('SELECT * FROM media WHERE id = $1', [id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'फाईल सापडली नाही.' }, { status: 404 });
    }

    const file = res.rows[0];
    const filePath = path.join(UPLOAD_DIR, file.filename);

    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error('[UNLINK-FAIL]', err);
      }
    }

    await query('DELETE FROM media WHERE id = $1', [id]);
    await logAudit('DELETE_MEDIA', 'media', id, { filename: file.filename }, req, auth.admin);

    return NextResponse.json({ success: true, message: 'फाईल हटवली गेली.' });
  } catch (err: any) {
    console.error('[MEDIA-DELETE]', err);
    return NextResponse.json({ error: 'हटवताना त्रुटी.' }, { status: 500 });
  }
}
