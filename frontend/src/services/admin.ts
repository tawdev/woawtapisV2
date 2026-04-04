import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/v1/core';
const API_URL = `${API_BASE_URL}/admin`;

const adminApi = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to add the auth token to every request
adminApi.interceptors.request.use((config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const adminService = {
    // Auth
    login: (credentials: any) => axios.post(`${API_URL}/login`, credentials),
    logout: () => adminApi.post('logout'),
    getMe: () => adminApi.get('me'),

    // Stats
    getStats: (month?: number, year?: number) => {
        let url = 'stats';
        if (month && year) {
            url += `?month=${month}&year=${year}`;
        }
        return adminApi.get(url);
    },

    // Products
    getProducts: (page = 1, search = '', categoryId = '') => {
        let url = `products?page=${page}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (categoryId) url += `&category_id=${categoryId}`;
        return adminApi.get(url);
    },
    getProduct: (id: string | number) => adminApi.get(`products/${id}`),
    createProduct: (data: any) => adminApi.post('products', data),
    updateProduct: (id: string | number, data: any) => adminApi.put(`products/${id}`, data),
    deleteProduct: (id: string | number) => adminApi.delete(`products/${id}`),
    addProductImage: (id: string | number, data: FormData | { image_url: string }) => {
        const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
        return adminApi.post(`products/${id}/images`, data, { headers });
    },
    deleteProductImage: (id: string | number, imageId: string | number) => adminApi.delete(`products/${id}/images/${imageId}`),
    setProductPrimaryImage: (id: string | number, imageId: string | number) => adminApi.patch(`products/${id}/images/${imageId}/primary`),

    // Categories
    getCategories: () => adminApi.get('categories'),
    getCategory: (id: string | number) => adminApi.get(`categories/${id}`),
    createCategory: (data: any) => adminApi.post('categories', data),
    updateCategory: (id: string | number, data: any) => adminApi.put(`categories/${id}`, data),
    deleteCategory: (id: string | number) => adminApi.delete(`categories/${id}`),

    // Orders
    getOrders: (page = 1) => adminApi.get(`orders?page=${page}`),
    getOrder: (id: string | number) => adminApi.get(`orders/${id}`),
    updateOrderStatus: (id: string | number, status: string) => adminApi.patch(`orders/${id}/status`, { status }),
    deleteOrder: (id: string | number) => adminApi.delete(`orders/${id}`),

    // Messages
    getMessages: (page = 1) => adminApi.get(`messages?page=${page}`),
    getMessage: (id: string | number) => adminApi.get(`messages/${id}`),
    deleteMessage: (id: string | number) => adminApi.delete(`messages/${id}`),
};

export default adminService;
