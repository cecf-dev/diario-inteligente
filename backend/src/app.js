import cors from 'cors';
import express from 'express';
import entriesRouter from './routes/entries.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'diario-inteligente-backend' });
  });

  app.use('/api/entries', entriesRouter);

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  });

  return app;
}