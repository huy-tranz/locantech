import { Router } from 'express'
import { requireAdmin } from '@/middleware/admin.middleware'
import * as CMSController from '@/controllers/cms.controller'

const router = Router()

// Public
router.get('/services', CMSController.getServices)
router.get('/services/:slug', CMSController.getServiceBySlug)

// Admin
router.get('/admin/services', ...requireAdmin, CMSController.getServicesAdmin)
router.post('/admin/services', ...requireAdmin, CMSController.createService)
router.patch('/admin/services/:id', ...requireAdmin, CMSController.updateService)
router.delete('/admin/services/:id', ...requireAdmin, CMSController.deleteService)

export default router
