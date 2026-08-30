# Estado de Desarrollo — Diario Inteligente

## Fase Actual
**Bloque 2 — Backend (Express + Groq)** (COMPLETADO, verificación E2E pendiente)

## Checklist de Tareas Completadas
- [x] Lectura del prompt maestro `prompt_especificaciones_diario.md`
- [x] Inicialización del repositorio Git (`git init`)
- [x] Configuración del remoto: `https://github.com/cecf-dev/diario-inteligente.git`
- [x] Creación de `README.md`
- [x] Creación de `.gitignore`
- [x] Commit del Bloque 0 con mensaje descriptivo
- [x] Push al repositorio remoto (`main`)
- [x] Bloque 0 completado (commits `bbc0a28`, `63a1040`)
- [x] Creación de `docker-compose.yml` (pgvector/pgvector:pg16)
- [x] Creación de la migración `db/init/001_schema.sql` (tablas `users`, `entries`, `entry_analysis`)
- [x] Commit + push del Bloque 1 (`2b5f69c`)
- [x] Bloque 1 completado (`fd172c1`)
- [x] Estructura del backend en `backend/` (ESM, Node >= 20)
- [x] Dependencias instaladas: `express@5`, `pg@8`, `groq-sdk@1`, `dotenv@17`
- [x] Servidor Express con `/health` verificado en local (puerto 3001)
- [x] Endpoints `POST /api/entries` (crea entrada + análisis Groq + embedding stub) y `GET /api/entries` (historial)
- [x] `resolveUserId` con usuario demo (`demo@diario.local`) por defecto
- [x] Commit + push del Bloque 2 (`8962050`)

## Tareas Pendientes Inmediatas
- [ ] **Verificación E2E pendiente** (requiere Docker + `GROQ_API_KEY`): levantar BD, aplicar migración, probar `POST /api/entries` de punta a punta.
- [ ] **Bloque 3 — Frontend:** React.js + Tailwind CSS con las pantallas `/dashboard`, `/entry/new`, `/history`.

## Decisiones Técnicas
| Clave | Valor |
| :--- | :--- |
| Stack | React + Tailwind / Node.js + Express / PostgreSQL + pgvector / Groq API |
| Backend | `backend/` — Node ESM, Express 5, `pg` (Pool), `groq-sdk` |
| Puerto (backend) | `3001` (`PORT` en `.env`) |
| Ruta raíz | `POST /api/entries` y `GET /api/entries`; `GET /health` |
| Modelo Groq | `llama-3.3-70b-versatile` (configurable con `GROQ_MODEL`) |
| Formato de análisis | JSON con `burnout_score` (1-10), `primary_emotion`, `entities_tags[]` vía `response_format: json_object` |
| Embeddings | Stub `generateEmbedding()` devuelve `null`; pendiente proveedor real para RAG |
| Usuario por defecto | `demo@diario.local` (sin auth en MVP) |
| Config | `backend/.env.example` → `DATABASE_URL`, `GROQ_API_KEY`, `GROQ_MODEL`, `PORT` |
| Imagen de BD | `pgvector/pgvector:pg16` (incluye extensión `vector`) |
| Puerto (BD) | `5432` (host) → 5432 (contenedor) |
| Credenciales BD (local) | usuario: `diario` / password: `diario_password` / db: `diario_inteligente` (SÓLO local, no producción) |
| Migraciones | scripts SQL en `db/init/`, ejecutadas automáticamente en el primer arranque del contenedor |
| Repositorio remoto | `https://github.com/cecf-dev/diario-inteligente.git` |
| Branch | `main` |

## Metodología
- Desarrollo iterativo por bloques lógicos; cada bloque se detiene para aprobación del usuario.
- Actualizar este archivo al final de cada paso aprobado.
- Commit + push obligatorio al remoto después de cada paso aprobado, antes de avanzar.