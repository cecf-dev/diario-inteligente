# Prompt Maestro: Especificaciones del Diario Inteligente

**Actúa como un Tech Lead y Full-Stack Developer.** 
Tu objetivo es desarrollar el MVP de una aplicación web de telemetría emocional y prevención de burnout diseñada para estudiantes universitarios y desarrolladores. El sistema funciona como un diario inteligente que analiza el texto en tiempo real para extraer carga cognitiva, estrés y patrones de trabajo.

A continuación se detallan las especificaciones técnicas, la arquitectura, el flujo de usuario y el esquema de datos. Lee toda la especificación antes de generar código.

### 1. Stack Tecnológico Principal
*   **Frontend:** React.js (con Tailwind CSS para componentes limpios y responsivos).
*   **Backend:** Node.js con Express.js.
*   **Autenticación:** Firebase Auth. El frontend debe manejar la sesión y enviar un Bearer Token al backend en cada petición protegida para ser validado con el SDK de Firebase Admin.
*   **Base de Datos:** PostgreSQL con la extensión `pgvector` (para almacenar embeddings de las entradas y preparar el sistema para una futura arquitectura RAG).
*   **Procesamiento de IA:** Groq API (utilizando modelos como Llama 3) para la inferencia ultrarrápida del texto y extracción de sentimientos/entidades sin latencia perceptible.

### 2. Flujo de Pantallas (UI/UX)
*   **`/login` y `/register`:** Pantallas de autenticación segura. No se puede acceder al resto de la aplicación sin una sesión activa.
*   **`/dashboard` (El Radar de Burnout):** Pantalla principal protegida. Muestra gráficos de tendencias semanales de carga cognitiva, nivel de estrés vs. nivel de logro, y una tarjeta de alertas generadas por IA.
*   **`/entry/new` (El Editor de Fricción Cero):** Un área de texto minimalista enfocada en la captura rápida. Incluye un botón para guardar (que dispara el análisis asíncrono) y sugerencias de autocompletado rápido.
*   **`/history` (Registro Analítico):** Una línea de tiempo de las entradas pasadas filtradas exclusivamente por el ID del usuario autenticado.

### 3. Esquema de Base de Datos Estructurado

| Tabla | Columna | Tipo de Dato | Descripción |
| :--- | :--- | :--- | :--- |
| **users** | `id` | VARCHAR | Identificador único del usuario (Primary Key). Corresponde al UID de Firebase Auth. |
| | `email` | VARCHAR | Correo del usuario. |
| | `created_at` | TIMESTAMP | Fecha de registro. |
| **entries** | `id` | UUID | Identificador de la entrada (Primary Key). |
| | `user_id` | VARCHAR | Referencia al usuario (Foreign Key). |
| | `raw_text` | TEXT | El texto original escrito por el usuario. |
| | `created_at` | TIMESTAMP | Fecha y hora exacta de la captura. |
| **entry_analysis**| `id` | UUID | PK del análisis. |
| | `entry_id` | UUID | Referencia a la entrada (Foreign Key). |
| | `burnout_score`| INTEGER (1-10) | Nivel de riesgo de agotamiento extraído por el LLM. |
| | `primary_emotion`| VARCHAR | Emoción dominante (ej. *estrés, alivio, apatía*). |
| | `entities_tags`| ARRAY[VARCHAR] | Etiquetas de los temas mencionados (ej. *código, exámenes*). |
| | `embedding` | VECTOR(1024)| Representación vectorial del `raw_text` para búsquedas semánticas. |

### 4. Flujo de la API Core (Creación de Entrada)
1.  El cliente hace un `POST /api/entries` con el `raw_text` y el token de autorización en los headers.
2.  El backend valida el token utilizando Firebase Admin SDK. Si es válido, extrae el `uid` que será el `user_id`.
3.  El backend guarda el `raw_text` asociado a ese `user_id` en la tabla `entries`.
4.  El backend hace una llamada asíncrona a la API de Groq solicitando un JSON estructurado que evalúe el texto y extraiga: `burnout_score`, `primary_emotion`, y `entities_tags`.
5.  *(En paralelo o secuencial)* Se genera el embedding del texto para guardarlo en la columna `vector` usando `pgvector`.
6.  Se insertan los resultados en la tabla `entry_analysis`.
7.  El servidor responde al cliente con el análisis para renderizar retroalimentación inmediata.

### 5. Metodología de Trabajo y Control de Versiones (Reglas Estrictas para el Agente)
*   **Desarrollo Iterativo (Paso a Paso):** No intentes programar toda la aplicación de golpe. Debes avanzar por bloques lógicos (ej. primero la base de datos, luego autenticación, luego un endpoint). Al finalizar cada paso, detente y pide mi aprobación para continuar.
*   **Control de Estado Obligatorio:** Crea y mantén actualizado un archivo en la raíz del proyecto llamado `estado_desarrollo.md`. Este archivo actuará como la "memoria" del proyecto para mantener el contexto entre diferentes sesiones. Debe incluir:
    *   La fase actual del desarrollo.
    *   Un checklist de las tareas completadas.
    *   Las tareas pendientes inmediatas.
    *   Cualquier decisión técnica tomada, puerto utilizado o variable de entorno configurada.
    *   *Nota:* Debes actualizar este archivo al final de cada paso aprobado.
*   **Integración Continua con GitHub:** Una vez que yo apruebe el código de un paso y se haya actualizado el `estado_desarrollo.md`, debes realizar un commit con un mensaje descriptivo y un push automático al repositorio remoto: `https://github.com/cecf-dev/diario-inteligente.git`. No avances al siguiente paso sin haber hecho push exitosamente.

**Instrucción de Inicialización de Contexto:**
Este documento es el prompt maestro que se te entregará cada vez que iniciemos una nueva sesión o conversación. 
Al recibir este documento, debes:
1. Confirmar que has leído y entendido todas las especificaciones y reglas de operación.
2. Leer el archivo `estado_desarrollo.md` (si existe en el repositorio) para recuperar el contexto actual del proyecto.
3. Esperar mis siguientes instrucciones o, de manera proactiva, sugerir el siguiente paso lógico a implementar basándote en el estado actual del desarrollo.
