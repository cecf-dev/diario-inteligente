import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createEntry } from '../api.js';
import StressBadge from '../components/StressBadge.jsx';

const QUICK_TAGS = [
  'Debugging',
  'Proyecto Integrador',
  'Exámenes',
  'Frustración',
  'Trabajo en equipo',
  'Tesis',
];

export default function EntryNew() {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  function appendTag(tag) {
    const clean = tag.replace(/\s+/g, '');
    setText((current) => {
      const base = current.trimEnd();
      return base ? `${base} #${clean}` : `#${clean}`;
    });
    setResult(null);
  }

  async function handleSave() {
    if (!text.trim() || saving) return;
    setSaving(true);
    setError(null);
    try {
      const data = await createEntry(text.trim());
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    setText('');
    setResult(null);
    setError(null);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Nueva entrada</h1>
        <p className="text-sm text-slate-500">Escribe y guarda. El análisis corre en segundo plano.</p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-slate-500">Autocompletado rápido (etiquetas)</p>
        <div className="flex flex-wrap gap-2">
          {QUICK_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => appendTag(tag)}
              className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
            >
              #{tag.replace(/\s+/g, '')}
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        placeholder="¿Cómo te fue hoy? Trabajo, clases, frustraciones, avances…"
        className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
        disabled={saving}
      />

      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">{text.trim().length} caracteres</span>
        <button
          type="button"
          onClick={handleSave}
          disabled={!text.trim() || saving}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {saving ? 'Analizando…' : 'Guardar y analizar'}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      {result && (
        <div className="space-y-3 rounded-xl border border-indigo-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">Análisis de tu entrada</h2>
            <StressBadge score={result.analysis.burnout_score} />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500">Emoción principal</p>
              <p className="mt-1 text-lg font-semibold capitalize text-slate-800">
                {result.analysis.primary_emotion}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-500">Temas detectados</p>
              <div className="mt-1 flex flex-wrap gap-1">
                {result.analysis.entities_tags.length === 0 ? (
                  <span className="text-sm text-slate-400">—</span>
                ) : (
                  result.analysis.entities_tags.map((tag, i) => (
                    <span key={i} className="rounded bg-indigo-100 px-1.5 py-0.5 text-xs text-indigo-700">
                      {tag}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Nueva entrada
            </button>
            <Link
              to="/history"
              className="rounded-lg border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
            >
              Ver historial
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}