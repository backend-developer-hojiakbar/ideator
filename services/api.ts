// Do not end with trailing slash to avoid // when joining paths
const API_BASE = ((import.meta as any).env?.VITE_API_BASE || 'https://ideatorapi.pythonanywhere.com/api').replace(/\/$/, '');

export type LoginResponse = {
  access: string;
  refresh: string;
  user: { id: number; phone_number: string; balance: string | number; is_subscribed: boolean };
};

const tokenKey = 'access_token';
const refreshKey = 'refresh_token';

export function setTokens(access: string, refresh: string) {
  localStorage.setItem(tokenKey, access);
  localStorage.setItem(refreshKey, refresh);
}
export function getAccessToken() {
  return localStorage.getItem(tokenKey);
}
export function clearTokens() {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(refreshKey);
}

async function request(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = getAccessToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  // Ensure single slash between base and path
  const url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  const res = await fetch(url, { ...options, headers: { ...headers, ...(options.headers || {}) } });
  if (!res.ok) {
    let message = 'Request failed';
    try { message = await res.text(); } catch {}
    throw new Error(message || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return null;
  const ct = res.headers.get('content-type');
  if (ct && ct.includes('application/json')) return res.json();
  return res.text();
}

export const api = {
  // Auth
  register: (phone_number: string, password: string, full_name?: string, workplace?: string) =>
    request('auth/register/', { method: 'POST', body: JSON.stringify({ phone_number, password, full_name, workplace }) }),
  login: (phone_number: string, password: string): Promise<LoginResponse> =>
    request('auth/login/', { method: 'POST', body: JSON.stringify({ phone_number, password }) }),
  me: () => request('auth/me/'),

  // Notifications
  getNotifications: () => request('notifications/'),
  markNotificationsRead: () => request('notifications/mark-read/', { method: 'POST' }),

  // Wallet
  topup: (amount: number, promo_code?: string) => request('wallet/topup/', { method: 'POST', body: JSON.stringify(promo_code ? { amount, promo_code } : { amount }) }),

  // Projects
  startProject: (payload: { project_name: string; description: string; config?: number | null; data: any }) =>
    request('projects/start/', { method: 'POST', body: JSON.stringify(payload) }),
  getProjects: () => request('projects/'),

  // Listings (Investor marketplace)
  createListing: (payload: { project: number; funding_sought: number; equity_offered: number; pitch: string }) =>
    request('listings/', { method: 'POST', body: JSON.stringify(payload) }),
  listListings: (all: boolean = false) => request(`listings/${all ? '?all=1' : ''}`),
  // Partners
  listPartners: () => request('partners/'),
};
