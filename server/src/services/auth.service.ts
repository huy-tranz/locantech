import { prisma } from '@/config/database'
import { hashPassword, comparePassword } from '@/utils/bcrypt.util'
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '@/utils/jwt.util'
import { AppError } from '@/middleware/error.middleware'

export const authService = {
  /**
   * Register a new user
   */
  async register(data: { email: string; password: string; name: string; phone?: string }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      throw new AppError(409, 'Email already registered')
    }

    const passwordHash = await hashPassword(data.password)

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        phone: data.phone,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
        createdAt: true,
      },
    })

    return this._createTokenResponse(user.id, user.email, user.role, user.name)
  },

  /**
   * Login with email and password
   */
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
      throw new AppError(401, 'Invalid email or password')
    }

    if (user.status === 'SUSPENDED') {
      throw new AppError(403, 'Account suspended')
    }

    if (user.status === 'DELETED') {
      throw new AppError(401, 'Account deleted')
    }

    const valid = await comparePassword(password, user.passwordHash)
    if (!valid) {
      throw new AppError(401, 'Invalid email or password')
    }

    return this._createTokenResponse(user.id, user.email, user.role, user.name)
  },

  /**
   * Refresh access token using refresh token
   * Uses token rotation: old refresh token is invalidated
   */
  async refreshTokens(refreshToken: string) {
    let payload
    try {
      payload = verifyRefreshToken(refreshToken)
    } catch {
      throw new AppError(401, 'Invalid refresh token')
    }

    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    })

    if (!stored || stored.expiresAt < new Date()) {
      // Clean up expired token
      if (stored) await prisma.refreshToken.delete({ where: { id: stored.id } })
      throw new AppError(401, 'Refresh token expired or revoked')
    }

    // Rotate: delete old refresh token
    await prisma.refreshToken.delete({ where: { id: stored.id } })

    return this._createTokenResponse(
      stored.user.id,
      stored.user.email,
      stored.user.role,
      stored.user.name
    )
  },

  /**
   * Logout: revoke refresh token
   */
  async logout(refreshToken: string) {
    try {
      await prisma.refreshToken.delete({ where: { token: refreshToken } })
    } catch {
      // Token may not exist, ignore
    }
  },

  /**
   * Get current user profile
   */
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
        status: true,
        createdAt: true,
      },
    })

    if (!user) {
      throw new AppError(404, 'User not found')
    }

    return user
  },

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: { name?: string; phone?: string; avatar?: string }) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
      },
    })
    return user
  },

  /**
   * Change password
   */
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new AppError(404, 'User not found')

    const valid = await comparePassword(currentPassword, user.passwordHash)
    if (!valid) throw new AppError(400, 'Current password is incorrect')

    const passwordHash = await hashPassword(newPassword)
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    })

    // Revoke all refresh tokens (force re-login)
    await prisma.refreshToken.deleteMany({ where: { userId } })
  },

  // ── Private helpers ────────────────────────────────────────────

  async _createTokenResponse(userId: string, email: string, role: string, name: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatar: true,
        status: true,
        createdAt: true,
      },
    })
    if (!user) throw new AppError(404, 'User not found')

    const accessToken = generateAccessToken({ sub: user.id, email: user.email, role: user.role, type: 'access' })
    const refreshToken = generateRefreshToken({ sub: userId, type: 'refresh' })

    // Save refresh token to DB (for revocation)
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    })

    return {
      user,
      accessToken,
      refreshToken,
    }
  },
}
