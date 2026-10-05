import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from 'pg';

const EXPECTED_DATABASE = process.env.EXPECTED_DATABASE || 'prashant_pathak_puja_db';
const EXPECTED_USER = process.env.EXPECTED_USER || 'prashant_pathak_app';
const EXPECTED_APP_IDENTIFIER = process.env.EXPECTED_APP_IDENTIFIER || 'prashant_pathak_guruji_website';

let pool: Pool | null = null;
let isVerified = false;

export function getPool(): Pool {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL?.trim();

    if (!databaseUrl) {
      throw new Error(
        '[CRITICAL DATABASE CONFIG ERROR] process.env.DATABASE_URL is not set. A valid PostgreSQL connection string is required.'
      );
    }

    pool = new Pool({
      connectionString: databaseUrl,
      max: 15,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ...(process.env.DATABASE_SSL === 'true' && { ssl: { rejectUnauthorized: false } }),
    });

    pool.on('error', (err) => {
      console.error('[DB] Unexpected error on idle client', err);
    });
  }
  return pool;
}

/**
 * Strict database isolation and identity safety verification.
 * Stops execution immediately if connected to any other database or user!
 */
export async function verifyDatabaseIdentity(client?: PoolClient): Promise<void> {
  const c = client || (await getPool().connect());
  try {
    const res = await c.query('SELECT current_database() AS db, current_user AS usr');
    const { db, usr } = res.rows[0];

    if (db !== EXPECTED_DATABASE || usr !== EXPECTED_USER) {
      const errMsg = `[CRITICAL SECURITY HALT] Database identity mismatch! Expected ${EXPECTED_DATABASE}/${EXPECTED_USER}, got ${db}/${usr}. Aborting immediately to prevent cross-project impact.`;
      console.error(errMsg);
      throw new Error(errMsg);
    }

    // Verify application metadata marker if table exists
    const metaCheck = await c.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'application_metadata'
      ) AS exists;
    `);

    if (metaCheck.rows[0]?.exists) {
      const metaRes = await c.query('SELECT application_identifier FROM application_metadata LIMIT 1');
      if (metaRes.rows.length > 0) {
        const id = metaRes.rows[0].application_identifier;
        if (id !== EXPECTED_APP_IDENTIFIER) {
          throw new Error(`[CRITICAL SECURITY HALT] Application identifier mismatch! Expected ${EXPECTED_APP_IDENTIFIER}, found ${id}`);
        }
      }
    }

    isVerified = true;
  } finally {
    if (!client) {
      (c as PoolClient).release();
    }
  }
}

/**
 * Safe parameterized query executor with verification check.
 */
export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  if (!isVerified) {
    await verifyDatabaseIdentity();
  }
  const client = await getPool().connect();
  try {
    return await client.query<T>(text, params);
  } finally {
    client.release();
  }
}

/**
 * Safe transaction runner.
 */
export async function transaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  if (!isVerified) {
    await verifyDatabaseIdentity();
  }
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
