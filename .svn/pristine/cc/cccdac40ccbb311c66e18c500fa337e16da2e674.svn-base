import api from './axios'

export default {
  getAll: (filters?: {
    page?: number
    limit?: number
    category?: string
    search?: string
    minPrice?: number
    maxPrice?: number
    sort?: string
    status?: string
    featured?: boolean
    bestSeller?: boolean
    brand?: string
  }) => api.get('/products', { params: filters }).then((r) => r.data),

  getById: (id: string) => api.get(`/products/${id}`).then((r) => r.data),

  getBySlug: (slug: string) => api.get(`/products/slug/${slug}`).then((r) => r.data),

  getFeatured: (limit?: number) =>
    api.get('/products/featured', { params: { limit } }).then((r) => r.data),

  getBestSellers: (limit?: number) =>
    api.get('/products/best-sellers', { params: { limit } }).then((r) => r.data),

  getRelated: (id: string, limit = 4) =>
    api.get(`/products/${id}/related`, { params: { limit } }).then((r) => r.data),

  getBrands: () => api.get('/products/brands').then((r) => r.data),

  // Admin
  create: (data: unknown) => api.post('/products', data).then((r) => r.data),
  update: (id: string, data: unknown) => api.patch(`/products/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/products/${id}`).then((r) => r.data),
}
