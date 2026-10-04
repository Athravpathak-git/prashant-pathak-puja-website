import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { checkRateLimit, sanitizeString } from '@/lib/security';
import { logAudit } from '@/lib/audit';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const all = searchParams.get('all');

    let sql = 'SELECT * FROM testimonials WHERE 1=1';
    if (all !== 'true') {
      sql += ' AND is_approved = TRUE';
    }
    sql += ' ORDER BY created_at DESC';

    const res = await query(sql);
    return NextResponse.json({ testimonials: res.rows });
  } catch (err: any) {
    console.error('[TESTIMONIALS-GET]', err);
    return NextResponse.json({ error: 'अभिप्राय लोड करताना त्रुटी. / Internal error.' }, { status: 500 });
  }
}

// Public feedback submission or Admin add
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const author_name_mr = sanitizeString(body.author_name_mr || body.name);
    const author_name_en = sanitizeString(body.author_name_en || author_name_mr);
    const location_mr = sanitizeString(body.location_mr || body.location || 'नागपूर');
    const location_en = sanitizeString(body.location_en || location_mr);
    const rating = Math.min(5, Math.max(1, Number(body.rating) || 5));
    const comment_mr = sanitizeString(body.comment_mr || body.comment);
    const comment_en = sanitizeString(body.comment_en || comment_mr);

    if (!author_name_mr || !comment_mr) {
      return NextResponse.json({ error: 'नाव व अभिप्राय आवश्यक आहे.' }, { status: 400 });
    }

    // Check if submitted by admin or visitor
    const adminAuth = await requireAdmin(req);
    const isAdmin = !('error' in adminAuth);
    const is_approved = isAdmin ? (body.is_approved !== undefined ? Boolean(body.is_approved) : true) : false;

    if (!isAdmin) {
      const rate = checkRateLimit(req, 'testimonial_submit', 5, 3600);
      if (!rate.allowed) {
        return NextResponse.json({ error: 'मर्यादा ओलांडली. कृपया नंतर प्रयत्न करा.' }, { status: 429 });
      }
    }

    const res = await query(`
      INSERT INTO testimonials (author_name_mr, author_name_en, location_mr, location_en, rating, comment_mr, comment_en, is_approved)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [author_name_mr, author_name_en, location_mr, location_en, rating, comment_mr, comment_en, is_approved]);

    if (isAdmin) {
      await logAudit('ADD_TESTIMONIAL', 'testimonials', res.rows[0].id, { author: author_name_mr }, req, adminAuth.admin);
    } else {
      // In-app notification for admin to review
      await query(`
        INSERT INTO notifications (title_mr, title_en, message_mr, message_en, type, reference_id)
        VALUES ($1, $2, $3, $4, 'testimonial', $5)
      `, [
        'नवीन भाविक अभिप्राय प्राप्त झाला',
        'New Devotee Testimonial Received',
        `${author_name_mr} यांनी नवीन अभिप्राय पाठवला आहे (मंजुरी बाकी).`,
        `${author_name_mr} submitted a new testimonial (Pending Approval).`,
        String(res.rows[0].id)
      ]);
    }

    return NextResponse.json({
      success: true,
      testimonial: res.rows[0],
      message: isAdmin ? 'अभिप्राय जोडला गेला.' : 'आपला अभिप्राय प्रशासकीय पडताळणीनंतर प्रकाशित केला जाईल. धन्यवाद!',
    });
  } catch (err: any) {
    console.error('[TESTIMONIAL-POST]', err);
    return NextResponse.json({ error: 'अभिप्राय नोंदवताना त्रुटी. / Internal error.' }, { status: 500 });
  }
}
