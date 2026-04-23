import { Router } from 'express'
import { authenticate } from '@/middleware/auth.middleware'
import { requireAdmin } from '@/middleware/admin.middleware'
import * as OrderController from '@/controllers/order.controller'

const router = Router()

// Customer routes (must be authenticated)
router.get('/orders', authenticate, OrderController.getAll)
router.get('/orders/:id', authenticate, OrderController.getById)
router.post('/orders', authenticate, OrderController.create)

// Guest checkout (no auth required)
router.post('/orders/guest', OrderController.createGuest)

// Admin routes
router.patch('/orders/:id/status', ...requireAdmin, OrderController.updateStatus)
router.get('/admin/orders/stats', ...requireAdmin, OrderController.getStats)
router.get('/admin/orders', ...requireAdmin, OrderController.getAll)

export default router
