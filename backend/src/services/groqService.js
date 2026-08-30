import Groq from 'groq-sdk';
import { config } from '../config.js';

const groq = new Groq({ apiKey: config.groqApiKey });

const SYSTEM_PROMPT = `Eres un analista de bienestar para un diario de telemetria emocional. Evalúas textos escritos por estudiantes universitarios y desarrolladores de software para medir su carga cognitiva, estres y riesgo de agotamiento (burnout).

Debes responder EXCLUSIVAMENTE con un objeto JSON válido con esta forma exacta:
{
  "burnout_score": 1,
  "primary_emotion": "estrés",
  "entities_tags": ["código", "exámenes"]
}

Reglas:
- burnout_score: entero del 1 al 10. 1 = sin señales de agotamiento, 10 = agotamiento extremo. Considera pistas textuales: horas de trabajo, frustración, cansancio, noches de desvelo, presión, falta de motivación.
- primary_emotion: una sola emoción dominante en español (ej: estrés, alivio, apatía, frustración, satisfacción, ansiedad, agotamiento).
- entities_tags: entre 2 y 5 etiquetas cortas en español sobre los temas mencionados (ej: "código", "exámenes", "proyecto integrador", "debugging", "trabajo en equipo").`;

export async function analyzeEntry(rawText) {
  if (!config.groqApiKey) {
    throw new Error('GROQ_API_KEY no configurada');
  }

  const completion = await groq.chat.completions.create({
    model: config.groqModel,
    temperature: 0.2,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Texto del usuario:\n"""${rawText}"""` },
    ],
  });

  const content = completion.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Groq no devolvió contenido');
  }

  const parsed = JSON.parse(content);
  validateAnalysis(parsed);
  return parsed;
}

function validateAnalysis(analysis) {
  const score = Number(analysis.burnout_score);
  if (!Number.isInteger(score) || score < 1 || score > 10) {
    throw new Error('burnout_score inválido: debe ser un entero entre 1 y 10');
  }
  if (typeof analysis.primary_emotion !== 'string' || !analysis.primary_emotion.trim()) {
    throw new Error('primary_emotion inválido');
  }
  if (!Array.isArray(analysis.entities_tags)) {
    throw new Error('entities_tags inválido: debe ser un arreglo');
  }
  analysis.burnout_score = score;
  analysis.primary_emotion = analysis.primary_emotion.trim();
  analysis.entities_tags = analysis.entities_tags
    .filter((t) => typeof t === 'string' && t.trim())
    .map((t) => t.trim().slice(0, 100));
}