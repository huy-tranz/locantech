import { prisma } from '@/config/database'
import { AppError } from '@/middleware/error.middleware'

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

  async create(data: any) {
    return prisma.banner.create({ data })
  },

  async update(id: string, data: any) {
    return prisma.banner.update({ where: { id }, data })
  },

  async delete(id: string) {
    await prisma.banner.delete({ where: { id } })
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
    return prisma.news.update({ where: { id }, data })
  },

  async delete(id: string) {
    await prisma.news.delete({ where: { id } })
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

  async getBySlug(slug: string) {
    const service = await prisma.service.findUnique({ where: { slug } })
    if (!service) throw new AppError(404, 'Service not found')
    return service
  },

  async create(data: any) {
    return prisma.service.create({ data })
  },

  async update(id: string, data: any) {
    return prisma.service.update({ where: { id }, data })
  },

  async delete(id: string) {
    await prisma.service.delete({ where: { id } })
    return { message: 'Service deleted' }
  },
}
