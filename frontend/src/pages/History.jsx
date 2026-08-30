import { useEffect, useState } from 'react';
import { fetchEntries } from '../api.js';
import StressBadge from '../components/StressBadge.jsx';

function formatDate(iso) {
  return new Date(iso).toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function History() {
  const [entries, setEntries] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEntries()
      .then(setEntries)
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        No se pudo conectar con la API: {error}
      </div>
    );
  }

  if (!entries) {
    return <p className="text-sm text-slate-500">Cargando historial…</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Registro analítico</h1>
        <p className="text-sm text-slate-500">Línea de tiempo de tus entradas analizadas.</p>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
          <p className="text-sm text-slate-500">Aún no hay entradas. Escribe la primera en “Nueva entrada”.</p>
        </div>
      ) : (
        <ol className="relative space-y-4 border-l-2 border-slate-200 pl-4">
          {entries.map((e) => (
            <li key={e.id} className="relative">
              <span className="absolute -left-[23px] top-4 h-3 w-3 rounded-full border-2 border-white bg-indigo-500" />
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <time className="text-xs font-medium text-slate-400">{formatDate(e.created_at)}</time>
                  <StressBadge score={e.burnout_score} />
                </div>
                <p className="line-clamp-3 text-sm text-slate-700">{e.raw_text}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {!e.entities_tags || e.entities_tags.length === 0 ? (
                    <span className="text-xs text-slate-400">Sin etiquetas</span>
                  ) : (
                    e.entities_tags.map((tag, i) => (
                      <span key={i} className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">
                        [{tag}]
                      </span>
                    ))
                  )}
                  {e.primary_emotion && (
                    <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-xs italic capitalize text-indigo-600">
                      {e.primary_emotion}
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}