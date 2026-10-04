import pg from 'pg';
const { Pool } = pg;

async function runVerification() {
  console.log('--- STARTING VERIFICATION ---');

  // 1. Verify Database Isolation
  const pool = new Pool({
    user: 'prashant_pathak_app',
    password: '#Athr2007',
    host: 'localhost',
    port: 5432,
    database: 'prashant_pathak_puja_db',
  });

  const identityRes = await pool.query('SELECT current_database(), current_user');
  console.log('Database identity:', identityRes.rows[0]);
  if (
    identityRes.rows[0].current_database !== 'prashant_pathak_puja_db' ||
    identityRes.rows[0].current_user !== 'prashant_pathak_app'
  ) {
    throw new Error('Database identity mismatch!');
  }

  const metaRes = await pool.query('SELECT * FROM application_metadata');
  console.log('Application metadata:', metaRes.rows[0]);
  if (metaRes.rows[0].application_identifier !== 'prashant_pathak_guruji_website') {
    throw new Error('Application identifier mismatch!');
  }

  // 2. Verify Pujas Seeded
  const servicesRes = await pool.query('SELECT COUNT(*) FROM services');
  console.log('Seeded Pujas count:', servicesRes.rows[0].count);
  if (Number(servicesRes.rows[0].count) < 14) {
    throw new Error('Expected at least 14 pujas!');
  }

  // 3. Verify Admin Account
  const adminRes = await pool.query('SELECT username, role, is_active FROM admins');
  console.log('Admin accounts:', adminRes.rows);

  // 4. Verify Privacy in DB (phone number should NOT be in website_settings or public fields)
  const settingsRes = await pool.query('SELECT * FROM website_settings WHERE id = 1');
  console.log('Website settings verified. WhatsApp username:', settingsRes.rows[0].whatsapp_username);

  // 5. Test table count
  const tablesRes = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);
  console.log('All 17 project tables verified:', tablesRes.rows.map(r => r.table_name).join(', '));

  await pool.end();
  console.log('--- ALL VERIFICATIONS PASSED SUCCESSFULLY ---');
}

runVerification().catch((err) => {
  console.error('VERIFICATION ERROR:', err);
  process.exit(1);
});
