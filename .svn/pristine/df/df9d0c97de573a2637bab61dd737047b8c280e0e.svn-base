import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import authApi from '@/api/auth.api'

// ── Types ──────────────────────────────────────────────────────────
export interface AuthUser {
  id: string
  email: string
  name: string
  phone?: string
  role: 'CUSTOMER' | 'ADMIN' | 'SUPERADMIN'
  avatar?: string
  status?: string
  createdAt?: string
}

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAdmin: boolean
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<AuthUser>
  register: (data: { email: string; password: string; name: string; phone?: string }) => Promise<void>
  logout: () => void
  updateProfile: (data: { name?: string; phone?: string }) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

// ── Provider ────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Rehydrate user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('locan_access_token')

      // Only trust token if it exists AND server validates it
      if (token) {
        try {
          const serverUser = await authApi.getMe()
          setUser(serverUser)
          localStorage.setItem('locan_auth_user', JSON.stringify(serverUser))
        } catch (error: any) {
          // Token invalid or expired — clear everything
          if (error?.response?.status === 401) {
            localStorage.removeItem('locan_access_token')
            localStorage.removeItem('locan_refresh_token')
            localStorage.removeItem('locan_auth_user')
            setUser(null)
          }
        }
      }
      // No token → stay logged out (don't read stale locan_auth_user)
      setIsLoading(false)
    }

    loadUser()

    // Listen for storage changes (from other tabs or manual login)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'locan_access_token' || e.key === 'locan_auth_user' || e.key === 'locan_refresh_token') {
        loadUser()
      }
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener('locan-auth-changed', loadUser)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('locan-auth-changed', loadUser)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login(email, password)
    localStorage.setItem('locan_access_token', data.accessToken)
    localStorage.setItem('locan_refresh_token', data.refreshToken)
    localStorage.setItem('locan_auth_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user as AuthUser
  }, [])

  const register = useCallback(async (payload: { email: string; password: string; name: string; phone?: string }) => {
    const data = await authApi.register(payload)
    localStorage.setItem('locan_access_token', data.accessToken)
    localStorage.setItem('locan_refresh_token', data.refreshToken)
    localStorage.setItem('locan_auth_user', JSON.stringify(data.user))
    setUser(data.user)
  }, [])

  const logout = useCallback(() => {
    const refreshToken = localStorage.getItem('locan_refresh_token')
    // Always clear localStorage and state FIRST, then call API (fire & forget)
    localStorage.removeItem('locan_access_token')
    localStorage.removeItem('locan_refresh_token')
    localStorage.removeItem('locan_auth_user')
    setUser(null)
    if (refreshToken) {
      authApi.logout(refreshToken).catch(() => {}) // ignore errors
    }
  }, [])

  const updateProfile = useCallback(async (data: { name?: string; phone?: string }) => {
    const updated = await authApi.updateProfile(data)
    setUser(updated)
    localStorage.setItem('locan_auth_user', JSON.stringify(updated))
  }, [])

  const changePassword = useCallback(async (currentPassword: string, newPassword: string) => {
    await authApi.changePassword(currentPassword, newPassword)
    // After password change, all refresh tokens are revoked
    // User stays logged in (server doesn't invalidate current session)
  }, [])

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPERADMIN'
  const isLoggedIn = !!user

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAdmin,
      isLoggedIn,
      login,
      register,
      logout,
      updateProfile,
      changePassword,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ────────────────────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
