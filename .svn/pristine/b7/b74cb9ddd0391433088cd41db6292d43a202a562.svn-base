import { prisma } from '@/config/database'
import { AppError } from '@/middleware/error.middleware'

export const cartService = {
  async getCart(userId: string) {
    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true, name: true, slug: true, price: true, images: true,
            thumbnail: true, quantity: true, status: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const validItems = items.filter((i) => i.product.status === 'PUBLISHED')
    const subtotal = validItems.reduce(
      (sum, i) => sum + Number(i.product.price) * i.quantity,
      0
    )

    return { items: validItems, subtotal }
  },

  async addItem(userId: string, productId: string, quantity = 1) {
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product || product.status !== 'PUBLISHED') {
      throw new AppError(404, 'Product not found or unavailable')
    }

    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    })

    if (existing) {
      const newQty = existing.quantity + quantity
      if (newQty > product.quantity) {
        throw new AppError(400, `Only ${product.quantity} items available in stock`)
      }

      return prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQty },
        include: { product: true },
      })
    }

    if (quantity > product.quantity) {
      throw new AppError(400, `Only ${product.quantity} items available in stock`)
    }

    return prisma.cartItem.create({
      data: { userId, productId, quantity },
      include: { product: true },
    })
  },

  async updateQuantity(userId: string, productId: string, quantity: number) {
    const cartItem = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    })
    if (!cartItem) throw new AppError(404, 'Item not in cart')

    if (quantity <= 0) {
      await prisma.cartItem.delete({ where: { id: cartItem.id } })
      return { message: 'Item removed from cart' }
    }

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (quantity > (product?.quantity ?? 0)) {
      throw new AppError(400, `Only ${product?.quantity} items available in stock`)
    }

    return prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity },
      include: { product: true },
    })
  },

  async removeItem(userId: string, productId: string) {
    await prisma.cartItem.deleteMany({
      where: { userId, productId },
    })
    return { message: 'Item removed from cart' }
  },

  async clearCart(userId: string) {
    await prisma.cartItem.deleteMany({ where: { userId } })
    return { message: 'Cart cleared' }
  },

  /**
   * Merge localStorage cart into DB cart when user logs in
   */
  async mergeCart(userId: string, items: Array<{ productId: string; quantity: number }>) {
    const results = []

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      if (!product || product.status !== 'PUBLISHED') continue

      const existing = await prisma.cartItem.findUnique({
        where: { userId_productId: { userId, productId: item.productId } },
      })

      if (existing) {
        // Add quantities, capped at stock
        const newQty = Math.min(existing.quantity + item.quantity, product.quantity)
        results.push(
          await prisma.cartItem.update({
            where: { id: existing.id },
            data: { quantity: newQty },
            include: { product: true },
          })
        )
      } else {
        const qty = Math.min(item.quantity, product.quantity)
        if (qty > 0) {
          results.push(
            await prisma.cartItem.create({
              data: { userId, productId: item.productId, quantity: qty },
              include: { product: true },
            })
          )
        }
      }
    }

    return results
  },
}
