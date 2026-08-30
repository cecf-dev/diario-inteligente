import { useEffect, useMemo, useState } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Link } from 'react-router-dom';
import { fetchEntries } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import StressBadge from '../components/StressBadge.jsx';

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function buildWeekTrend(entries) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push({ date: date.toDateString(), label: DAY_NAMES[date.getDay()], scores: [], count: 0 });
  }
  const byDate = new Map(days.map((d) => [d.date, d]));

  for (const e of entries) {
    const key = new Date(e.created_at).toDateString();
    const bucket = byDate.get(key);
    if (bucket && e.burnout_score != null) {
      bucket.scores.push(e.burnout_score);
      bucket.count += 1;
    }
  }

  return days.map((d) => ({
    label: d.label,
    count: d.count,
    stress: d.scores.length ? +(d.scores.reduce((a, b) => a + b, 0) / d.scores.length).toFixed(1) : null,
  }));
}

function buildAlerts(entries) {
  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - 3);

  const last3 = entries.filter((e) => new Date(e.created_at) >= cutoff);
  const alerts = [];

  const nocturnas = last3.filter((e) => {
    const h = new Date(e.created_at).getHours();
    return h >= 23 || h < 6;
  });
  if (nocturnas.length >= 2) {
    alerts.push('Riesgo de burnout detectado por exceso de trabajo nocturno en los últimos 3 días.');
  }

  const altas = last3.filter((e) => e.burnout_score >= 7);
  if (altas.length >= 2) {
    alerts.push(`Nivel de estrés alto (≥7/10) en ${altas.length} de tus últimas entradas. Considera una pausa antes de seguir.`);
  }

  return alerts;
}

export default function Dashboard() {
  const { getToken } = useAuth();
  const [entries, setEntries] = useState(null);
  const [error, setError] = useState(null);

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

  const stats = useMemo(() => {
    if (!entries) return null;

    const week = buildWeekTrend(entries);
    const weekScores = week.flatMap((d) => d.scores);
    const avg = weekScores.length
      ? +(weekScores.reduce((a, b) => a + b, 0) / weekScores.length).toFixed(1)
      : null;

    const emotions = entries
      .map((e) => e.primary_emotion)
      .filter(Boolean);
    const dominant = emotions.length
      ? emotions
          .sort((a, b) => emotions.filter((v) => v === a).length - emotions.filter((v) => v === b).length)
          .pop()
      : null;

    return {
      week,
      totalWeek: weekScores.filter((s) => s != null).length,
      avg,
      dominant,
      alerts: buildAlerts(entries),
      recent: entries.slice(0, 3),
    };
  }, [entries]);

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        No se pudo conectar con la API: {error}
      </div>
    );
  }

  if (!stats) {
    return <p className="text-sm text-slate-500">Cargando radar de burnout…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Radar de Burnout</h1>
        <p className="text-sm text-slate-500">Tendencias semanales de tu carga emocional.</p>
      </div>

      {stats.alerts.length > 0 ? (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
          <h2 className="mb-1 text-sm font-bold text-amber-800">Alertas de la IA</h2>
          <ul className="list-inside list-disc space-y-1 text-sm text-amber-800">
            {stats.alerts.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          Sin alertas de burnout. Sigue así. ✨
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-500">Estrés promedio (7 días)</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">
            {stats.avg != null ? `${stats.avg}/10` : '—'}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-500">Emoción dominante</p>
          <p className="mt-1 text-2xl font-bold capitalize text-slate-800">{stats.dominant ?? '—'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-500">Entradas esta semana</p>
          <p className="mt-1 text-2xl font-bold text-slate-800">{stats.totalWeek}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Tendencia semanal de estrés</h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={stats.week}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="stress"
              name="Estrés"
              stroke="#6366f1"
              strokeWidth={2}
              connectNulls
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {stats.recent.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-semibold text-slate-700">Últimas entradas</h2>
          <ul className="space-y-2">
            {stats.recent.map((e) => (
              <li key={e.id} className="rounded-xl border border-slate-200 bg-white p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="line-clamp-1 text-sm text-slate-700">{e.raw_text}</p>
                  <StressBadge score={e.burnout_score} className="shrink-0" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link
        to="/entry/new"
        className="inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Escribir una entrada
      </Link>
    </div>
  );
}