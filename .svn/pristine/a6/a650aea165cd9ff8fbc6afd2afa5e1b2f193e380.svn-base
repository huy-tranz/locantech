import { Request, Response, NextFunction } from 'express'
import { authenticate } from './auth.middleware'

/**
 * Must be logged in AND have ADMIN or SUPERADMIN role
 */
export const requireAdmin = [
  authenticate,
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (!['ADMIN', 'SUPERADMIN'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Admin access required' })
    }

    next()
  },
]

/**
 * Must be SUPERADMIN only
 */
export const requireSuperAdmin = [
  authenticate,
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    if (req.user.role !== 'SUPERADMIN') {
      return res.status(403).json({ error: 'Superadmin access required' })
    }

    next()
  },
]
