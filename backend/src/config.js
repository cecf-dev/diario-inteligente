import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 3001),
  databaseUrl:
    process.env.DATABASE_URL ??
    'postgresql://diario:diario_password@localhost:5432/diario_inteligente',
  groqApiKey: process.env.GROQ_API_KEY ?? '',
  groqModel: process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile',
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID ?? '',
  firebaseServiceAccountPath: process.env.FIREBASE_SERVICE_ACCOUNT_PATH ?? '',
};