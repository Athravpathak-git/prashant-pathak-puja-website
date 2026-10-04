import { query } from '@/lib/db';
import { AboutClient } from '@/components/AboutClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AboutPage() {
  let profile = null;
  try {
    const res = await query('SELECT * FROM website_settings WHERE id = 1');
    profile = res.rows[0] || null;
  } catch (err) {
    console.error('[About SSR Error]', err);
  }

  return <AboutClient initialProfile={profile} />;
}
