import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/auth.js';
import { analyzeEntry } from '../services/groqService.js';
import { generateEmbedding } from '../services/embeddingService.js';

const router = Router();

router.use(requireAuth);

router.post('/', async (req, res, next) => {
  try {
    const rawText = req.body?.raw_text;

    if (typeof rawText !== 'string' || rawText.trim().length === 0) {
      return res.status(400).json({ error: 'raw_text es obligatorio' });
    }

    const text = rawText.trim();
    const ownerId = req.user.uid;

    const client = await pool.connect();
    try {
      const saved = await client.query(
        `INSERT INTO entries (user_id, raw_text)
         VALUES ($1, $2)
         RETURNING id, user_id, raw_text, created_at`,
        [ownerId, text]
      );
      const entry = saved.rows[0];

      const analysis = await analyzeEntry(text);
      const embedding = await generateEmbedding(text);

      const inserted = await client.query(
        `INSERT INTO entry_analysis
           (entry_id, burnout_score, primary_emotion, entities_tags, embedding)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, entry_id, burnout_score, primary_emotion, entities_tags`,
        [entry.id, analysis.burnout_score, analysis.primary_emotion, analysis.entities_tags, embedding]
      );

      res.status(201).json({ entry, analysis: inserted.rows[0] });
    } finally {
      client.release();
    }
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT e.id, e.raw_text, e.created_at,
              a.burnout_score, a.primary_emotion, a.entities_tags
       FROM entries e
       LEFT JOIN entry_analysis a ON a.entry_id = e.id
       WHERE e.user_id = $1
       ORDER BY e.created_at DESC`,
      [req.user.uid]
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

export default router;