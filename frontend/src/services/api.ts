const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
const BASE_URL = 'http://localhost:8000';

export function getImageUrl(path?: string) {
  if (!path) return '/images/placeholder.jpg';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/images/')) return path; // Serve local frontend images
  // Ensure the path starts with a slash if it doesn't
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${normalizedPath}`;
}

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export const productService = {
  getAll: (params: string = '') => fetchApi(`/products?${params}`),
  getById: (id: string | number) => fetchApi(`/products/${id}`),
  getBySlug: (slug: string) => fetchApi(`/products/${slug}`),
  getFeatured: () => fetchApi('/featured-products'),
  getBestSellers: () => fetchApi('/best-sellers'),
};

export const categoryService = {
  getAll: () => fetchApi('/categories'),
};

export const orderService = {
  create: (data: any) => fetchApi('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  track: (orderNumber: string) => fetchApi(`/orders/track/${orderNumber}`),
};

export const contactService = {
  sendMessage: (data: any) => fetchApi('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

export const blogService = {
  getAll: (page = 1) => fetchApi(`/blog?page=${page}`),
  getBySlug: (slug: string) => fetchApi(`/blog/${slug}`),
};

export const searchService = {
  getSuggestions: (query: string) => fetchApi(`/search/suggestions?q=${encodeURIComponent(query)}`),
};
