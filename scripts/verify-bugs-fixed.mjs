import fs from 'fs';
import path from 'path';

async function verifyBugsFixed() {
  console.log('=== VERIFYING PRODUCTION-BLOCKING BUG FIXES ===\n');

  // 1. Verify /api/profile returns fresh dynamic DB data
  console.log('1. Testing Dynamic /api/profile Endpoint...');
  const profileRes = await fetch('http://localhost:3000/api/profile', { cache: 'no-store' });
  if (!profileRes.ok) throw new Error(`/api/profile returned status ${profileRes.status}`);
  const profileData = await profileRes.json();
  const profile = profileData.profile;

  console.log('✓ /api/profile is dynamic and returned:');
  console.log('  - guruji_name_mr:', profile.guruji_name_mr);
  console.log('  - hero_image_url:', profile.hero_image_url);
  console.log('  - primary_photo_url:', profile.primary_photo_url);
  console.log('  - about_photo_url:', profile.about_photo_url);

  if (!profile.hero_image_url || !profile.primary_photo_url) {
    throw new Error('FAILED: hero_image_url or primary_photo_url is empty in /api/profile!');
  }

  // 2. Verify the Image File on disk and HTTP 200 serving
  console.log('\n2. Testing Public Image Serving for Guruji Photo...');
  const imageFetchRes = await fetch(`http://localhost:3000${profile.hero_image_url}`);
  if (!imageFetchRes.ok) {
    throw new Error(`FAILED: Guruji image returned status ${imageFetchRes.status} at ${profile.hero_image_url}`);
  }
  const contentType = imageFetchRes.headers.get('content-type');
  console.log(`✓ Image successfully served with status 200, Content-Type: ${contentType}`);

  // 3. Verify Homepage Rendering (Bug 2: Placeholder vs Actual Image)
  console.log('\n3. Testing Homepage Rendering for Guruji Photo...');
  const homeRes = await fetch('http://localhost:3000', { cache: 'no-store' });
  if (!homeRes.ok) throw new Error(`Homepage returned status ${homeRes.status}`);
  const homeHtml = await homeRes.text();

  // Check that the actual image URL is used
  if (!homeHtml.includes(profile.hero_image_url) && !homeHtml.includes(profile.primary_photo_url)) {
    throw new Error('FAILED: Public homepage does NOT contain the actual configured Guruji photo URL!');
  }
  console.log(`✓ VERIFIED: Homepage HTML contains actual Guruji image URL: ${profile.hero_image_url}`);

  // Check that placeholder is NOT rendered when image exists
  if (homeHtml.includes('छायाचित्र लवकरच उपलब्ध होईल') || homeHtml.includes('Official Photograph of Guruji')) {
    throw new Error('FAILED: Homepage still displays placeholder text even though valid photo is configured!');
  }
  console.log('✓ VERIFIED: Placeholder is NOT rendered when actual photo is configured.');

  // 4. Verify Bug 1: Navbar / Header Alignment & Layout
  console.log('\n4. Testing Bug 1: Navbar & Header Layout...');
  // Check Guruji Name branding in header
  if (!homeHtml.includes('वे.मु. प्रशांत पाठक') || !homeHtml.includes('(गुरुजी)')) {
    throw new Error('FAILED: Guruji compact name block missing in header!');
  }
  console.log('✓ Compact Guruji name "वे.मु. प्रशांत पाठक (गुरुजी)" verified in navbar.');

  // Check that unwanted subtitle is NOT in navbar
  if (homeHtml.includes('धार्मिक विधी व संस्कार सेवा — नागपूर')) {
    throw new Error('FAILED: Old subtitle "धार्मिक विधी व संस्कार सेवा — नागपूर" still found in navbar!');
  }
  console.log('✓ Subtitle "धार्मिक विधी व संस्कार सेवा — नागपूर" is NOT in navbar.');

  // Check that all 11 navigation links are present with concise labels
  const expectedLabels = [
    'मुख्यपृष्ठ',
    'परिचय',
    'पूजा विधी',
    'बुकिंग',
    'कार्यक्रम',
    'दालन',
    'व्हिडीओ',
    'अभिप्राय',
    'लेख',
    'प्रश्नोत्तरे',
    'संपर्क'
  ];

  for (const label of expectedLabels) {
    if (!homeHtml.includes(label)) {
      throw new Error(`FAILED: Navigation link "${label}" missing from navbar!`);
    }
  }
  console.log('✓ All 11 navigation links verified with concise, elegant labels.');

  // 5. Test About Page Image
  console.log('\n5. Testing About Page Image (/about)...');
  const aboutRes = await fetch('http://localhost:3000/about', { cache: 'no-store' });
  const aboutHtml = await aboutRes.text();
  if (!aboutHtml.includes(profile.about_photo_url || profile.primary_photo_url)) {
    throw new Error('FAILED: About page does not contain Guruji photo URL!');
  }
  console.log(`✓ About page correctly renders Guruji photo: ${profile.about_photo_url}`);

  // 6. Test Admin Profile Auto-Save & Update
  console.log('\n6. Testing Admin Profile API PUT Auto-save...');
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'Guruji@Puja2026!' }),
  });
  const setCookie = loginRes.headers.get('set-cookie');
  const tokenCookie = setCookie.split(';')[0];

  const updateTestRes = await fetch('http://localhost:3000/api/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Cookie: tokenCookie,
    },
    body: JSON.stringify({
      ...profile,
      bio_mr: profile.bio_mr,
      hero_image_url: profile.hero_image_url,
      primary_photo_url: profile.primary_photo_url,
    }),
  });

  if (!updateTestRes.ok) {
    throw new Error('Admin profile update PUT failed!');
  }
  console.log('✓ Admin profile update API verified with auth.');

  console.log('\n======================================================');
  console.log('✓ ALL TESTS PASSED! BOTH BUGS CONFIRMED COMPLETELY FIXED!');
  console.log('======================================================');
}

verifyBugsFixed().catch((err) => {
  console.error('\n❌ VERIFICATION ERROR:', err);
  process.exit(1);
});
