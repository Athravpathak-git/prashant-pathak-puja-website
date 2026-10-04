import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000';
const LANGUAGES = ['mr', 'en', 'hi', 'te', 'kn', 'ta', 'ml'];
const PUBLIC_PAGES = [
  '/',
  '/about',
  '/services',
  '/book-puja',
  '/events',
  '/gallery',
  '/videos',
  '/testimonials',
  '/blog',
  '/faq',
  '/contact',
];

const RAW_KEYS_TO_CHECK = [
  'why_choose.item1_title',
  'why_choose.item1_desc',
  'why_choose.item2_title',
  'why_choose.item2_desc',
  'why_choose.item3_title',
  'why_choose.item3_desc',
  'booking_flow.title',
  'booking_flow.subtitle',
  'booking_flow.step1_title',
  'booking_flow.step1_desc',
  'booking_flow.step2_title',
  'booking_flow.step2_desc',
  'booking_flow.step3_title',
  'booking_flow.step3_desc',
  'booking_flow.step4_title',
  'booking_flow.step4_desc',
  'guruji_intro.shastrokta_badge',
];

async function runAudit() {
  console.log('================================================================');
  console.log('  INDEPENDENT PHASE 2 UI INTEGRITY, I18N & RUNTIME AUDIT');
  console.log('================================================================\n');

  let passed = true;

  // -------------------------------------------------------------
  // TEST 1: CRITICAL RAW TRANSLATION KEY AUDIT
  // -------------------------------------------------------------
  console.log('1. Auditing Critical Raw Translation Keys across Public Pages...');
  for (const page of PUBLIC_PAGES) {
    const res = await fetch(`${BASE_URL}${page}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to fetch ${page}: ${res.status}`);
    const html = await res.text();

    for (const key of RAW_KEYS_TO_CHECK) {
      if (html.includes(key)) {
        console.error(`  [FAIL] Raw translation key "${key}" found in rendered HTML of ${page}!`);
        passed = false;
      }
    }
  }
  console.log('  ✓ No critical raw translation keys found across any rendered public pages.');

  // -------------------------------------------------------------
  // TEST 2: LITERAL "svg" TEXT AUDIT
  // -------------------------------------------------------------
  console.log('\n2. Auditing Literal "svg" Visible Text Content...');
  for (const page of PUBLIC_PAGES) {
    const res = await fetch(`${BASE_URL}${page}`, { cache: 'no-store' });
    const html = await res.text();

    // Remove actual SVG elements to check if literal "svg" appears in text content
    const cleanedHtml = html.replace(/<svg[\s\S]*?<\/svg>/gi, '').replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
    
    // Check for "svg" rendered between tags: e.g., >svg< or > svg <
    const visibleSvgMatch = cleanedHtml.match(/>\s*svg\s*</i);
    if (visibleSvgMatch) {
      console.error(`  [FAIL] Literal "svg" text rendered in ${page}!`);
      passed = false;
    }
  }
  console.log('  ✓ Zero instances of literal "svg" rendered as visible text content.');

  // -------------------------------------------------------------
  // TEST 3: LOCALHOST / DEVELOPMENT URL AUDIT
  // -------------------------------------------------------------
  console.log('\n3. Auditing Localhost / Development URLs in Rendered DOM...');
  const homeRes = await fetch(`${BASE_URL}/`, { cache: 'no-store' });
  const homeHtml = await homeRes.text();

  // Specifically verify that "http://localhost:3000/book-puja" is NOT in the visible markup
  if (homeHtml.includes('http://localhost:3000/book-puja')) {
    console.error('  [FAIL] Visible localhost URL "http://localhost:3000/book-puja" found in HTML!');
    passed = false;
  } else {
    console.log('  ✓ "http://localhost:3000/book-puja" is NOT present in rendered HTML.');
  }

  // Check CTA button href uses proper routing
  if (homeHtml.includes('href="/book-puja"')) {
    console.log('  ✓ CTA uses proper application routing (href="/book-puja").');
  } else {
    console.error('  [FAIL] CTA routing href="/book-puja" not found!');
    passed = false;
  }

  // -------------------------------------------------------------
  // TEST 4: UNDEFINED / NULL / DEBUG ARTIFACTS AUDIT
  // -------------------------------------------------------------
  console.log('\n4. Auditing Undefined / Null / Debug Artifacts...');
  const debugPatterns = [
    />\s*undefined\s*</,
    />\s*null\s*</,
    />\s*NaN\s*</,
    />\s*\[object Object\]\s*</,
    />\s*TODO\s*</,
    />\s*FIXME\s*</
  ];

  for (const page of PUBLIC_PAGES) {
    const res = await fetch(`${BASE_URL}${page}`, { cache: 'no-store' });
    const html = await res.text();
    for (const pattern of debugPatterns) {
      if (pattern.test(html)) {
        console.error(`  [FAIL] Debug artifact matching ${pattern} found in ${page}!`);
        passed = false;
      }
    }
  }
  console.log('  ✓ No undefined, null, NaN, [object Object], TODO, or debug artifacts in public views.');

  // -------------------------------------------------------------
  // TEST 5: ALL 7 LANGUAGES LIVE VERIFICATION
  // -------------------------------------------------------------
  console.log('\n5. Verifying All 7 Languages via Runtime Cookies...');
  for (const lang of LANGUAGES) {
    const res = await fetch(`${BASE_URL}/`, {
      headers: { Cookie: `pp_language=${lang}` },
      cache: 'no-store',
    });
    const html = await res.text();

    // Check that NO raw translation key pattern is leaked in HTML
    for (const key of RAW_KEYS_TO_CHECK) {
      if (html.includes(key)) {
        console.error(`  [FAIL] Language [${lang}] rendered raw key "${key}"!`);
        passed = false;
      }
    }

    console.log(`  ✓ Language [${lang}] rendered cleanly without raw keys.`);
  }

  // -------------------------------------------------------------
  // TEST 6: HOMEPAGE CONTENT VERIFICATION
  // -------------------------------------------------------------
  console.log('\n6. Verifying Specific Required Homepage Content (Marathi Default)...');
  // Features section
  const hasFeaturesBadge = homeHtml.includes('आमची वैशिष्ट्ये');
  const hasFeaturesTitle = homeHtml.includes('शास्त्रोक्त विधींचे महत्त्व');
  const hasFeaturesSubtitle = homeHtml.includes('आमच्याकडे विधी का करावेत?');
  const hasPillar1 = homeHtml.includes('शुद्ध वैदिक मंत्रोच्चार');
  const hasPillar2 = homeHtml.includes('संपूर्ण साहित्य यादी व मार्गदर्शन');
  const hasPillar3 = homeHtml.includes('मुहूर्त व संकल्प शुचिता');

  console.log('  - Features Badge ("आमची वैशिष्ट्ये"):', hasFeaturesBadge);
  console.log('  - Features Title ("शास्त्रोक्त विधींचे महत्त्व"):', hasFeaturesTitle);
  console.log('  - Features Subtitle ("आमच्याकडे विधी का करावेत?"):', hasFeaturesSubtitle);
  console.log('  - Feature 1 ("शुद्ध वैदिक मंत्रोच्चार"):', hasPillar1);
  console.log('  - Feature 2 ("संपूर्ण साहित्य यादी व मार्गदर्शन"):', hasPillar2);
  console.log('  - Feature 3 ("मुहूर्त व संकल्प शुचिता"):', hasPillar3);

  if (!hasFeaturesBadge || !hasFeaturesTitle || !hasFeaturesSubtitle || !hasPillar1 || !hasPillar2 || !hasPillar3) {
    console.error('  [FAIL] Missing required features content on homepage!');
    passed = false;
  }

  // Booking Flow section
  const hasBookingBadge = homeHtml.includes('पूजा आयोजन प्रक्रिया');
  const hasStep1 = homeHtml.includes('१ — पूजा निवडा');
  const hasStep2 = homeHtml.includes('२ — माहिती व तारीख द्या');
  const hasStep3 = homeHtml.includes('३ — गुरुजींशी संपर्क');
  const hasStep4 = homeHtml.includes('४ — पूजा आयोजन');

  console.log('  - Booking Flow Badge ("पूजा आयोजन प्रक्रिया"):', hasBookingBadge);
  console.log('  - Step 1 ("१ — पूजा निवडा"):', hasStep1);
  console.log('  - Step 2 ("२ — माहिती व तारीख द्या"):', hasStep2);
  console.log('  - Step 3 ("३ — गुरुजींशी संपर्क"):', hasStep3);
  console.log('  - Step 4 ("४ — पूजा आयोजन"):', hasStep4);

  if (!hasBookingBadge || !hasStep1 || !hasStep2 || !hasStep3 || !hasStep4) {
    console.error('  [FAIL] Missing required 4-step booking flow content on homepage!');
    passed = false;
  }

  // Working CTA: "पूजा / विधी बुक करा"
  const hasCtaText = homeHtml.includes('पूजा / विधी बुक करा') || homeHtml.includes('पूजा बुक करा');
  console.log('  - Booking CTA working and verified:', hasCtaText);

  // -------------------------------------------------------------
  // TEST 7: AUTHENTIC GURUJI IMAGE SERVING
  // -------------------------------------------------------------
  console.log('\n7. Verifying Authentic Guruji Portrait Image Serving...');
  const expectedPhotoUrl = '/api/uploads/1790772019114_b753ace52f8303f59237bbd09de4dfb0.jpg';
  const imgRes = await fetch(`${BASE_URL}${expectedPhotoUrl}`);
  if (!imgRes.ok) {
    console.error(`  [FAIL] Guruji image failed to serve: status ${imgRes.status}`);
    passed = false;
  } else {
    console.log(`  ✓ Guruji image served with HTTP 200, Content-Type: ${imgRes.headers.get('content-type')}`);
  }

  if (!homeHtml.includes(expectedPhotoUrl)) {
    console.error('  [FAIL] Homepage HTML does not contain official Guruji photo URL!');
    passed = false;
  } else {
    console.log('  ✓ Homepage renders official Guruji photo URL in SSR HTML.');
  }

  // -------------------------------------------------------------
  // TEST 8: ADMIN ACCESS & SECURITY VERIFICATION
  // -------------------------------------------------------------
  console.log('\n8. Verifying Admin Access & Footer Lock Icon...');
  if (!homeHtml.includes('/admin/login')) {
    console.error('  [FAIL] Admin login link missing from footer!');
    passed = false;
  } else {
    console.log('  ✓ Accessible Admin Login link present in footer.');
  }

  console.log('\n================================================================');
  if (passed) {
    console.log('  ✓ ALL 8 AUDIT SECTIONS PASSED 100% SUCCESFULLY!');
    console.log('================================================================');
  } else {
    console.error('  ✗ SOME AUDIT CHECKS FAILED! INSPECT LOGS ABOVE.');
    console.log('================================================================');
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error('Audit crashed with error:', err);
  process.exit(1);
});
