import api from './axios'

export default {
  getAll: () => api.get('/repair').then((r) => r.data),
  getById: (id: string) => api.get(`/repair/${id}`).then((r) => r.data),
  create: (data: unknown) => api.post('/repair', data).then((r) => r.data),

  // Admin
  getAllAdmin: (filters?: { page?: number; limit?: number; status?: string }) =>
    api.get('/admin/repair', { params: filters }).then((r) => r.data),

  updateStatus: (id: string, status: string, note?: string) =>
    api.patch(`/admin/repair/${id}/status`, { status, note }).then((r) => r.data),
}
