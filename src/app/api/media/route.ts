import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    let sql = 'SELECT * FROM media WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'all') {
      params.push(category);
      sql += ` AND category = $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (original_name ILIKE $${params.length} OR filename ILIKE $${params.length})`;
    }

    sql += ' ORDER BY created_at DESC';

    const res = await query(sql, params);
    return NextResponse.json({ media: res.rows });
  } catch (err: any) {
    console.error('[MEDIA-GET]', err);
    return NextResponse.json({ error: 'मिडीया लोड करताना त्रुटी.' }, { status: 500 });
  }
}
