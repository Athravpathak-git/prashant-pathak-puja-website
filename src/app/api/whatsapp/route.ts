import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text') || searchParams.get('msg') || 'जय श्री गणेश! मला पूजा व धार्मिक विधींबद्दल माहिती हवी आहे.';

  const privatePhone = process.env.WHATSAPP_PHONE ? process.env.WHATSAPP_PHONE.replace(/[^0-9]/g, '') : '';

  let destination = '';
  if (privatePhone) {
    destination = `https://wa.me/${privatePhone}?text=${encodeURIComponent(text)}`;
  } else {
    // If private phone not set in server env, direct to standard WhatsApp text share without exposing credentials
    destination = `https://api.whatsapp.com/send?text=${encodeURIComponent(`|| श्री गणेशाय नमः ||\nसस्नेह नमस्कार गुरुजी (@PrashantPathakGuruji),\n${text}`)}`;
  }

  return NextResponse.redirect(destination, 307);
}
