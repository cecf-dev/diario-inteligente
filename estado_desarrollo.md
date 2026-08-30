# Estado de Desarrollo — Diario Inteligente

## Fase Actual
**Bloque 1 — Base de datos** (EN CURSO)

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

## Tareas Pendientes Inmediatas
- [ ] **Verificación pendiente:** levantar el contenedor de BD y aplicar la migración. (Bloqueado: Docker no está instalado en la máquina de desarrollo; requiere `docker compose up -d` y validar las tablas)
- [ ] **Bloque 2 — Backend:** Node.js + Express, conexión a BD, rutas `/api/entries` y análisis asíncrono con Groq

## Decisiones Técnicas
| Clave | Valor |
| :--- | :--- |
| Stack | React + Tailwind / Node.js + Express / PostgreSQL + pgvector / Groq API |
| Imagen de BD | `pgvector/pgvector:pg16` (incluye extensión `vector`) |
| Puerto (BD) | `5432` (host) → 5432 (contenedor) |
| Credenciales BD (local) | usuario: `diario` / password: `diario_password` / db: `diario_inteligente` (SÓLO local, no producción) |
| Migraciones | scripts SQL en `db/init/`, ejecutadas automáticamente en el primer arranque del contenedor |
| Puerto (backend) | Pendiente de definir |
| Variables de entorno | Pendientes (`DATABASE_URL`, `GROQ_API_KEY`) |
| Repositorio remoto | `https://github.com/cecf-dev/diario-inteligente.git` |
| Branch | `main` |

## Metodología
- Desarrollo iterativo por bloques lógicos; cada bloque se detiene para aprobación del usuario.
- Actualizar este archivo al final de cada paso aprobado.
- Commit + push obligatorio al remoto después de cada paso aprobado, antes de avanzar.