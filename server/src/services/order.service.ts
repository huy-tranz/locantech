import { prisma } from '@/config/database'
import { generateOrderNumber } from '@/utils/orderNumber.util'
import { AppError } from '@/middleware/error.middleware'

export const orderService = {
  async getAll(filters: { page?: number; limit?: number; status?: string; userId?: string }) {
    const page = Math.max(1, filters.page || 1)
    const limit = Math.min(100, Math.max(1, filters.limit || 20))
    const skip = (page - 1) * limit

    const where: any = {}
    if (filters.status) where.status = filters.status
    if (filters.userId) where.userId = filters.userId

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: { items: { include: { product: { select: { id: true, slug: true } } } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
    ])

    return {
      orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }
  },

  async getById(orderId: string, userId?: string) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: { select: { id: true, slug: true, images: true } } } },
        user: { select: { id: true, email: true, name: true } },
      },
    })

    if (!order) throw new AppError(404, 'Order not found')
    if (userId && order.userId !== userId) throw new AppError(403, 'Access denied')

    return order
  },

  async create(userId: string, data: {
    items: Array<{ productId: string; quantity: number; price: number; productName: string; productSku: string; productImage?: string }>
    paymentMethod: string
    shippingFee?: number
    discountAmount?: number
    discountCode?: string
    recipientName: string
    recipientPhone: string
    shippingAddress: string
    shippingCity?: string
    note?: string
  }) {
    // Validate products exist and have enough stock
    for (const item of data.items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      if (!product) throw new AppError(404, `Product not found: ${item.productId}`)
      if (product.quantity < item.quantity) {
        throw new AppError(400, `Not enough stock for ${product.name}. Available: ${product.quantity}`)
      }
    }

    const subtotal = data.items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0)
    const shippingFee = data.shippingFee ?? 0
    const discountAmount = data.discountAmount ?? 0
    const total = subtotal + shippingFee - discountAmount

    const order = await prisma.order.create({
      data: {
        orderNumber: await generateOrderNumber(),
        userId,
        paymentMethod: data.paymentMethod as any,
        subtotal,
        shippingFee,
        discountAmount,
        discountCode: data.discountCode,
        total,
        recipientName: data.recipientName,
        recipientPhone: data.recipientPhone,
        shippingAddress: data.shippingAddress,
        shippingCity: data.shippingCity,
        note: data.note,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            productSku: item.productSku,
            productImage: item.productImage,
            price: item.price,
            quantity: item.quantity,
            total: Number(item.price) * item.quantity,
          })),
        },
      },
      include: { items: true },
    })

    // Deduct stock
    for (const item of data.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { quantity: { decrement: item.quantity } },
      })
    }

    // Clear user's cart
    await prisma.cartItem.deleteMany({ where: { userId } })

    return order
  },

  async createGuest(data: {
    items: Array<{ productId: string; quantity: number; price: number; productName: string; productSku: string; productImage?: string }>
    paymentMethod: string
    shippingFee?: number
    discountAmount?: number
    discountCode?: string
    recipientName: string
    recipientPhone: string
    shippingAddress: string
    shippingCity?: string
    note?: string
  }) {
    // Validate products exist and have enough stock
    for (const item of data.items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      if (!product) throw new AppError(404, `Product not found: ${item.productId}`)
      if (product.quantity < item.quantity) {
        throw new AppError(400, `Not enough stock for ${product.name}. Available: ${product.quantity}`)
      }
    }

    const subtotal = data.items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0)
    const shippingFee = data.shippingFee ?? 0
    const discountAmount = data.discountAmount ?? 0
    const total = subtotal + shippingFee - discountAmount

    const order = await prisma.order.create({
      data: {
        orderNumber: await generateOrderNumber(),
        userId: null,
        paymentMethod: data.paymentMethod as any,
        subtotal,
        shippingFee,
        discountAmount,
        discountCode: data.discountCode,
        total,
        recipientName: data.recipientName,
        recipientPhone: data.recipientPhone,
        shippingAddress: data.shippingAddress,
        shippingCity: data.shippingCity,
        note: data.note,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            productSku: item.productSku,
            productImage: item.productImage,
            price: item.price,
            quantity: item.quantity,
            total: Number(item.price) * item.quantity,
          })),
        },
      },
      include: { items: true },
    })

    // Deduct stock (no cart to clear for guest)
    for (const item of data.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { quantity: { decrement: item.quantity } },
      })
    }

    return order
  },

  async updateStatus(orderId: string, status: string, adminId: string) {
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) throw new AppError(404, 'Order not found')

    const updateData: any = { status }

    switch (status) {
      case 'CONFIRMED': updateData.confirmedAt = new Date(); break
      case 'SHIPPED': updateData.shippedAt = new Date(); break
      case 'DELIVERED': updateData.deliveredAt = new Date(); break
      case 'CANCELLED':
        updateData.cancelledAt = new Date()
        // Restore stock
        const orderItems = await prisma.orderItem.findMany({ where: { orderId } })
        for (const item of orderItems) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { quantity: { increment: item.quantity } },
          })
        }
        break
      case 'REFUNDED':
        // Restore stock
        const refundItems = await prisma.orderItem.findMany({ where: { orderId } })
        for (const item of refundItems) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { quantity: { increment: item.quantity } },
          })
        }
        break
    }

    return prisma.order.update({ where: { id: orderId }, data: updateData })
  },

  async getStats() {
    const [total, pending, processing, shipped, delivered, cancelled, revenue] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: { in: ['CONFIRMED', 'PROCESSING'] } } }),
      prisma.order.count({ where: { status: 'SHIPPED' } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
      prisma.order.count({ where: { status: 'CANCELLED' } }),
      prisma.order.aggregate({
        where: { paymentStatus: 'PAID', status: { not: 'CANCELLED' } },
        _sum: { total: true },
      }),
    ])

    return { total, pending, processing, shipped, delivered, cancelled, revenue: revenue._sum.total || 0 }
  },
}
