export function stressLevel(score) {
  if (score == null) return { bg: 'bg-slate-200', text: 'text-slate-600', label: 'Sin análisis' };
  if (score <= 3) return { bg: 'bg-green-100', text: 'text-green-700', label: 'Bajo' };
  if (score <= 5) return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Moderado' };
  if (score <= 7) return { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Alto' };
  return { bg: 'bg-red-100', text: 'text-red-700', label: 'Crítico' };
}

export default function StressBadge({ score, className = '' }) {
  const level = stressLevel(score);
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${level.bg} ${level.text} ${className}`}>
      {level.label}{score != null ? ` · ${score}/10` : ''}
    </span>
  );
}