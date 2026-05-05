import { prisma } from '@/config/database'
import { AppError } from '@/middleware/error.middleware'
import { cleanupUnreferencedUploads, collectChangedUploads } from '@/utils/upload-cleanup.util'

// ── Banners ──────────────────────────────────────────────
export const bannerService = {
  async getAll() {
    return prisma.banner.findMany({
      where: {
        isActive: true,
        OR: [
          { startDate: null },
          { startDate: { lte: new Date() } },
        ],
        AND: [
          {
            OR: [
              { endDate: null },
              { endDate: { gte: new Date() } },
            ],
          },
        ],
      },
      orderBy: { sortOrder: 'asc' },
    })
  },

  async getAllAdmin() {
    return prisma.banner.findMany({
      orderBy: [
        { position: 'asc' },
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    })
  },

  async create(data: any) {
    return prisma.banner.create({ data })
  },

  async update(id: string, data: any) {
    const current = await prisma.banner.findUnique({ where: { id } })
    if (!current) throw new AppError(404, 'Banner not found')

    const updated = await prisma.banner.update({ where: { id }, data })
    await cleanupUnreferencedUploads(collectChangedUploads([current.image], [updated.image]))

    return updated
  },

  async delete(id: string) {
    const current = await prisma.banner.findUnique({ where: { id } })
    if (!current) throw new AppError(404, 'Banner not found')

    await prisma.banner.delete({ where: { id } })
    await cleanupUnreferencedUploads([current.image])

    return { message: 'Banner deleted' }
  },
}

// ── News ─────────────────────────────────────────────────
export const newsService = {
  async getAll(filters: { page?: number; limit?: number; tag?: string }) {
    const page = Math.max(1, filters.page || 1)
    const limit = Math.min(50, Math.max(1, filters.limit || 10))
    const skip = (page - 1) * limit

    const where: any = { isPublished: true }
    if (filters.tag) where.tags = { has: filters.tag }

    const [articles, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.news.count({ where }),
    ])

    return { articles, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  },

  async getAllAdmin(filters: { page?: number; limit?: number; tag?: string }) {
    const page = Math.max(1, filters.page || 1)
    const limit = Math.min(100, Math.max(1, filters.limit || 50))
    const skip = (page - 1) * limit

    const where: any = {}
    if (filters.tag) where.tags = { has: filters.tag }

    const [articles, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.news.count({ where }),
    ])

    return { articles, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  },

  async getBySlug(slug: string) {
    const article = await prisma.news.findUnique({ where: { slug } })
    if (!article) throw new AppError(404, 'Article not found')

    // Increment view count
    await prisma.news.update({ where: { id: article.id }, data: { viewCount: { increment: 1 } } })

    return article
  },

  async create(data: any) {
    return prisma.news.create({ data })
  },

  async update(id: string, data: any) {
    const current = await prisma.news.findUnique({ where: { id } })
    if (!current) throw new AppError(404, 'Article not found')

    const updated = await prisma.news.update({ where: { id }, data })
    await cleanupUnreferencedUploads(collectChangedUploads([current.image], [updated.image]))

    return updated
  },

  async delete(id: string) {
    const current = await prisma.news.findUnique({ where: { id } })
    if (!current) throw new AppError(404, 'Article not found')

    await prisma.news.delete({ where: { id } })
    await cleanupUnreferencedUploads([current.image])

    return { message: 'Article deleted' }
  },
}

// ── Services ─────────────────────────────────────────────
export const siteServiceService = {
  async getAll() {
    return prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    })
  },

  async getAllAdmin() {
    return prisma.service.findMany({
      orderBy: [
        { sortOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    })
  },

  async getBySlug(slug: string) {
    const service = await prisma.service.findUnique({ where: { slug } })
    if (!service) throw new AppError(404, 'Service not found')
    return service
  },

  async create(data: any) {
    return prisma.service.create({ data })
  },

  async update(id: string, data: any) {
    const current = await prisma.service.findUnique({ where: { id } })
    if (!current) throw new AppError(404, 'Service not found')

    const updated = await prisma.service.update({ where: { id }, data })
    await cleanupUnreferencedUploads(collectChangedUploads([current.image], [updated.image]))

    return updated
  },

  async delete(id: string) {
    const current = await prisma.service.findUnique({ where: { id } })
    if (!current) throw new AppError(404, 'Service not found')

    await prisma.service.delete({ where: { id } })
    await cleanupUnreferencedUploads([current.image])

    return { message: 'Service deleted' }
  },
}
