import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get('text') || searchParams.get('msg') || 'जय श्री गणेश! मला पूजा व धार्मिक विधींबद्दल माहिती हवी आहे.';

  const rawPhone = process.env.WHATSAPP_PHONE || process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '';
  const privatePhone = rawPhone.replace(/[^0-9]/g, '');

  let destination = '';
  if (privatePhone) {
    destination = `https://wa.me/${privatePhone}?text=${encodeURIComponent(text)}`;
  } else {
    // If private phone not set in server env, direct to standard WhatsApp text share with Guruji's official identity
    const shareText = text.includes('@PrashantPathakGuruji') || text.includes('|| श्री गणेशाय नमः ||') || text.includes('॥ श्री गणेशाय नमः ॥')
      ? text
      : `|| श्री गणेशाय नमः ||\nसस्नेह नमस्कार गुरुजी (@PrashantPathakGuruji),\n${text}`;
    destination = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  }

  return NextResponse.redirect(destination, 307);
}
