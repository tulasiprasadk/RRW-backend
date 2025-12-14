// src/api/client.js
// Helper API client functions for frontend

// Default to Vite proxy path in dev so requests go to local backend
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_BASE ||
  '/api';

// Origin helper for building absolute URLs (e.g., for /uploads/* assets)
const BACKEND_ORIGIN = (
  import.meta.env.VITE_BACKEND_ORIGIN ||
  API_BASE.replace(/\/?api\/?$/, '') ||
  (import.meta.env.DEV ? 'http://localhost:4000' : '')
).replace(/\/$/, '');

export { API_BASE, BACKEND_ORIGIN };

export async function get(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  });
  if (!res.ok) throw new Error(`GET ${endpoint} failed: ${res.status}`);
  return res.json();
}

export async function post(endpoint, body, auth = null) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${endpoint} failed: ${res.status}`);
  return res.json();
}

export async function put(endpoint, body) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PUT ${endpoint} failed: ${res.status}`);
  return res.json();
}

export async function del(endpoint) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (!res.ok) throw new Error(`DELETE ${endpoint} failed: ${res.status}`);
  return res.json();
}
