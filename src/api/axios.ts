import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ── Request interceptor: attach access token ───────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('locan_access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ── Response interceptor: handle 401 → refresh → retry ───────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalReq = error.config

    // Handle 401: try to refresh token
    if (error.response?.status === 401 && !originalReq._retry) {
      originalReq._retry = true

      const refreshToken = localStorage.getItem('locan_refresh_token')
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL || '/api'}/auth/refresh`,
            { refreshToken }
          )

          localStorage.setItem('locan_access_token', data.accessToken)
          localStorage.setItem('locan_refresh_token', data.refreshToken)

          originalReq.headers.Authorization = `Bearer ${data.accessToken}`
          return api(originalReq)
        } catch {
          // Refresh failed → force logout
          localStorage.removeItem('locan_access_token')
          localStorage.removeItem('locan_refresh_token')
          localStorage.removeItem('locan_auth_user')
          window.location.href = '/dang-nhap'
        }
      } else {
        // No refresh token → redirect to login
        window.location.href = '/dang-nhap'
      }
    }

    return Promise.reject(error)
  }
)

export default api
