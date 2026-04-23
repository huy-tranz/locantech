import api from './axios'

export default {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then((r) => r.data),

  register: (data: { email: string; password: string; name: string; phone?: string }) =>
    api.post('/auth/register', data).then((r) => r.data),

  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }).then((r) => r.data),

  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }).then((r) => r.data),

  getMe: () => api.get('/auth/me').then((r) => r.data),

  updateProfile: (data: { name?: string; phone?: string; avatar?: string }) =>
    api.patch('/auth/me', data).then((r) => r.data),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password', { currentPassword, newPassword }).then((r) => r.data),
}
