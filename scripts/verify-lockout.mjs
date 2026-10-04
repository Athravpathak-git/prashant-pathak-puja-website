import { Pool } from 'pg';

const pool = new Pool({
  database: 'prashant_pathak_puja_db',
  user: 'prashant_pathak_app',
  password: '#Athr2007',
  host: 'localhost',
  port: 5432,
});

async function testLockout() {
  console.log('=== VERIFYING EXACT 3 FAILED ATTEMPTS -> 48-HOUR LOCKOUT ===\n');

  // 0. Reset any existing lockout state for clean test
  await pool.query('UPDATE admins SET failed_login_attempts = 0, locked_until = NULL WHERE username = $1', ['admin']);
  console.log('0. Cleaned up admin account state.');

  // Test Attempt 1 (Wrong Password)
  console.log('\n1. Testing Failed Attempt 1...');
  const res1 = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'WrongPassword1' }),
  });
  const data1 = await res1.json();
  console.log('  Status:', res1.status, '| Attempts:', data1.attempts, '| Message:', data1.error);
  if (res1.status !== 401 || data1.attempts !== 1) {
    throw new Error(`Attempt 1 check failed: expected 401 & 1 attempt, got ${res1.status} & ${data1.attempts}`);
  }
  console.log('✓ Attempt 1 successfully recorded.');

  // Test Attempt 2 (Wrong Password)
  console.log('\n2. Testing Failed Attempt 2...');
  const res2 = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'WrongPassword2' }),
  });
  const data2 = await res2.json();
  console.log('  Status:', res2.status, '| Attempts:', data2.attempts, '| Message:', data2.error);
  if (res2.status !== 401 || data2.attempts !== 2) {
    throw new Error(`Attempt 2 check failed: expected 401 & 2 attempts, got ${res2.status} & ${data2.attempts}`);
  }
  console.log('✓ Attempt 2 successfully recorded.');

  // Test Attempt 3 (Wrong Password -> Lock for 48 Hours)
  console.log('\n3. Testing Failed Attempt 3 (Should trigger 48-Hour Lockout)...');
  const res3 = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'WrongPassword3' }),
  });
  const data3 = await res3.json();
  console.log('  Status:', res3.status, '| Locked:', data3.locked, '| Expiry:', data3.lockedUntil);
  if (res3.status !== 423 || !data3.locked || !data3.lockedUntil) {
    throw new Error(`Attempt 3 lockout failed: expected 423 & locked:true, got ${res3.status} & ${data3.locked}`);
  }

  // Verify expiry is approximately 48 hours in the future
  const expiryTime = new Date(data3.lockedUntil).getTime();
  const nowTime = Date.now();
  const diffHours = (expiryTime - nowTime) / (1000 * 60 * 60);
  console.log(`  Calculated lockout duration: ${diffHours.toFixed(2)} hours`);
  if (diffHours < 47.9 || diffHours > 48.1) {
    throw new Error(`Lockout duration is not 48 hours: ${diffHours} hours`);
  }
  console.log('✓ Exactly 48-Hour Lockout verified on Attempt 3.');

  // Test 4. Attempting login WITH CORRECT PASSWORD during 48-Hour Lockout
  console.log('\n4. Testing Login WITH CORRECT PASSWORD During Lockout (MUST BE REJECTED)...');
  const res4 = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'Guruji@Puja2026!' }),
  });
  const data4 = await res4.json();
  console.log('  Status:', res4.status, '| Locked:', data4.locked, '| Error:', data4.error);
  if (res4.status !== 423 || !data4.locked) {
    throw new Error(`Security breach! Correct password was accepted while account was locked!`);
  }
  console.log('✓ VERIFIED: Even CORRECT password is strictly rejected during 48-hour lock.');

  // Test 5. Verify database records
  console.log('\n5. Inspecting Database Lock Record...');
  const dbCheck = await pool.query('SELECT failed_login_attempts, locked_until FROM admins WHERE username = $1', ['admin']);
  console.log('  DB Row:', dbCheck.rows[0]);
  if (dbCheck.rows[0].failed_login_attempts !== 3 || !dbCheck.rows[0].locked_until) {
    throw new Error('Database record does not match expected lockout state!');
  }
  console.log('✓ Database lock state verified.');

  // Test 6. Clean up / Reset lock for regular usage and verify valid login works
  console.log('\n6. Resetting lock and verifying successful login with correct password...');
  await pool.query('UPDATE admins SET failed_login_attempts = 0, locked_until = NULL WHERE username = $1', ['admin']);
  const res5 = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'Guruji@Puja2026!' }),
  });
  const data5 = await res5.json();
  if (!res5.ok || !data5.success) {
    throw new Error(`Failed to login with correct password after reset: ${JSON.stringify(data5)}`);
  }
  console.log('✓ Normal login with correct password succeeds and returns authenticated session.');

  console.log('\n======================================================');
  console.log('✓ ALL 3-ATTEMPT & 48-HOUR LOCKOUT SECURITY TESTS PASSED 100%!');
  console.log('======================================================');
  await pool.end();
}

testLockout().catch(async (err) => {
  console.error('\n❌ TEST FAILED:', err);
  await pool.end();
  process.exit(1);
});
