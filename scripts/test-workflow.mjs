import fs from 'fs';
import path from 'path';

async function testAll() {
  console.log('=== STARTING WORKFLOW & UI AUTOMATED TESTING ===\n');

  // 1. Test Homepage HTML
  console.log('1. Testing Homepage (http://localhost:3000)...');
  const homeRes = await fetch('http://localhost:3000');
  if (!homeRes.ok) throw new Error(`Homepage returned status ${homeRes.status}`);
  const homeHtml = await homeRes.text();

  // Check Guruji Name Branding
  if (!homeHtml.includes('वे.मु. प्रशांत पाठक')) {
    throw new Error('FAILED: "वे.मु. प्रशांत पाठक" not found in homepage!');
  }
  console.log('✓ Guruji name "वे.मु. प्रशांत पाठक" verified in header.');

  // Check unwanted subtitle is removed
  if (homeHtml.includes('धार्मिक विधी व संस्कार सेवा — नागपूर')) {
    throw new Error('FAILED: Unwanted subtitle "धार्मिक विधी व संस्कार सेवा — नागपूर" is still in header!');
  }
  console.log('✓ Verified: Header subtitle "धार्मिक विधी व संस्कार सेवा — नागपूर" is COMPLETELY REMOVED.');

  // Check unwanted card text is removed
  if (homeHtml.includes('पूजेची वेळ व शुल्कासाठी संपर्क करा')) {
    throw new Error('FAILED: Unwanted card text "पूजेची वेळ व शुल्कासाठी संपर्क करा" is still in cards!');
  }
  console.log('✓ Verified: Puja cards text "पूजेची वेळ व शुल्कासाठी संपर्क करा" is COMPLETELY REMOVED from homepage.');

  // 2. Test Services Page HTML
  console.log('\n2. Testing Services Page (http://localhost:3000/services)...');
  const servicesRes = await fetch('http://localhost:3000/services');
  if (!servicesRes.ok) throw new Error(`Services page returned status ${servicesRes.status}`);
  const servicesHtml = await servicesRes.text();
  if (servicesHtml.includes('पूजेची वेळ व शुल्कासाठी संपर्क करा')) {
    throw new Error('FAILED: "पूजेची वेळ व शुल्कासाठी संपर्क करा" found on services page!');
  }
  console.log('✓ Verified: Services page cards do NOT contain unwanted contact text.');

  // 3. Test Admin Authentication & Image Upload Flow
  console.log('\n3. Testing Admin Login & Auth Session...');
  const loginRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'admin',
      password: 'Guruji@Puja2026!',
    }),
  });

  if (!loginRes.ok) {
    const err = await loginRes.json();
    throw new Error(`Admin login failed: ${JSON.stringify(err)}`);
  }
  const setCookie = loginRes.headers.get('set-cookie');
  if (!setCookie) throw new Error('No session cookie returned from login!');
  const tokenCookie = setCookie.split(';')[0];
  console.log('✓ Admin authenticated successfully. Session cookie received.');

  // 4. Test File Upload to /api/upload
  console.log('\n4. Testing Photo Upload (/api/upload)...');
  // Generate a valid 200x200 JPEG binary buffer with valid magic bytes FF D8 FF E0
  // Standard minimal 1x1 JPEG buffer
  const sampleJpeg = Buffer.from([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
    0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43,
    0x00, 0x03, 0x02, 0x02, 0x03, 0x02, 0x02, 0x03, 0x03, 0x03, 0x03, 0x04,
    0x03, 0x03, 0x04, 0x05, 0x08, 0x05, 0x05, 0x04, 0x04, 0x05, 0x0a, 0x07,
    0x07, 0x06, 0x08, 0x0c, 0x0a, 0x0c, 0x0c, 0x0b, 0x0a, 0x0b, 0x0b, 0x0d,
    0x0e, 0x12, 0x10, 0x0d, 0x0e, 0x11, 0x0e, 0x0b, 0x0b, 0x10, 0x16, 0x10,
    0x11, 0x13, 0x14, 0x15, 0x15, 0x15, 0x0c, 0x0f, 0x17, 0x18, 0x16, 0x14,
    0x18, 0x12, 0x14, 0x15, 0x14, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01,
    0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x1f, 0x00, 0x00,
    0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
    0x09, 0x0a, 0x0b, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f,
    0x00, 0xbf, 0x00, 0xff, 0xd9
  ]);

  const formData = new FormData();
  const blob = new Blob([sampleJpeg], { type: 'image/jpeg' });
  formData.append('file', blob, 'test_ritual.jpg');
  formData.append('category', 'gallery');

  const uploadRes = await fetch('http://localhost:3000/api/upload', {
    method: 'POST',
    headers: {
      Cookie: tokenCookie,
    },
    body: formData,
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.json();
    throw new Error(`Upload API returned ${uploadRes.status}: ${JSON.stringify(err)}`);
  }

  const uploadData = await uploadRes.json();
  console.log('✓ File uploaded successfully! Server response:', uploadData);

  const fileUrl = uploadData.url; // e.g. /api/uploads/img_....jpg
  const filename = fileUrl.replace('/api/uploads/', '');
  const physicalPath = path.join(process.cwd(), 'uploads', filename);

  if (!fs.existsSync(physicalPath)) {
    throw new Error(`File was not stored at ${physicalPath}`);
  }
  console.log(`✓ Stored on disk at: ${physicalPath}`);

  // Test serving the uploaded file
  console.log('\n5. Testing Image Serving (/api/uploads/...)...');
  const serveRes = await fetch(`http://localhost:3000${fileUrl}`);
  if (!serveRes.ok) throw new Error(`Serving image failed with status ${serveRes.status}`);
  const contentType = serveRes.headers.get('content-type');
  console.log(`✓ Image successfully served with Content-Type: ${contentType}`);

  // 6. Test Gallery Database Record Insertion
  console.log('\n6. Testing Gallery Item Insertion (/api/gallery)...');
  const galleryCreateRes = await fetch('http://localhost:3000/api/gallery', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: tokenCookie,
    },
    body: JSON.stringify({
      title_mr: 'श्री वास्तुशांती विधी',
      title_en: 'Shri Vastu Shanti Ritual',
      category: 'वास्तुशांती',
      image_url: fileUrl,
      is_featured: true,
      is_hidden: false,
      sort_order: 1,
    }),
  });

  if (!galleryCreateRes.ok) {
    const err = await galleryCreateRes.json();
    throw new Error(`Failed to create gallery item: ${JSON.stringify(err)}`);
  }
  const galleryItem = (await galleryCreateRes.json()).item;
  console.log(`✓ Gallery item created with ID #${galleryItem.id}: "${galleryItem.title_mr}"`);

  // 7. Test Admin Gallery Fetch
  console.log('\n7. Testing Admin Gallery Fetch (/api/gallery?all=true)...');
  const adminGalRes = await fetch('http://localhost:3000/api/gallery?all=true', {
    headers: { Cookie: tokenCookie },
  });
  const adminGalData = await adminGalRes.json();
  const foundAdmin = adminGalData.gallery.find((g) => g.id === galleryItem.id);
  if (!foundAdmin) throw new Error('Uploaded item not found in admin gallery!');
  console.log(`✓ Verified in Admin Gallery: ID #${foundAdmin.id}, URL: ${foundAdmin.image_url}`);

  // 8. Test Public Gallery Fetch
  console.log('\n8. Testing Public Gallery Page (/api/gallery & /gallery)...');
  const publicGalRes = await fetch('http://localhost:3000/api/gallery');
  const publicGalData = await publicGalRes.json();
  const foundPublic = publicGalData.gallery.find((g) => g.id === galleryItem.id);
  if (!foundPublic) throw new Error('Uploaded item not found in public gallery!');
  console.log(`✓ Verified in Public Gallery: ID #${foundPublic.id}, Title: ${foundPublic.title_mr}`);

  const publicPageRes = await fetch('http://localhost:3000/gallery');
  const publicPageHtml = await publicPageRes.text();
  console.log(`✓ Public Gallery page status: ${publicPageRes.status}`);

  console.log('\n=========================================');
  console.log('✓ ALL 8 TEST STAGES PASSED 100% SUCCESFULLY!');
  console.log('=========================================');
}

testAll().catch((err) => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});
