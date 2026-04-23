import { prisma } from '@/config/database'
import { generateTicketNumber } from '@/utils/orderNumber.util'
import { AppError } from '@/middleware/error.middleware'

export const repairService = {
  async getAll(userId: string) {
    return prisma.repairRequest.findMany({
      where: { userId },
      include: {
        product: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getById(requestId: string, userId: string) {
    const request = await prisma.repairRequest.findUnique({
      where: { id: requestId },
      include: {
        product: true,
        timeline: { orderBy: { createdAt: 'asc' } },
      },
    })
    if (!request) throw new AppError(404, 'Repair request not found')
    if (request.userId !== userId) throw new AppError(403, 'Access denied')
    return request
  },

  async create(userId: string, data: {
    deviceBrand: string
    deviceModel: string
    deviceImei?: string
    faultDescription: string
    faultImages?: string[]
    productId?: string
  }) {
    return prisma.repairRequest.create({
      data: {
        ticketNumber: await generateTicketNumber(),
        userId,
        productId: data.productId,
        deviceBrand: data.deviceBrand,
        deviceModel: data.deviceModel,
        deviceImei: data.deviceImei,
        faultDescription: data.faultDescription,
        faultImages: data.faultImages ?? [],
        timeline: {
          create: { status: 'RECEIVED', note: 'Yêu cầu sửa chữa đã được tiếp nhận' },
        },
      },
      include: { timeline: true },
    })
  },

  async updateStatus(requestId: string, status: string, note?: string, adminId?: string) {
    const request = await prisma.repairRequest.findUnique({ where: { id: requestId } })
    if (!request) throw new AppError(404, 'Repair request not found')

    const updateData: any = { status }
    if (status === 'APPROVED' && request.estimatedCost) {
      // Nothing special
    }

    return prisma.repairRequest.update({
      where: { id: requestId },
      data: {
        ...updateData,
        timeline: {
          create: { status, note, updatedBy: adminId },
        },
      },
      include: { timeline: true },
    })
  },

  async getAllAdmin(filters: { page?: number; limit?: number; status?: string }) {
    const page = Math.max(1, filters.page || 1)
    const limit = Math.min(100, Math.max(1, filters.limit || 20))
    const skip = (page - 1) * limit

    const where: any = {}
    if (filters.status) where.status = filters.status

    const [requests, total] = await Promise.all([
      prisma.repairRequest.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          product: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.repairRequest.count({ where }),
    ])

    return { requests, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  },
}
