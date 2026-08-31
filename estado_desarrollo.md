# Estado de Desarrollo — Diario Inteligente

## Fase Actual
**FASE 5 — RAG: embeddings reales (Jina) + búsqueda semántica en el historial.** COMPLETADA. `generateEmbedding()` dejó de ser un stub: genera vectores de 1024 dims con Jina AI, se guardan en la columna `vector` de pgvector, y el historial permite búsqueda semántica por similitud coseno.

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
- [x] **Bloque B — Backend (auth):** `firebase-admin` instalado; `src/firebase.js` (init lazy con `cert()` o ADC), middleware `requireAuth` (valida Bearer Token → `uid`, `401` si falta/venció), `ensureUser` (upsert del usuario en `users`), rutas `/api/entries` protegidas y con `uid` del token; historial filtrado por `req.user.uid`; usuario demo eliminado. Verificado: `/health` 200 sin credenciales Firebase; `/api/entries` sin token → 401. Commit + push (`9788e08`)
- [x] **Bloque C — Frontend (auth):** `firebase` (client) instalado; `src/firebase.js` (config web), `AuthContext` (login/register/logout/getToken + `onAuthStateChanged`), `ProtectedRoute`, páginas `/login` y `/register`, `App.jsx` con rutas protegidas y header con email + logout, `api.js` envía `Authorization: Bearer <token>`, Dashboard/History/EntryNew usan `getToken()`. Verificado: `vite build` OK y dev server responde 200. `.env.example` con vars `VITE_FIREBASE_*`. Commit + push (`0933182`)
- [x] **Bloque D — Integración:** README actualizado con configuración de Firebase (crear proyecto, habilitar email/password, config web, service account con advertencia de seguridad), API con Bearer Token, requisitos y puesta en marcha. `git log` revisado (14 commits). Commit + push (`60e4395`)
- [x] **Verificación sin BD (2026-08-30):** `.env` del backend y frontend configurados por el usuario (ignorados en git). **Firebase Admin OK:** token inválido → `401 "Token inválido o expirado"`. **Groq OK:** con `GROQ_MODEL=openai/gpt-oss-20b` el análisis devuelve JSON válido (`burnout_score 8`, `primary_emotion: "estrés"`, tags). **Modelo corregido:** `llama-3.3-70b-versatile` ya no existe en el catálogo de Groq (cambió en 2026); se actualizó `config.js`, `.env.example` y el `.env` local.
- [x] **Verificación E2E real con Docker (2026-08-31):**
  - [x] `docker compose up -d` OK: contenedor `diario_db` (pgvector/pgvector:pg16) corriendo y **healthy**
  - [x] Migración ejecutada automáticamente: tablas `users`, `entries`, `entry_analysis` + extensión `vector` creadas
  - [x] Conexión backend→BD verificada: pool consulta `entries` sin error (ya no hay ECONNREFUSED)
  - [x] `FIREBASE_SERVICE_ACCOUNT_PATH` configurado con `serviceAccountKey.json` (credencial real); token inválido → `401`
  - [x] Servicios corriendo: backend `:3001` (`/health` 200) y frontend Vite `:5173` (`/` y `/login` 200)
  - [x] Flujo E2E manual en navegador: registro/login → crear entrada → análisis Groq → dashboard/historial renderizando correctamente (aprobado por el usuario)
- [x] **Seguridad:** `serviceAccountKey.json` añadido a `.gitignore` (credencial privilegiada; no debe subirse al remoto)
- [x] **FASE 3 — Alertas de burnout con IA (2026-08-31):**
  - [x] Nuevo servicio `backend/src/services/alertsService.js`: usa Groq (`buildAlerts`) para analizar las entradas recientes y emitir 0-3 alertas contextuales accionables en español (JSON con `alerts[]`, prompt empático y validación de salida)
  - [x] Nuevo endpoint `GET /api/entries/alerts` (protegido): lee las últimas 10 entradas del usuario desde la BD y devuelve `{ alerts: [...] }`; si no hay entradas devuelve `{ alerts: [] }` sin llamar a Groq
  - [x] Frontend: Dashboard sustituye la heurística local (`buildAlerts`) por la llamada al endpoint; `fetchAlerts` en `api.js`; carga en paralelo con `fetchEntries` (con fallback a `alerts: []` si la IA falla)
  - [x] Verificado: `vite build` OK; backend arranca sin errores; `/api/entries/alerts` y `/api/entries` protegidos (401 sin token); alerta de IA renderizada en el dashboard con una entrada real (aprobado por el usuario)
- [x] **FASE 4 — Optimización del bundle (2026-08-31):**
  - [x] `React.lazy` + `Suspense` en `App.jsx`: las páginas (`Login`, `Register`, `Dashboard`, `EntryNew`, `History`) se cargan bajo demanda en chunks separados
  - [x] `vite.config.js` con `manualChunks(id)` (función, requisito de rolldown en Vite 8) para aislar `recharts` en el chunk `charts` y el resto de `node_modules` en `vendor`
  - [x] Resultado: bundle inicial de ~706 kB (211 kB gzip) → `index` 5 kB + `vendor` 322 kB (~330 kB total / ~103 kB gzip); `recharts` queda en `charts` (362 kB) que solo se descarga al entrar a `/dashboard`; `/login`, `/register` y demás páginas son livianas (2-6 kB)
  - [x] Verificado: `vite build` OK (619 módulos, 1.9 s); dev server responde 200
- [x] **FASE 5 — RAG: embeddings reales (Jina) + búsqueda semántica (2026-08-31):**
  - [x] `backend/src/services/embeddingService.js` reemplaza el stub: llama a la API de Jina (`jina-embeddings-v3`, `dimensions: 1024`, `embedding_type: float`) y devuelve el vector completo (1024 dims, alineado con `VECTOR(1024)`)
  - [x] `config.js` + `backend/.env.example` con `JINA_API_KEY`
  - [x] `POST /api/entries` resiliente: si el embedding falla (sin key o error), se guarda `null` en la columna sin romper la creación de la entrada ni el análisis Groq
  - [x] Nuevo endpoint `GET /api/entries/search?q=` (protegido): genera el embedding de la consulta y busca las 10 entradas más similares del usuario con `<=>` (similitud coseno) vía pgvector; devuelve `similarity` por resultado
  - [x] Frontend `/history`: caja de búsqueda semántica (input + botón + limpiar); muestra `% similar` por resultado; vuelve a la línea de tiempo al limpiar
  - [x] Verificado: `vite build` OK; embedding Jina genera 1024 dims; consulta "tensión y presión en la universidad" encuentra la entrada relacionada con 69% de similitud (aun sin palabras exactas); `/api/entries/search` protegido (401 sin token)
  - [x] **Fix (2026-08-31):** `POST /api/entries` fallaba con "Vector contents must start with '['" porque se pasaba el array JS directamente (pg lo serializaba como `{"0.1","-0.2",...}` con comillas y llaves). Corregido convirtiendo el vector a literal de pgvector con corchetes: `` `[${vector.join(',')}]` ``. El endpoint `/search` ya usaba `JSON.stringify` (corchetes sin comillas, formato válido), por lo que no requería cambio. Commit `bd2dc4d`
  - [x] **Limpieza de datos huérfanos:** el bug anterior dejó 3 entradas duplicadas sin fila en `entry_analysis` (el INSERT del análisis fallaba tras haber insertado la entrada). Eliminadas; quedan 2 entradas válidas con análisis y embedding
  - [x] **Script de backfill:** `backend/scripts/backfill_embeddings.mjs` localiza entradas/sin análisis sin embedding y les genera/persiste el embedding (usa `grep` con `../src/`). Ejecutado: pobló embedding de las entradas existentes. Commit `ab3467f`
- [x] **FASE 5.1 — Robustez: transacción en `POST /api/entries` (2026-08-31):**
  - [x] `entries` + `entry_analysis` ahora se insertan dentro de una transacción explícita (`BEGIN`/`COMMIT`); en caso de error (p. ej. falla Groq) se ejecuta `ROLLBACK` para revertir la entrada y evitar huérfanas/duplicados
  - [x] El embedding sigue siendo resiliente (se omite guardando `null` sin romper); la transacción solo revierte si el análisis Groq o el INSERT de `entry_analysis` fallan
  - [x] El rollback se intenta en el catch (con try/catch propio por si la conexión ya se cerró) antes de propagar el error
  - [x] Verificado con script de prueba: commit persiste entrada; rollback la deshace (solo quedó la entrada commiteada en la BD). Datos de prueba y script eliminados. Commit `fb27cf2`
- [x] **FASE 5.2 — Optimización: análisis y embedding en paralelo (2026-08-31):**
  - [x] En `POST /api/entries`, `analyzeEntry` (Groq) y `generateEmbedding` (Jina) ahora se lanzan en **paralelo** con `Promise.allSettled` en lugar de secuencialmente, reduciendo la latencia de respuesta
  - [x] Se preserva la semántica: el análisis Groq es obligatorio (si falla, `rejected` → se lanza y la transacción revierte); el embedding es opcional (si falla, se omite guardando `null` sin romper)
  - [x] Verificado: backend arranca OK (`/health` 200) sin errores. Commit `a0b7f1c`

## Tareas Pendientes Inmediatas
- [ ] **FASE 6 (próxima):** definir siguiente bloque de evolución a propuesta del usuario.

## Decisiones Técnicas
| Clave | Valor |
| :--- | :--- |
| Stack | React + Tailwind / Node.js + Express / PostgreSQL + pgvector / Groq API |
| Backend | `backend/` — Node ESM, Express 5, `pg` (Pool), `groq-sdk`, `cors` |
| Frontend | `frontend/` — Vite 8, React 19, Tailwind v4 (`@tailwindcss/vite`), `recharts`, `react-router-dom` |
| Puerto (backend) | `3001` (`PORT` en `.env`) |
| Puerto (frontend/dev) | `5173` con proxy `/api` → `http://localhost:3001` |
| Ruta raíz | `POST /api/entries` y `GET /api/entries`; `GET /api/entries/search?q=`; `GET /api/entries/alerts`; `GET /health` |
| Modelo Groq | `openai/gpt-oss-20b` (configurable con `GROQ_MODEL`; el catálogo de Groq cambió en 2026 y `llama-3.3-70b-versatile` ya no existe) |
| Formato de análisis | JSON con `burnout_score` (1-10), `primary_emotion`, `entities_tags[]` vía `response_format: json_object` |
| Embeddings | **Fase 5:** Jina AI `jina-embeddings-v3` (1024 dims) vía `generateEmbedding()`; se guardan en `entry_analysis.embedding` (pgvector). `POST /api/entries` omite (null) si el embedding falla. Antes: stub que devolvía `null` |
| Búsqueda semántica | **Fase 5:** `GET /api/entries/search?q=` usa operador `<=>` (similitud coseno) con HNSW sobre la columna `vector`; devuelve `similarity`. Solo encuentra entradas con embedding no-nulo |
| Autenticación | **Fase 2 (frontend + backend listos):** Firebase Auth (email/password). Frontend: Bearer Token con cada petición. Backend: `requireAuth` valida con Firebase Admin SDK; `uid` = `user_id`. `users.id` es `VARCHAR` = UID |
| Usuario por defecto | Eliminado (antes: `demo@diario.local`). `ensureUser()` da de alta el usuario en `users` a partir del token |
| Config backend | `backend/.env.example` → `DATABASE_URL`, `GROQ_API_KEY`, `GROQ_MODEL`, `JINA_API_KEY`, `PORT`, `FIREBASE_PROJECT_ID`, `FIREBASE_SERVICE_ACCOUNT_PATH` (`serviceAccountKey.json` — ignorado en git; NO subir al remoto) |
| Config frontend | `frontend/.env.example` → `VITE_API_URL` (default `/api`), `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID` |
| Alertas del dashboard | **Fase 3:** generadas por IA en el backend vía `GET /api/entries/alerts` (Groq analiza últimas 10 entradas → 0-3 alertas accionables). Antes eran heurística local en el frontend |
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