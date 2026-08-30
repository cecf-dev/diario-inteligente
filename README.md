# Diario Inteligente

Aplicación web de telemetría emocional y prevención de burnout para estudiantes universitarios y desarrolladores. Funciona como un diario inteligente que analiza el texto en tiempo real para extraer carga cognitiva, estrés y patrones de trabajo.

## Stack Tecnológico

- **Frontend:** React.js + Tailwind CSS (Vite 8)
- **Backend:** Node.js + Express.js 5
- **Base de Datos:** PostgreSQL 16 con extensión `pgvector`
- **IA:** Groq API (modelos Llama 3) para inferencia ultrarrápida

## Estructura del Proyecto

```
├── backend/          # API Express (Node ESM)
│   └── src/
│       ├── routes/       # Endpoints (/api/entries)
│       └── services/     # Groq, embeddings, usuario demo
├── frontend/         # SPA React + Tailwind (Vite)
│   └── src/
│       ├── pages/        # /dashboard, /entry/new, /history
│       └── components/   # UI reutilizable
├── db/init/          # Migraciones SQL (se ejecutan en el 1er arranque del contenedor)
└── docker-compose.yml  # PostgreSQL + pgvector
```

## Pantallas

- `/dashboard` — El Radar de Burnout: gráficos de tendencias semanales y alertas de burnout generadas por IA.
- `/entry/new` — El Editor de Fricción Cero: captura rápida con análisis asíncrono y autocompletado de etiquetas.
- `/history` — Registro Analítico: línea de tiempo de entradas con etiquetas y nivel de estrés (color).

## API

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/health` | Chequeo de salud del servicio |
| `POST` | `/api/entries` | Crea una entrada y dispara el análisis (Groq + embedding) |
| `GET` | `/api/entries` | Historial de entradas con su análisis |

El `POST /api/entries` espera un JSON: `{ "raw_text": "...", "user_id": "opcional" }`. Si no se envía `user_id`, se usa un usuario demo (`demo@diario.local`).

## Requisitos

- **Node.js** 20+ (probado con Node 24)
- **Docker** (para la base de datos con `pgvector`)
- **API Key de Groq** (https://console.groq.com)

## Puesta en Marcha

### 1. Base de datos (PostgreSQL + pgvector)

```bash
docker compose up -d
```

Levanta PostgreSQL en `localhost:5432` con la base `diario_inteligente` y ejecuta automáticamente la migración de `db/init/`. Credenciales de desarrollo: `diario` / `diario_password`.

### 2. Backend

```bash
cd backend
cp .env.example .env      # Windows: copy .env.example .env
# Edita .env y pon tu GROQ_API_KEY
npm install
npm run dev               # http://localhost:3001
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```

El dev server de Vite redirige `/api` al backend en `localhost:3001`. Abre `http://localhost:5173`.

## Verificación rápida

```bash
curl http://localhost:3001/health
# {"status":"ok","service":"diario-inteligente-backend"}

curl -X POST http://localhost:3001/api/entries \
  -H "Content-Type: application/json" \
  -d '{"raw_text":"Hoy trabajé hasta tarde en el proyecto integrador y estoy agotado."}'
```

## Estado del Proyecto

Consulta [`estado_desarrollo.md`](estado_desarrollo.md) para conocer la fase actual del desarrollo y las decisiones técnicas.