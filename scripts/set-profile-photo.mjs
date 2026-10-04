import pg from 'pg';
const { Pool } = pg;

async function setProfilePhoto() {
  const pool = new Pool({
    user: 'prashant_pathak_app',
    password: '#Athr2007',
    host: 'localhost',
    port: 5432,
    database: 'prashant_pathak_puja_db',
  });

  const photoUrl = '/api/uploads/1790772019114_b753ace52f8303f59237bbd09de4dfb0.jpg';

  const updateRes = await pool.query(
    `UPDATE website_settings SET
      primary_photo_url = $1,
      hero_image_url = $1,
      about_photo_url = $1,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = 1
    RETURNING primary_photo_url, hero_image_url, about_photo_url`,
    [photoUrl]
  );

  console.log('Successfully set Guruji profile photo in DB:', updateRes.rows[0]);
  await pool.end();
}

setProfilePhoto().catch(console.error);
