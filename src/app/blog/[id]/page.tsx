import type { Metadata } from 'next';
import { query } from '@/lib/db';
import { BlogDetailClient } from '@/components/BlogDetailClient';

export const dynamic = 'force-dynamic';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const identifier = params.id;
  let post: any = null;

  try {
    const isNum = !isNaN(Number(identifier));
    const sql = isNum
      ? 'SELECT * FROM blog_posts WHERE id = $1 LIMIT 1'
      : 'SELECT * FROM blog_posts WHERE slug = $1 LIMIT 1';
    const res = await query(sql, [identifier]);
    post = res.rows[0] || null;
  } catch (err) {
    // DB fallback
  }

  const title = post
    ? post.title_mr
    : 'धार्मिक लेख';
  const description =
    post?.excerpt_mr ||
    'वेदमूर्ती प्रशांत पाठक गुरुजींच्या अधिकृत संकेतस्थळावरील शास्त्रोक्त धार्मिक लेख व अभ्यासपूर्ण माहिती. नागपूर, महाराष्ट्र.';
  const canonicalUrl = `https://prashant-pathak-puja-website.vercel.app/blog/${identifier}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      locale: 'mr_IN',
      type: 'article',
    },
  };
}

export default function BlogPostDetailPage({ params }: Props) {
  return <BlogDetailClient initialPostId={params.id} />;
}
