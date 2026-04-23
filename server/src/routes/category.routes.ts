import { Router } from 'express'
import { requireAdmin } from '@/middleware/admin.middleware'
import * as CategoryController from '@/controllers/category.controller'

const router = Router()

// Public
router.get('/categories', CategoryController.getAll)
router.get('/categories/flat', CategoryController.getAllFlat)
router.get('/categories/slug/:slug', CategoryController.getBySlug)
router.get('/categories/:id', CategoryController.getById)

// Admin
router.post('/categories', ...requireAdmin, CategoryController.create)
router.patch('/categories/:id', ...requireAdmin, CategoryController.update)
router.delete('/categories/:id', ...requireAdmin, CategoryController.remove)

export default router
