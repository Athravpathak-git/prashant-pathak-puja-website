import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { checkRateLimit, sanitizeString, generateBookingReference } from '@/lib/security';
import { logAudit } from '@/lib/audit';

// GET: ADMIN ONLY! Public visitors can NEVER list or view bookings.
export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = Math.max(1, Number(searchParams.get('page') || 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get('limit') || 20)));
    const offset = (page - 1) * limit;

    let sql = 'SELECT * FROM bookings WHERE 1=1';
    let countSql = 'SELECT COUNT(*) FROM bookings WHERE 1=1';
    const params: any[] = [];
    const countParams: any[] = [];

    if (status && ['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
      params.push(status);
      countParams.push(status);
      sql += ` AND status = $${params.length}`;
      countSql += ` AND status = $${countParams.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      countParams.push(`%${search}%`);
      const pIdx = params.length;
      sql += ` AND (full_name ILIKE $${pIdx} OR reference_no ILIKE $${pIdx} OR mobile ILIKE $${pIdx} OR city ILIKE $${pIdx} OR service_name ILIKE $${pIdx})`;
      countSql += ` AND (full_name ILIKE $${pIdx} OR reference_no ILIKE $${pIdx} OR mobile ILIKE $${pIdx} OR city ILIKE $${pIdx} OR service_name ILIKE $${pIdx})`;
    }

    sql += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    const [dataRes, countRes] = await Promise.all([
      query(sql, params),
      query(countSql, countParams),
    ]);

    const total = Number(countRes.rows[0].count);

    return NextResponse.json({
      bookings: dataRes.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    console.error('[BOOKINGS-GET]', err);
    return NextResponse.json({ error: 'बुकिंग यादी लोड करताना त्रुटी आली. / Internal error.' }, { status: 500 });
  }
}

// POST: Public submission with strict server-side validation & rate limiting
export async function POST(req: NextRequest) {
  // Rate limit: 10 booking requests per hour per IP
  const rate = checkRateLimit(req, 'booking_submit', 10, 3600);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'खूप जास्त बुकिंग विनंत्या पाठवल्या गेल्या आहेत. कृपया काही वेळाने प्रयत्न करा. / Rate limit exceeded.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    const fullName = sanitizeString(body.full_name);
    const mobile = sanitizeString(body.mobile);
    const email = sanitizeString(body.email);
    const serviceName = sanitizeString(body.service_name || body.service);
    const serviceId = body.service_id ? Number(body.service_id) : null;
    const preferredDate = sanitizeString(body.preferred_date);
    const preferredTime = sanitizeString(body.preferred_time);
    const peopleCount = body.people_count ? Number(body.people_count) : null;
    const address = sanitizeString(body.address);
    const area = sanitizeString(body.area);
    const city = sanitizeString(body.city || 'Nagpur');
    const pincode = sanitizeString(body.pincode);
    const message = sanitizeString(body.message);

    // Validation
    if (!fullName || fullName.length < 2) {
      return NextResponse.json({ error: 'कृपया संपूर्ण नाव प्रविष्ट करा. / Full name is required.' }, { status: 400 });
    }

    if (!mobile || !/^[0-9+ -]{8,15}$/.test(mobile.replace(/\s+/g, ''))) {
      return NextResponse.json({ error: 'कृपया वैध मोबाईल क्रमांक प्रविष्ट करा. / Valid mobile number is required.' }, { status: 400 });
    }

    if (!preferredDate) {
      return NextResponse.json({ error: 'कृपया अपेक्षित तारीख निवडा. / Preferred date is required.' }, { status: 400 });
    }

    if (!address || address.length < 5) {
      return NextResponse.json({ error: 'कृपया पूर्ण पत्ता प्रविष्ट करा. / Detailed address is required.' }, { status: 400 });
    }

    // Generate reference PUJA-2026-XXXXXX
    const referenceNo = generateBookingReference();

    const res = await query(`
      INSERT INTO bookings (
        reference_no, service_id, service_name, full_name, mobile, email,
        preferred_date, preferred_time, people_count, address, area, city, pincode,
        message, status
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'Pending'
      ) RETURNING id, reference_no, full_name, service_name, preferred_date, status, created_at
    `, [
      referenceNo, serviceId, serviceName || 'धार्मिक विधी', fullName, mobile, email || null,
      preferredDate, preferredTime || 'सकाळ (Morning)', peopleCount, address, area, city, pincode,
      message
    ]);

    const createdBooking = res.rows[0];

    // Create In-App Notification for Admin
    await query(`
      INSERT INTO notifications (title_mr, title_en, message_mr, message_en, type, reference_id)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      'नवीन पूजा बुकिंग प्राप्त झाली',
      'New Puja Booking Received',
      `${fullName} यांनी ${serviceName || 'विधी'}साठी नवीन बुकिंग विनंती पाठवली आहे (संदर्भ: ${referenceNo})`,
      `${fullName} submitted a new booking request for ${serviceName || 'Puja'} (Ref: ${referenceNo})`,
      'booking',
      referenceNo,
    ]);

    return NextResponse.json({
      success: true,
      reference_no: referenceNo,
      booking: createdBooking,
      message: 'आपली बुकिंग विनंती यशस्वीरित्या नोंदवली गेली आहे. गुरुजी लवकरच संपर्क साधतील.',
    });
  } catch (err: any) {
    console.error('[BOOKING-SUBMIT]', err);
    return NextResponse.json({ error: 'बुकिंग नोंदवताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.' }, { status: 500 });
  }
}
