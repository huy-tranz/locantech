import api from './axios'

export interface AdminUser {
  id: string
  name: string
  email: string
  phone?: string
  role: 'ADMIN' | 'SUPERADMIN' | 'CUSTOMER'
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED'
  avatar?: string
  createdAt: string
}

export default {
  getAll: () => api.get('/admin/users').then((r) => r.data as AdminUser[]),
  getCustomers: () => api.get('/admin/customers').then((r) => r.data as AdminUser[]),
  getById: (id: string) => api.get(`/admin/users/${id}`).then((r) => r.data as AdminUser),
  create: (data: { name: string; email: string; phone?: string; role?: string; password: string }) =>
    api.post('/admin/users', data).then((r) => r.data as AdminUser),
  update: (id: string, data: { name?: string; phone?: string; role?: string; status?: string }) =>
    api.patch(`/admin/users/${id}`, data).then((r) => r.data as AdminUser),
  delete: (id: string) => api.delete(`/admin/users/${id}`).then((r) => r.data),
}
