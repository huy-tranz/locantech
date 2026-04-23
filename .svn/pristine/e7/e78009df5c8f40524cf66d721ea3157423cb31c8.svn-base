import { Router } from 'express'
import { requireAdmin } from '@/middleware/admin.middleware'
import * as CMSController from '@/controllers/cms.controller'

const router = Router()

// Public
router.get('/banners', CMSController.getBanners)

// Admin
router.get('/admin/banners', ...requireAdmin, CMSController.getBannersAdmin)
router.post('/admin/banners', ...requireAdmin, CMSController.createBanner)
router.patch('/admin/banners/:id', ...requireAdmin, CMSController.updateBanner)
router.delete('/admin/banners/:id', ...requireAdmin, CMSController.deleteBanner)

export default router
