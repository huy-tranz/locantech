import api from './axios'

export default {
  getAll: () => api.get('/categories').then((r) => r.data),
  getAllFlat: () => api.get('/categories/flat').then((r) => r.data),
  getById: (id: string) => api.get(`/categories/${id}`).then((r) => r.data),
  getBySlug: (slug: string) => api.get(`/categories/slug/${slug}`).then((r) => r.data),

  // Admin
  create: (data: unknown) => api.post('/categories', data).then((r) => r.data),
  update: (id: string, data: unknown) => api.patch(`/categories/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/categories/${id}`).then((r) => r.data),
}
