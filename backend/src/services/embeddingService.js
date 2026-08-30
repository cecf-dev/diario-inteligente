// Genera el embedding del texto para la columna pgvector.
// TODO(RAG): conectar un proveedor real de embeddings (p. ej. OpenAI embeddings).
// Hasta entonces se devuelve null para no bloquear el flujo de análisis.
export async function generateEmbedding(_text) {
  return null;
}