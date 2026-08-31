const API_URL = import.meta.env.VITE_API_URL ?? '/api';

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? `Error ${res.status}`);
  return data;
}

export function fetchEntries(token) {
  return request('/entries', { token });
}

export function fetchAlerts(token) {
  return request('/entries/alerts', { token });
}

export function searchEntries(q, token) {
  return request(`/entries/search?q=${encodeURIComponent(q)}`, { token });
}

export function createEntry(rawText, token) {
  return request('/entries', {
    method: 'POST',
    body: { raw_text: rawText },
    token,
  });
}