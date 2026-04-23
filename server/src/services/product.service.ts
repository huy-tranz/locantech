import { prisma } from '@/config/database'
import { Prisma } from '@prisma/client'
import { AppError } from '@/middleware/error.middleware'

export const productService = {
  async getAll(filters: {
    page?: number
    limit?: number
    category?: string
    search?: string
    minPrice?: number
    maxPrice?: number
    sort?: string
    status?: string
    featured?: boolean
    bestSeller?: boolean
    brand?: string
  }) {
    const page = Math.max(1, filters.page || 1)
    const limit = Math.min(100, Math.max(1, filters.limit || 20))
    const skip = (page - 1) * limit

    const where: Prisma.ProductWhereInput = {
      status: filters.status === 'all' ? undefined : 'PUBLISHED',
    }

    if (filters.category) {
      where.category = { slug: filters.category }
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { sku: { contains: filters.search, mode: 'insensitive' } },
        { brand: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters.minPrice !== undefined) {
      where.price = { ...where.price as any, gte: filters.minPrice }
    }

    if (filters.maxPrice !== undefined) {
      where.price = { ...where.price as any, lte: filters.maxPrice }
    }

    if (filters.featured !== undefined) {
      where.isFeatured = filters.featured
    }

    if (filters.bestSeller !== undefined) {
      where.isBestSeller = filters.bestSeller
    }

    if (filters.brand) {
      where.brand = { equals: filters.brand, mode: 'insensitive' }
    }

    // Sorting
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' }
    switch (filters.sort) {
      case 'price_asc': orderBy = { price: 'asc' }; break
      case 'price_desc': orderBy = { price: 'desc' }; break
      case 'name': orderBy = { name: 'asc' }; break
      case 'sold': orderBy = { soldCount: 'desc' }; break
      case 'newest': orderBy = { createdAt: 'desc' }; break
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: { select: { id: true, name: true, slug: true } } },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ])

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  },

  async getById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    })
    if (!product) throw new AppError(404, 'Product not found')
    return product
  },

  async getBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    })
    if (!product) throw new AppError(404, 'Product not found')
    return product
  },

  async getFeatured(limit = 8) {
    return prisma.product.findMany({
      where: { status: 'PUBLISHED', isFeatured: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
    })
  },

  async getBestSellers(limit = 8) {
    return prisma.product.findMany({
      where: { status: 'PUBLISHED', isBestSeller: true },
      take: limit,
      orderBy: { soldCount: 'desc' },
    })
  },

  async getRelated(productId: string, limit = 4) {
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) throw new AppError(404, 'Product not found')

    return prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        id: { not: productId },
        OR: [
          { categoryId: product.categoryId },
          { brand: product.brand },
        ],
      },
      take: limit,
      orderBy: { soldCount: 'desc' },
    })
  },

  async getBrands() {
    const products = await prisma.product.findMany({
      where: { status: 'PUBLISHED', brand: { not: null } },
      select: { brand: true },
      distinct: ['brand'],
      orderBy: { brand: 'asc' },
    })
    return products.map((p) => p.brand).filter(Boolean)
  },

  // Admin CRUD
  async create(data: any) {
    const existing = await prisma.product.findFirst({
      where: { OR: [{ sku: data.sku }, { slug: data.slug }] },
    })
    if (existing) throw new AppError(409, 'Product with this SKU or slug already exists')

    return prisma.product.create({ data })
  },

  async update(id: string, data: any) {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) throw new AppError(404, 'Product not found')

    return prisma.product.update({ where: { id }, data })
  },

  async delete(id: string) {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) throw new AppError(404, 'Product not found')

    await prisma.product.delete({ where: { id } })
    return { message: 'Product deleted' }
  },
}
