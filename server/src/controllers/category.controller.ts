import { Request, Response, NextFunction } from 'express'
import { categoryService } from '@/services/category.service'

export const getAll = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.getAll()
    res.json(categories)
  } catch (err) { next(err) }
}

export const getAllFlat = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.getAllFlat()
    res.json(categories)
  } catch (err) { next(err) }
}

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.getById(req.params.id)
    res.json(category)
  } catch (err) { next(err) }
}

export const getBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.getBySlug(req.params.slug)
    res.json(category)
  } catch (err) { next(err) }
}

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.create(req.body)
    res.status(201).json(category)
  } catch (err) { next(err) }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await categoryService.update(req.params.id, req.body)
    res.json(category)
  } catch (err) { next(err) }
}

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryService.delete(req.params.id)
    res.json(result)
  } catch (err) { next(err) }
}
