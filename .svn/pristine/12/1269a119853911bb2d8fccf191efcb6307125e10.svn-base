import { Router } from 'express'
import { requireAdmin } from '@/middleware/admin.middleware'
import * as CMSController from '@/controllers/cms.controller'

const router = Router()

// Public
router.get('/news', CMSController.getNews)
router.get('/news/:slug', CMSController.getNewsBySlug)

// Admin
router.get('/admin/news', ...requireAdmin, CMSController.getNewsAdmin)
router.post('/admin/news', ...requireAdmin, CMSController.createNews)
router.patch('/admin/news/:id', ...requireAdmin, CMSController.updateNews)
router.delete('/admin/news/:id', ...requireAdmin, CMSController.deleteNews)

export default router
