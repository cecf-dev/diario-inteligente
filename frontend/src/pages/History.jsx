import { useEffect, useState } from 'react';
import { fetchEntries, searchEntries } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
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
  const { getToken } = useAuth();
  const [entries, setEntries] = useState(null);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const token = await getToken();
        const data = await fetchEntries(token);
        if (alive) setEntries(data);
      } catch (err) {
        if (alive) setError(err.message);
      }
    })();
    return () => {
      alive = false;
    };
  }, [getToken]);

  async function handleSearch(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    setSearching(true);
    setSearchError(null);
    try {
      const token = await getToken();
      const results = await searchEntries(q, token);
      setEntries(results);
    } catch (err) {
      setSearchError(err.message);
      setEntries(null);
    } finally {
      setSearching(false);
    }
  }

  async function clearSearch(e) {
    e.preventDefault();
    setQuery('');
    setSearchError(null);
    try {
      const token = await getToken();
      const data = await fetchEntries(token);
      setEntries(data);
    } catch (err) {
      setError(err.message);
    }
  }

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

      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por concepto (búsqueda semántica)…"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={searching || !query.trim()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          Buscar
        </button>
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            Limpiar
          </button>
        )}
      </form>

      {searchError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {searchError}
        </div>
      )}

      {searching && <p className="text-sm text-slate-500">Buscando…</p>}

      {entries.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center">
          <p className="text-sm text-slate-500">
            {query ? 'Sin coincidencias semánticas para tu búsqueda.' : 'Aún no hay entradas. Escribe la primera en “Nueva entrada”.'}
          </p>
        </div>
      ) : (
        <ol className="relative space-y-4 border-l-2 border-slate-200 pl-4">
          {entries.map((e) => (
            <li key={e.id} className="relative">
              <span className="absolute -left-[23px] top-4 h-3 w-3 rounded-full border-2 border-white bg-indigo-500" />
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <time className="text-xs font-medium text-slate-400">{formatDate(e.created_at)}</time>
                  <div className="flex items-center gap-2">
                    {e.similarity != null && (
                      <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-xs text-emerald-700">
                        {Math.round(e.similarity * 100)}% similar
                      </span>
                    )}
                    <StressBadge score={e.burnout_score} />
                  </div>
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