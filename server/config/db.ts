import pg from 'pg';
import { config } from './env.js';

const { Pool } = pg;

// Singleton pool instance
let pool: pg.Pool | null = null;
let isPostgresAvailable = false;

export const getDbPool = (): pg.Pool | null => {
  if (pool) return pool;

  try {
    if (config.database.url) {
      pool = new Pool({
        connectionString: config.database.url,
        ssl: config.database.ssl,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
    } else {
      pool = new Pool({
        host: config.database.host,
        port: config.database.port,
        user: config.database.user,
        password: config.database.password,
        database: config.database.database,
        ssl: config.database.ssl,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      });
    }

    pool.on('error', (err) => {
      console.warn('[JanSamadhan DB Pool] Unexpected error on idle client:', err.message);
    });

    return pool;
  } catch (error: unknown) {
    console.warn('[JanSamadhan DB] Failed to initialize PostgreSQL pool:', error);
    return null;
  }
};

export const checkDatabaseHealth = async (): Promise<boolean> => {
  const currentPool = getDbPool();
  if (!currentPool) return false;

  try {
    const client = await currentPool.connect();
    try {
      const res = await client.query('SELECT 1 as alive');
      isPostgresAvailable = res.rows.length > 0;
      return isPostgresAvailable;
    } finally {
      client.release();
    }
  } catch {
    isPostgresAvailable = false;
    return false;
  }
};

export const isDbConnected = (): boolean => isPostgresAvailable;
