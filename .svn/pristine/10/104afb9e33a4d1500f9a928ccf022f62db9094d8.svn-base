import { Request, Response, NextFunction } from 'express'
import { productService } from '@/services/product.service'

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await productService.getAll(req.query as any)
    res.json(result)
  } catch (err) { next(err) }
}

export const getById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getById(req.params.id)
    res.json(product)
  } catch (err) { next(err) }
}

export const getBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.getBySlug(req.params.slug)
    res.json(product)
  } catch (err) { next(err) }
}

export const getFeatured = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.getFeatured(Number(req.query.limit) || 8)
    res.json(products)
  } catch (err) { next(err) }
}

export const getBestSellers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.getBestSellers(Number(req.query.limit) || 8)
    res.json(products)
  } catch (err) { next(err) }
}

export const getRelated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.getRelated(req.params.id, Number(req.query.limit) || 4)
    res.json(products)
  } catch (err) { next(err) }
}

export const getBrands = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const brands = await productService.getBrands()
    res.json(brands)
  } catch (err) { next(err) }
}

// Admin
export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.create(req.body)
    res.status(201).json(product)
  } catch (err) { next(err) }
}

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await productService.update(req.params.id, req.body)
    res.json(product)
  } catch (err) { next(err) }
}

export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await productService.delete(req.params.id)
    res.json(result)
  } catch (err) { next(err) }
}
