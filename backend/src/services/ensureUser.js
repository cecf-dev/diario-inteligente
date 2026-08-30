import { pool } from '../db.js';

export async function ensureUser({ uid, email }) {
  const emailValue = email ?? `${uid}@diario.local`;
  await pool.query(
    `INSERT INTO users (id, email)
     VALUES ($1, $2)
     ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email`,
    [uid, emailValue]
  );
}