-- 001_schema.sql
-- Migración inicial del Diario Inteligente
-- PostgreSQL 16 + pgvector

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS users (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    email      VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS entries (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    raw_text   TEXT        NOT NULL,
    created_at TIMESTAMP   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS entry_analysis (
    id              UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
    entry_id        UUID           NOT NULL UNIQUE REFERENCES entries(id) ON DELETE CASCADE,
    burnout_score   INTEGER        NOT NULL CHECK (burnout_score BETWEEN 1 AND 10),
    primary_emotion VARCHAR(100),
    entities_tags   VARCHAR[]      NOT NULL DEFAULT ARRAY[]::VARCHAR[],
    embedding       VECTOR(1024)
);

CREATE INDEX IF NOT EXISTS idx_entries_user_id      ON entries(user_id);
CREATE INDEX IF NOT EXISTS idx_entries_created_at   ON entries(created_at);
CREATE INDEX IF NOT EXISTS idx_analysis_burnout     ON entry_analysis(burnout_score);
CREATE INDEX IF NOT EXISTS idx_analysis_embedding   ON entry_analysis
    USING hnsw (embedding vector_cosine_ops);