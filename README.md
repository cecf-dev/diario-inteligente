# Diario Inteligente

Aplicación web de telemetría emocional y prevención de burnout para estudiantes universitarios y desarrolladores. Funciona como un diario inteligente que analiza el texto en tiempo real para extraer carga cognitiva, estrés y patrones de trabajo.

## Stack Tecnológico

- **Frontend:** React.js + Tailwind CSS (Vite 8)
- **Backend:** Node.js + Express.js 5
- **Autenticación:** Firebase Auth (frontend) + Firebase Admin SDK (backend)
- **Base de Datos:** PostgreSQL 16 con extensión `pgvector`
- **IA:** Groq API (modelos Llama 3) para inferencia ultrarrápida

## Estructura del Proyecto

```
├── backend/          # API Express (Node ESM)
│   └── src/
│       ├── middleware/    # requireAuth (validación del Bearer Token)
│       ├── routes/        # Endpoints (/api/entries)
│       └── services/      # Groq, embeddings, Firebase/Administración de usuarios
├── frontend/         # SPA React + Tailwind (Vite)
│   └── src/
│       ├── context/       # AuthContext (sesión de Firebase)
│       ├── pages/         # /login, /register, /dashboard, /entry/new, /history
│       └── components/    # UI reutilizable (ProtectedRoute, StressBadge)
├── db/init/          # Migraciones SQL (se ejecutan en el 1er arranque del contenedor)
└── docker-compose.yml  # PostgreSQL + pgvector
```

## Pantallas

- `/login` y `/register` — Autenticación con Firebase (correo/contraseña). Acceso bloqueado sin sesión activa.
- `/dashboard` — El Radar de Burnout: gráficos de tendencias semanales y alertas de burnout generadas por IA.
- `/entry/new` — El Editor de Fricción Cero: captura rápida con análisis asíncrono y autocompletado de etiquetas.
- `/history` — Registro Analítico: línea de tiempo de entradas (solo del usuario autenticado).

## API

| Método | Ruta | Descripción |
| :--- | :--- | :--- |
| `GET` | `/health` | Chequeo de salud del servicio |
| `POST` | `/api/entries` | Crea una entrada y dispara el análisis (Groq + embedding) — requiere token |
| `GET` | `/api/entries` | Historial de entradas del usuario autenticado — requiere token |

Todas las rutas `/api/*` (excepto `/health`) exigen el header:

```
Authorization: Bearer <idToken_de_firebase>
```

El `POST /api/entries` espera un JSON: `{ "raw_text": "..." }`. El `user_id` se obtiene del token (`uid` de Firebase), que también corresponde al `id` de la tabla `users`.

## Requisitos

- **Node.js** 20+ (probado con Node 24)
- **Docker** (para la base de datos con `pgvector`)
- **Cuenta de Google / proyecto Firebase**
- **API Key de Groq** (https://console.groq.com)

## Configuración de Firebase (una sola vez)

### 1. Crear el proyecto y habilitar la autenticación

1. Ve a [Firebase Console](https://console.firebase.google.com) → **Añadir proyecto**.
2. En **Authentication → Sign-in method**, habilita **Correo/Contraseña**.
3. Crea una base de datos si lo deseas (no es requerida por esta app).

### 2. Config web (Frontend)

1. **Project settings → General → Tus apps → Agrega app web**.
2. Copia el objeto `firebaseConfig` (claves `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`).
3. Pega esos valores en `frontend/.env` (ver `frontend/.env.example`).

### 3. Service account (Backend / Admin SDK)

1. **Project settings → Cuentas de servicio → Generar nueva clave privada**. Descarga el JSON (`serviceAccountKey.json`).
2. **ALERTA:** este archivo contiene credenciales privilegiadas. No lo subas al repositorio (ya está en `.gitignore`).
3. Pon su ruta en `backend/.env` como `FIREBASE_SERVICE_ACCOUNT_PATH` (ver `backend/.env.example`).

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
# Edita .env: GROQ_API_KEY, FIREBASE_PROJECT_ID y FIREBASE_SERVICE_ACCOUNT_PATH
npm install
npm run dev               # http://localhost:3001
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env      # Windows: copy .env.example .env
# Edita .env: VITE_FIREBASE_* con la config web de tu proyecto
npm install
npm run dev               # http://localhost:5173
```

El dev server de Vite redirige `/api` al backend en `localhost:3001`. Abre `http://localhost:5173` y regístrate.

## Verificación rápida

```bash
curl http://localhost:3001/health
# {"status":"ok","service":"diario-inteligente-backend"}
```

Para probar una petición protegida necesitas un ID token de Firebase (se obtiene tras iniciar sesión en la app):

```bash
curl http://localhost:3001/api/entries \
  -H "Authorization: Bearer <ID_TOKEN>"
```

## Estado del Proyecto

Consulta [`estado_desarrollo.md`](estado_desarrollo.md) para conocer la fase actual del desarrollo y las decisiones técnicas.