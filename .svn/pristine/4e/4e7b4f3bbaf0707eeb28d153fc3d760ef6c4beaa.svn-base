import { prisma } from '@/config/database'
import { generateSlug } from '@/utils/slug.util'
import { AppError } from '@/middleware/error.middleware'

export const categoryService = {
  async getAll() {
    // Return nested tree structure
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: { children: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
      orderBy: { sortOrder: 'asc' },
    })
    return categories.filter((c) => !c.parentId) // Only root categories
  },

  async getAllFlat() {
    return prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    })
  },

  async getById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { parent: true, children: { where: { isActive: true } } },
    })
    if (!category) throw new AppError(404, 'Category not found')
    return category
  },

  async getBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: { children: { where: { isActive: true } } },
    })
    if (!category) throw new AppError(404, 'Category not found')
    return category
  },

  async create(data: { name: string; image?: string; parentId?: string; sortOrder?: number }) {
    const slug = generateSlug(data.name)

    if (data.parentId) {
      const parent = await prisma.category.findUnique({ where: { id: data.parentId } })
      if (!parent) throw new AppError(404, 'Parent category not found')
    }

    return prisma.category.create({
      data: { ...data, slug },
    })
  },

  async update(id: string, data: { name?: string; image?: string; parentId?: string; sortOrder?: number; isActive?: boolean }) {
    const category = await prisma.category.findUnique({ where: { id } })
    if (!category) throw new AppError(404, 'Category not found')

    const slug = data.name ? generateSlug(data.name) : category.slug

    return prisma.category.update({
      where: { id },
      data: { ...data, slug },
    })
  },

  async delete(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { children: true, products: true },
    })
    if (!category) throw new AppError(404, 'Category not found')

    if (category.children.length > 0) {
      throw new AppError(400, 'Cannot delete category with subcategories')
    }

    if (category.products.length > 0) {
      // Just unlink products instead of blocking delete
      await prisma.product.updateMany({
        where: { categoryId: id },
        data: { categoryId: null },
      })
    }

    await prisma.category.delete({ where: { id } })
    return { message: 'Category deleted' }
  },
}
