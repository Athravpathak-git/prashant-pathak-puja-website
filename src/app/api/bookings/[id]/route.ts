import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { sanitizeString } from '@/lib/security';
import { logAudit } from '@/lib/audit';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(req);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const id = Number(params.id);
    const res = await query('SELECT * FROM bookings WHERE id = $1', [id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'बुकिंग सापडली नाही. / Booking not found.' }, { status: 404 });
    }

    return NextResponse.json({ booking: res.rows[0] });
  } catch (err: any) {
    console.error('[BOOKING-GET-ID]', err);
    return NextResponse.json({ error: 'त्रुटी आली. / Internal error.' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin(req);
  if ('error' in auth) {
    return auth.error;
  }

  try {
    const id = Number(params.id);
    const body = await req.json();

    const status = sanitizeString(body.status);
    const adminNotes = sanitizeString(body.admin_notes || '');

    if (!['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
      return NextResponse.json({ error: 'अवैध स्थिती. / Invalid status.' }, { status: 400 });
    }

    const res = await query(`
      UPDATE bookings
      SET status = $1, admin_notes = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `, [status, adminNotes, id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'बुकिंग सापडली नाही. / Not found.' }, { status: 404 });
    }

    await logAudit(`BOOKING_${status.toUpperCase()}`, 'bookings', id, {
      reference_no: res.rows[0].reference_no,
      new_status: status,
      customer: res.rows[0].full_name,
    }, req, auth.admin);

    return NextResponse.json({ success: true, booking: res.rows[0] });
  } catch (err: any) {
    console.error('[BOOKING-PUT]', err);
    return NextResponse.json({ error: 'स्थिती बदलताना त्रुटी. / Internal error.' }, { status: 500 });
  }
}

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
    const res = await query('DELETE FROM bookings WHERE id = $1 RETURNING id, reference_no, full_name', [id]);

    if (res.rows.length === 0) {
      return NextResponse.json({ error: 'बुकिंग सापडली नाही. / Not found.' }, { status: 404 });
    }

    await logAudit('DELETE_BOOKING', 'bookings', id, { deleted: res.rows[0] }, req, auth.admin);

    return NextResponse.json({ success: true, message: 'बुकिंग हटवली गेली. / Deleted successfully.' });
  } catch (err: any) {
    console.error('[BOOKING-DELETE]', err);
    return NextResponse.json({ error: 'हटवताना त्रुटी आली. / Internal error.' }, { status: 500 });
  }
}
