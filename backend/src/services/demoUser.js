import { pool } from '../db.js';

const DEMO_EMAIL = 'demo@diario.local';

export async function resolveUserId(userId) {
  if (userId) return userId;

  const insert = await pool.query(
    `INSERT INTO users (email) VALUES ($1)
     ON CONFLICT (email) DO NOTHING
     RETURNING id`,
    [DEMO_EMAIL]
  );
  if (insert.rows[0]) return insert.rows[0].id;

  const select = await pool.query('SELECT id FROM users WHERE email = $1', [DEMO_EMAIL]);
  return select.rows[0].id;
}