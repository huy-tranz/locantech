import { Router } from 'express'
import { authenticate, optionalAuth } from '@/middleware/auth.middleware'
import { requireAdmin } from '@/middleware/admin.middleware'
import * as ProductController from '@/controllers/product.controller'

const router = Router()

// Public routes
router.get('/products', optionalAuth, ProductController.getAll)
router.get('/products/featured', ProductController.getFeatured)
router.get('/products/best-sellers', ProductController.getBestSellers)
router.get('/products/brands', ProductController.getBrands)
router.get('/products/slug/:slug', ProductController.getBySlug)
router.get('/products/:id', optionalAuth, ProductController.getById)
router.get('/products/:id/related', ProductController.getRelated)

// Admin routes
router.post('/products', ...requireAdmin, ProductController.create)
router.patch('/products/:id', ...requireAdmin, ProductController.update)
router.delete('/products/:id', ...requireAdmin, ProductController.remove)

export default router
