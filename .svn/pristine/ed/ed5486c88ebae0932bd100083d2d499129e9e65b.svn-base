import api from './axios'

export default {
  // Banners
  getBanners: () => api.get('/banners').then((r) => r.data),
  getAdminBanners: () => api.get('/admin/banners').then((r) => r.data),
  createBanner: (data: unknown) => api.post('/admin/banners', data).then((r) => r.data),
  updateBanner: (id: string, data: unknown) => api.patch(`/admin/banners/${id}`, data).then((r) => r.data),
  deleteBanner: (id: string) => api.delete(`/admin/banners/${id}`).then((r) => r.data),

  // News
  getNews: (filters?: { page?: number; limit?: number; tag?: string }) =>
    api.get('/news', { params: filters }).then((r) => r.data),
  getAdminNews: (filters?: { page?: number; limit?: number; tag?: string }) =>
    api.get('/admin/news', { params: filters }).then((r) => r.data),
  getNewsBySlug: (slug: string) => api.get(`/news/${slug}`).then((r) => r.data),
  createNews: (data: unknown) => api.post('/admin/news', data).then((r) => r.data),
  updateNews: (id: string, data: unknown) => api.patch(`/admin/news/${id}`, data).then((r) => r.data),
  deleteNews: (id: string) => api.delete(`/admin/news/${id}`).then((r) => r.data),

  // Services
  getServices: () => api.get('/services').then((r) => r.data),
  getAdminServices: () => api.get('/admin/services').then((r) => r.data),
  getServiceBySlug: (slug: string) => api.get(`/services/${slug}`).then((r) => r.data),
  createService: (data: unknown) => api.post('/admin/services', data).then((r) => r.data),
  updateService: (id: string, data: unknown) => api.patch(`/admin/services/${id}`, data).then((r) => r.data),
  deleteService: (id: string) => api.delete(`/admin/services/${id}`).then((r) => r.data),
}
