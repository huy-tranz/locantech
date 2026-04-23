import { Router } from 'express'
import { authenticate } from '@/middleware/auth.middleware'
import { requireAdmin } from '@/middleware/admin.middleware'
import * as RepairController from '@/controllers/repair.controller'

const router = Router()

// Customer
router.get('/repair', authenticate, RepairController.getAll)
router.get('/repair/:id', authenticate, RepairController.getById)
router.post('/repair', authenticate, RepairController.create)

// Admin
router.get('/admin/repair', ...requireAdmin, RepairController.getAllAdmin)
router.patch('/admin/repair/:id/status', ...requireAdmin, RepairController.updateStatus)

export default router
