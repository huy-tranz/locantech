import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '@/utils/jwt.util'

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string; role: string }
    }
  }
}

/**
 * Require authentication - must have valid JWT access token
 */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeader.slice(7)

  try {
    const payload = verifyAccessToken(token)
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    }
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

/**
 * Optional authentication - attaches user if token valid, but doesn't block
 */
export const optionalAuth = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    try {
      const payload = verifyAccessToken(token)
      req.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      }
    } catch {
      // ignore invalid token
    }
  }

  next()
}
