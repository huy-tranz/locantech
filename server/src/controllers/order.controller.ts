import { Request, Response, NextFunction } from 'express'
import { orderService } from '@/services/order.service'

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // If not admin, only show own orders
    const isAdmin = ['ADMIN', 'SUPERADMIN'].includes(req.user!.role)
    const filters: any = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
    }
    if (req.query.status) filters.status = req.query.status
    if (!isAdmin) filters.userId = req.user!.id

    const result = await orderService.getAll(filters)
    res.json(result)
  } catch (err) { next(err) }
}

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isAdmin = ['ADMIN', 'SUPERADMIN'].includes(req.user!.role)
    const order = await orderService.getById(String(req.params.id), isAdmin ? undefined : req.user!.id)
    res.json(order)
  } catch (err) { next(err) }
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.create(req.user!.id, req.body)
    res.status(201).json(order)
  } catch (err) { next(err) }
}

export const createGuest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.createGuest(req.body)
    res.status(201).json(order)
  } catch (err) { next(err) }
}

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body
    const order = await orderService.updateStatus(String(req.params.id), status, req.user!.id)
    res.json(order)
  } catch (err) { next(err) }
}

export const getStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = await orderService.getStats()
    res.json(stats)
  } catch (err) { next(err) }
}
