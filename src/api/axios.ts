import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalReq = error.config
    const currentPath = window.location.pathname
    const isLoginPage = currentPath === '/dang-nhap' || currentPath === '/admin/login'
    const isProtectedPath =
      currentPath.startsWith('/admin') ||
      currentPath.startsWith('/tai-khoan') ||
      currentPath.startsWith('/checkout')
    const loginPath = currentPath.startsWith('/admin') ? '/admin/login' : '/dang-nhap'

    const clearAuth = () => {
      localStorage.removeItem('locan_access_token')
      localStorage.removeItem('locan_refresh_token')
      localStorage.removeItem('locan_auth_user')
      window.dispatchEvent(new Event('locan-auth-changed'))
    }

    const redirectIfNeeded = () => {
      if (!isLoginPage && isProtectedPath) {
        window.location.href = loginPath
      }
    }

    if (error.response?.status === 401 && originalReq && !originalReq._retry) {
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
          clearAuth()
          redirectIfNeeded()
        }
      } else {
        clearAuth()
        redirectIfNeeded()
      }
    }

    return Promise.reject(error)
  }
)

export default api
