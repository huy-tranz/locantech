import { Request, Response, NextFunction } from 'express'
import { authService } from '@/services/auth.service'
import { AppError } from '@/middleware/error.middleware'

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await authService.register(req.body)
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body
    const result = await authService.login(email, password)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) throw new AppError(400, 'Refresh token required')
    const result = await authService.refreshTokens(refreshToken)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refreshToken } = req.body
    if (refreshToken) {
      await authService.logout(refreshToken)
    }
    res.json({ message: 'Logged out successfully' })
  } catch (err) {
    next(err)
  }
}

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authService.getMe(req.user!.id)
    res.json(user)
  } catch (err) {
    next(err)
  }
}

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authService.updateProfile(req.user!.id, req.body)
    res.json(user)
  } catch (err) {
    next(err)
  }
}

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { currentPassword, newPassword } = req.body
    await authService.changePassword(req.user!.id, currentPassword, newPassword)
    res.json({ message: 'Password changed successfully' })
  } catch (err) {
    next(err)
  }
}
