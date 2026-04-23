import { Router } from 'express'
import { body } from 'express-validator'
import { validate } from '@/middleware/validate.middleware'
import { authenticate } from '@/middleware/auth.middleware'
import * as AuthController from '@/controllers/auth.controller'

const router = Router()

// Public routes
router.post(
  '/auth/register',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('phone').optional().isMobilePhone('vi-VN').withMessage('Invalid Vietnamese phone number'),
  ],
  validate,
  AuthController.register
)

router.post(
  '/auth/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  AuthController.login
)

router.post(
  '/auth/refresh',
  [body('refreshToken').notEmpty().withMessage('Refresh token required')],
  validate,
  AuthController.refresh
)

router.post('/auth/logout', AuthController.logout)

// Protected routes
router.get('/auth/me', authenticate, AuthController.getMe)
router.patch('/auth/me', authenticate, AuthController.updateProfile)
router.post(
  '/auth/change-password',
  authenticate,
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 }),
  ],
  validate,
  AuthController.changePassword
)

export default router
