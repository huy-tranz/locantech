import { Request, Response, NextFunction } from 'express'
import { cartService } from '@/services/cart.service'

export const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = await cartService.getCart(req.user!.id)
    res.json(cart)
  } catch (err) { next(err) }
}

export const addItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId, quantity = 1 } = req.body
    const item = await cartService.addItem(req.user!.id, productId, quantity)
    res.status(201).json(item)
  } catch (err) { next(err) }
}

export const updateQuantity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { quantity } = req.body
    const item = await cartService.updateQuantity(req.user!.id, String(req.params.productId), quantity)
    res.json(item)
  } catch (err) { next(err) }
}

export const removeItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await cartService.removeItem(req.user!.id, String(req.params.productId))
    res.json(result)
  } catch (err) { next(err) }
}

export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await cartService.clearCart(req.user!.id)
    res.json(result)
  } catch (err) { next(err) }
}

export const mergeCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { items } = req.body
    const result = await cartService.mergeCart(req.user!.id, items)
    res.json(result)
  } catch (err) { next(err) }
}
