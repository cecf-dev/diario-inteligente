import { pool } from '../src/db.js';
import { generateEmbedding } from '../src/services/embeddingService.js';
import { config } from '../src/config.js';

if (!config.jinaApiKey) {
  console.error('JINA_API_KEY no configurada. Revisa backend/.env');
  process.exit(1);
}

const { rows } = await pool.query(
  `SELECT e.id, e.raw_text
   FROM entries e
   LEFT JOIN entry_analysis a ON a.entry_id = e.id
   WHERE a.embedding IS NULL`
);

console.log(`Entradas sin embedding: ${rows.length}`);

let ok = 0;
let fail = 0;
for (const r of rows) {
  try {
    const vector = await generateEmbedding(r.raw_text);
    await pool.query(
      'UPDATE entry_analysis SET embedding = $2::vector WHERE entry_id = $1',
      [r.id, `[${vector.join(',')}]`]
    );
    ok++;
  } catch (err) {
    fail++;
    console.error(`Fallo en entrada ${r.id}:`, err.message);
  }
}

console.log(`Backfill completado: ${ok} OK, ${fail} con error`);
await pool.end();
