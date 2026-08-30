const API_URL = import.meta.env.VITE_API_URL ?? '/api';

async function request(path, options) {
  const res = await fetch(`${API_URL}${path}`, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`);
  return data;
}

export function fetchEntries() {
  return request('/entries');
}

export function createEntry(rawText) {
  return request('/entries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw_text: rawText }),
  });
}