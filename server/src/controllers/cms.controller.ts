import { Request, Response, NextFunction } from 'express'
import { bannerService, newsService, siteServiceService } from '@/services/cms.service'

// ── Banners ─────────────────────────────────────
export const getBanners = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const banners = await bannerService.getAll()
    res.json(banners)
  } catch (err) { next(err) }
}

export const createBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const banner = await bannerService.create(req.body)
    res.status(201).json(banner)
  } catch (err) { next(err) }
}

export const updateBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const banner = await bannerService.update(req.params.id, req.body)
    res.json(banner)
  } catch (err) { next(err) }
}

export const deleteBanner = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await bannerService.delete(req.params.id)
    res.json(result)
  } catch (err) { next(err) }
}

export const getBannersAdmin = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const banners = await bannerService.getAllAdmin()
    res.json(banners)
  } catch (err) { next(err) }
}

// ── News ─────────────────────────────────────────
export const getNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await newsService.getAll({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      tag: req.query.tag as string,
    })
    res.json(result)
  } catch (err) { next(err) }
}

export const getNewsBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const article = await newsService.getBySlug(req.params.slug)
    res.json(article)
  } catch (err) { next(err) }
}

export const createNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const article = await newsService.create(req.body)
    res.status(201).json(article)
  } catch (err) { next(err) }
}

export const updateNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const article = await newsService.update(req.params.id, req.body)
    res.json(article)
  } catch (err) { next(err) }
}

export const deleteNews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await newsService.delete(req.params.id)
    res.json(result)
  } catch (err) { next(err) }
}

export const getNewsAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await newsService.getAllAdmin({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 50,
      tag: req.query.tag as string,
    })
    res.json(result)
  } catch (err) { next(err) }
}

// ── Services ─────────────────────────────────────
export const getServices = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const services = await siteServiceService.getAll()
    res.json(services)
  } catch (err) { next(err) }
}

export const getServicesAdmin = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const services = await siteServiceService.getAllAdmin()
    res.json(services)
  } catch (err) { next(err) }
}

export const getServiceBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await siteServiceService.getBySlug(req.params.slug)
    res.json(service)
  } catch (err) { next(err) }
}

export const createService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await siteServiceService.create(req.body)
    res.status(201).json(service)
  } catch (err) { next(err) }
}

export const updateService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await siteServiceService.update(req.params.id, req.body)
    res.json(service)
  } catch (err) { next(err) }
}

export const deleteService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await siteServiceService.delete(req.params.id)
    res.json(result)
  } catch (err) { next(err) }
}
