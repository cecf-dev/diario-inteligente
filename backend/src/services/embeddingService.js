import { config } from '../config.js';

const JINA_EMBEDDING_MODEL = 'jina-embeddings-v3';
const JINA_EMBEDDING_URL = 'https://api.jina.ai/v1/embeddings';
const EMBEDDING_DIMENSIONS = 1024;

export async function generateEmbedding(text) {
  if (!config.jinaApiKey) {
    throw new Error('JINA_API_KEY no configurada');
  }

  const res = await fetch(JINA_EMBEDDING_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.jinaApiKey}`,
      'Content-Type': 'application/json',
      'X-Client-Secret-Key': config.jinaApiKey,
    },
    body: JSON.stringify({
      model: JINA_EMBEDDING_MODEL,
      dimensions: EMBEDDING_DIMENSIONS,
      embedding_type: 'float',
      input: [text.slice(0, 8000)],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Jina embeddings error ${res.status}: ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  const vector = data?.data?.[0]?.embedding;
  if (!Array.isArray(vector) || vector.length === 0) {
    throw new Error('Jina no devolvió embeddings');
  }

  return vector;
}
