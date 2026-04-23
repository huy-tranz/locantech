import { Router } from 'express'
import { authenticate } from '@/middleware/auth.middleware'
import * as CartController from '@/controllers/cart.controller'

const router = Router()

// All cart routes require authentication
router.get('/cart', authenticate, CartController.getCart)
router.post('/cart/items', authenticate, CartController.addItem)
router.patch('/cart/items/:productId', authenticate, CartController.updateQuantity)
router.delete('/cart/items/:productId', authenticate, CartController.removeItem)
router.delete('/cart', authenticate, CartController.clearCart)
router.post('/cart/merge', authenticate, CartController.mergeCart)

export default router
