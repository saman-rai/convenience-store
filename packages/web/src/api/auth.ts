import api from './client';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: string;
  storeId?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  storeId: number | null;
  store?: { id: number; name: string };
}

export async function login(data: LoginData) {
  const res = await api.post('/auth/login', data);
  return res.data as { user: User; token: string };
}

export async function register(data: RegisterData) {
  const res = await api.post('/auth/register', data);
  return res.data as { user: User; token: string };
}

export async function getMe() {
  const res = await api.get('/auth/me');
  return res.data as User;
}
