import Groq from 'groq-sdk';
import { config } from '../config.js';

const groq = new Groq({ apiKey: config.groqApiKey });

const SYSTEM_PROMPT = `Eres el motor de alertas de un diario de telemetria emocional para estudiantes universitarios y desarrolladores de software cuyo objetivo es prevenir el burnout.

Recibirás una lista de las entradas más recientes del usuario. Cada entrada tiene un texto y un nivel de agotamiento (burnout_score del 1 al 10).

Analiza los patrones (frecuencia, intensidad, signos de fatiga, frustración, presión) y emite entre 0 y 3 alertas de prevención de burnout.

Debes responder EXCLUSIVAMENTE con un objeto JSON válido con esta forma exacta:
{
  "alerts": [
    "Alerta breve, específica y accionable en español (máximo 2 frases)."
  ]
}

Reglas:
- Devuelve alerts con 0, 1, 2 o 3 alertas. Si no hay señales de riesgo, devuelve un arreglo vacío.
- Cada alerta debe mencionar el patrón concreto detectado y una recomendación accionable.
- No inventes datos que no estén respaldados por las entradas recibidas.
- Mantén el tono empático y constructivo, nunca alarmista.`;

export async function buildAlerts(entries) {
  if (!config.groqApiKey) {
    throw new Error('GROQ_API_KEY no configurada');
  }

  const serialized = entries.map((e, i) => ({
    n: i + 1,
    texto: e.raw_text,
    burnout_score: e.burnout_score,
  }));

  const completion = await groq.chat.completions.create({
    model: config.groqModel,
    temperature: 0.3,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Entradas recientes del usuario:\n${JSON.stringify(serialized, null, 2)}` },
    ],
  });

  const content = completion.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Groq no devolvió contenido en alertas');
  }

  const parsed = JSON.parse(content);
  return validateAlerts(parsed);
}

function validateAlerts(result) {
  if (!Array.isArray(result.alerts)) {
    throw new Error('alerts inválido: debe ser un arreglo');
  }
  return {
    alerts: result.alerts
      .filter((a) => typeof a === 'string' && a.trim())
      .map((a) => a.trim())
      .slice(0, 3),
  };
}
