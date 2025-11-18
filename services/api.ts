// Do not end with trailing slash to avoid // when joining paths
export const API_BASE = ((import.meta as any).env?.VITE_API_BASE || 'http://127.0.0.1:8000/api').replace(/\/$/, '');

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
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers: Record<string, string> = isFormData ? {} : { 'Content-Type': 'application/json' };
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
  register: (phone_number: string, password: string, full_name?: string, workplace?: string, referral_code?: string) =>
    request('auth/register/', { method: 'POST', body: JSON.stringify({ phone_number, password, full_name, workplace, referral_code }) }),
  login: (phone_number: string, password: string): Promise<LoginResponse> =>
    request('auth/login/', { method: 'POST', body: JSON.stringify({ phone_number, password }) }),
  me: () => request('auth/me/'),
  changePassword: (old_password: string, new_password: string) =>
    request('auth/change-password/', { method: 'POST', body: JSON.stringify({ old_password, new_password }) }),

  // Notifications
  getNotifications: () => request('notifications/'),
  markNotificationsRead: () => request('notifications/mark-read/', { method: 'POST' }),

  // Wallet
  topup: (amount: number, promo_code?: string, receipt?: File) => {
    if (receipt) {
      const fd = new FormData();
      fd.append('amount', String(amount));
      if (promo_code) fd.append('promo_code', promo_code);
      fd.append('receipt', receipt);
      return request('wallet/topup/', { method: 'POST', body: fd });
    }
    return request('wallet/topup/', { method: 'POST', body: JSON.stringify(promo_code ? { amount, promo_code } : { amount }) });
  },

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
  // Announcements (Tanlovlar eloni)
  listAnnouncements: () => request('announcements/'),
  // Referral
  generateReferral: () => request('auth/generate-referral/', { method: 'POST' }),
};
