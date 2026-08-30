# Estado de Desarrollo — Diario Inteligente

## Fase Actual
**FASE 2 — Autenticación (Firebase Auth).** Bloque A — BD (COMPLETADO)

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
- [x] Commit + push del Bloque 2 (`8962050`, `e927e50`)
- [x] Frontend `frontend/` con Vite 8 + React 19 + Tailwind CSS v4
- [x] Dependencias: `react`, `react-router-dom`, `recharts`, `tailwindcss`, `@tailwindcss/vite`
- [x] CORS habilitado en el backend (`cors`)
- [x] Pantallas implementadas: `/dashboard` (Radar de Burnout + alertas IA), `/entry/new` (editor + autocompletado de etiquetas), `/history` (línea de tiempo con indicador de estrés)
- [x] `npm run build` verificado en local (`vite build` OK)
- [x] Dev server de Vite verificado (puerto 5173, proxy `/api` → `localhost:3001`)
- [x] Commit + push del Bloque 3 (`d4118b8`, `550d706`)
- [x] README actualizado con estructura del proyecto, API, requisitos y puesta en marcha completa (BD + backend + frontend)
- [x] Verificación integral: backend con CORS responde `/health` 200; `GET /api/entries` sin BD da error controlado (ECONNREFUSED); `git log` revisado (8 commits, uno por bloque)
- [x] Commit + push del Bloque 4 (`2ffeefb`, `11e2b33`)
- [x] **FASE 2 — Autenticación:** revisión del prompt actualizado (Firebase Auth, `users.id`/`entries.user_id` → VARCHAR UID, /login y /register, rutas protegidas, historial por UID)
- [x] **Bloque A — BD:** `001_schema.sql` actualizado: `users.id VARCHAR(255)` (PK = UID Firebase), `entries.user_id VARCHAR(255)` (FK). Se modificó en sitio porque aún no existe ninguna BD aprovisionada (verificación Docker pendiente); sin riesgo de pérdida de datos. Commit + push (`f9c1fd9`)

## Tareas Pendientes Inmediatas
- [ ] **Bloque B — Backend (auth):** `firebase-admin`, middleware `requireAuth`, extraer `uid` del Bearer Token, eliminar usuario demo, respuestas 401/403, env vars `FIREBASE_*`.
- [ ] **Bloque C — Frontend (auth):** SDK de Firebase client, AuthContext, pantallas `/login` y `/register`, rutas protegidas, enviar Bearer Token, logout.
- [ ] **Bloque D — Integración:** README con pasos de Firebase (crear proyecto, service account, config web) y verificación.
- [ ] **Verificación E2E pendiente** (requiere Docker + `GROQ_API_KEY` + Firebase): flujo completo login → API → Groq → BD.
- [ ] **Optimización:** el bundle de `vite build` supera 500 kB (recharts); evaluar code-splitting.
- [ ] **Deuda técnica:** `generateEmbedding()` es un stub; conectar proveedor real de embeddings para RAG.

## Decisiones Técnicas
| Clave | Valor |
| :--- | :--- |
| Stack | React + Tailwind / Node.js + Express / PostgreSQL + pgvector / Groq API |
| Backend | `backend/` — Node ESM, Express 5, `pg` (Pool), `groq-sdk`, `cors` |
| Frontend | `frontend/` — Vite 8, React 19, Tailwind v4 (`@tailwindcss/vite`), `recharts`, `react-router-dom` |
| Puerto (backend) | `3001` (`PORT` en `.env`) |
| Puerto (frontend/dev) | `5173` con proxy `/api` → `http://localhost:3001` |
| Ruta raíz | `POST /api/entries` y `GET /api/entries`; `GET /health` |
| Modelo Groq | `llama-3.3-70b-versatile` (configurable con `GROQ_MODEL`) |
| Formato de análisis | JSON con `burnout_score` (1-10), `primary_emotion`, `entities_tags[]` vía `response_format: json_object` |
| Embeddings | Stub `generateEmbedding()` devuelve `null`; pendiente proveedor real para RAG |
| Autenticación | **En proceso (Fase 2):** Firebase Auth. Frontend: Bearer Token con cada petición. Backend: validación con Firebase Admin SDK; `uid` = `user_id`. `users.id` es `VARCHAR` = UID |
| Usuario por defecto | **Eliminar** cuando se habilite auth (antes: `demo@diario.local`) |
| Config backend | `backend/.env.example` → `DATABASE_URL`, `GROQ_API_KEY`, `GROQ_MODEL`, `PORT` |
| Config frontend | `frontend/.env.example` → `VITE_API_URL` (default `/api`) |
| Alertas del dashboard | Calculadas con heurística local (trabajo nocturno 23:00-06:00, alta frecuencia de `burnout_score ≥ 7`); pendiente generarlas con IA en el backend |
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