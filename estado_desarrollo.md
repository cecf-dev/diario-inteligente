# Estado de Desarrollo — Diario Inteligente

## Fase Actual
**Bloque 0 — Inicialización del proyecto** (COMPLETADO)

## Checklist de Tareas Completadas
- [x] Lectura del prompt maestro `prompt_especificaciones_diario.md`
- [x] Inicialización del repositorio Git (`git init`)
- [x] Configuración del remoto: `https://github.com/cecf-dev/diario-inteligente.git`
- [x] Creación de `README.md`
- [x] Creación de `.gitignore`
- [x] Commit del Bloque 0 con mensaje descriptivo
- [x] Push al repositorio remoto (`main`)

## Tareas Pendientes Inmediatas
- [ ] **Bloque 1 — Base de datos:** PostgreSQL + `pgvector` (docker-compose) y script SQL de migración (tablas `users`, `entries`, `entry_analysis`)

## Decisiones Técnicas
| Clave | Valor |
| :--- | :--- |
| Stack | React + Tailwind / Node.js + Express / PostgreSQL + pgvector / Groq API |
| Puerto (backend) | Pendiente de definir |
| Variables de entorno | Pendientes (`DATABASE_URL`, `GROQ_API_KEY`) |
| Repositorio remoto | `https://github.com/cecf-dev/diario-inteligente.git` |
<!--- | Branch | main | -->

## Metodología
- Desarrollo iterativo por bloques lógicos; cada bloque se detiene para aprobación del usuario.
- Actualizar este archivo al final de cada paso aprobado.
- Commit + push obligatorio al remoto después de cada paso aprobado, antes de avanzar.