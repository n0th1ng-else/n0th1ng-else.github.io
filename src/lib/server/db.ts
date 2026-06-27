import pg from 'pg';
import schemaSql from '$lib/server/db/schema.sql?raw';
import { getRuntimeEnvironment } from '$lib/server/env';

const { Pool } = pg;

// Single small pool. The site runs one replica and serves from an in-memory cache
// (see content.ts), so ~1 connection is in use at a time. Kept tiny to stay well under
// the shared Aiven free-tier cap (20 connections, no pooler).
let pool: pg.Pool | undefined;

export const getPool = (): pg.Pool => {
	if (!pool) {
		const env = getRuntimeEnvironment();
		pool = new Pool({
			connectionString: env.DATABASE_URL,
			max: 2,
			idleTimeoutMillis: 10_000,
			ssl: { rejectUnauthorized: false } // Aiven requires SSL
		});
	}
	return pool;
};

export const query = async <Row>(text: string, params: unknown[] = []): Promise<Row[]> => {
	const result = await getPool().query(text, params);
	return result.rows as Row[];
};

// Runs the idempotent schema (multi-statement; uses the simple query protocol).
export const ensureSchema = async (): Promise<void> => {
	await getPool().query(schemaSql);
};
