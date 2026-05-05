import { Request, Response, NextFunction } from 'express'
import { repairService } from '@/services/repair.service'

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requests = await repairService.getAll(req.user!.id)
    res.json(requests)
  } catch (err) { next(err) }
}

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await repairService.getById(String(req.params.id), req.user!.id)
    res.json(request)
  } catch (err) { next(err) }
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const request = await repairService.create(req.user!.id, req.body)
    res.status(201).json(request)
  } catch (err) { next(err) }
}

// Admin only
export const getAllAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await repairService.getAllAdmin({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
      status: req.query.status as string,
    })
    res.json(result)
  } catch (err) { next(err) }
}

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, note } = req.body
    const request = await repairService.updateStatus(String(req.params.id), status, note, req.user!.id)
    res.json(request)
  } catch (err) { next(err) }
}
