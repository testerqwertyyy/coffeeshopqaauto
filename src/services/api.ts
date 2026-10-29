/**
 * API client for Artisan Roast backend.
 * Base URL configurable via VITE_API_URL env var (defaults to http://localhost:8000).
 * All requests include JWT token from localStorage when available.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

function setToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

function clearToken(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Request failed' }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

// ─── Types ──────────────────────────────────────────────
export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  created_at: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Product {
  id: number;
  name: string;
  origin: string;
  category: string;
  roast_level: string;
  price: number;
  weight: string;
  description: string;
  flavor_notes: string;
  altitude: string;
  process: string;
  image: string;
  stock: number;
}

export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: Product;
}

export interface CartResponse {
  items: CartItem[];
  total_items: number;
  total_price: number;
}

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: number;
  status: string;
  total: number;
  customer_name: string;
  customer_email: string;
  address: string;
  city: string;
  zip_code: string;
  created_at: string;
  items: OrderItem[];
}

// ─── Auth API ───────────────────────────────────────────
export const authApi = {
  register: async (data: { email: string; username: string; password: string; full_name?: string }) => {
    const result = await request<TokenResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setToken(result.access_token);
    localStorage.setItem('user', JSON.stringify(result.user));
    return result;
  },

  login: async (data: { username: string; password: string }) => {
    const result = await request<TokenResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setToken(result.access_token);
    localStorage.setItem('user', JSON.stringify(result.user));
    return result;
  },

  getMe: async () => {
    return request<User>('/api/auth/me');
  },

  logout: () => {
    clearToken();
  },

  isLoggedIn: (): boolean => {
    return !!getToken();
  },

  getUser: (): User | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// ─── Products API ───────────────────────────────────────
export const productsApi = {
  list: async (params?: { category?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    const qs = query.toString();
    return request<Product[]>(`/api/products${qs ? '?' + qs : ''}`);
  },

  get: async (id: number) => {
    return request<Product>(`/api/products/${id}`);
  },
};

// ─── Cart API ───────────────────────────────────────────
export const cartApi = {
  get: async () => {
    return request<CartResponse>('/api/cart');
  },

  add: async (productId: number, quantity: number = 1) => {
    return request<CartResponse>('/api/cart', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId, quantity }),
    });
  },

  update: async (itemId: number, quantity: number) => {
    return request<CartResponse>(`/api/cart/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  },

  remove: async (itemId: number) => {
    return request<CartResponse>(`/api/cart/${itemId}`, {
      method: 'DELETE',
    });
  },

  clear: async () => {
    return request<{ message: string }>('/api/cart', {
      method: 'DELETE',
    });
  },
};

// ─── Orders API ─────────────────────────────────────────
export const ordersApi = {
  create: async (data: {
    customer_name: string;
    customer_email: string;
    address: string;
    city: string;
    zip_code: string;
  }) => {
    return request<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  list: async () => {
    return request<Order[]>('/api/orders');
  },

  get: async (id: number) => {
    return request<Order>(`/api/orders/${id}`);
  },
};
