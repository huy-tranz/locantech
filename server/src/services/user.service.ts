import { prisma } from '@/config/database'
import { hashPassword } from '@/utils/bcrypt.util'
import { Role, UserStatus } from '@prisma/client'

export const userService = {
  async getAllAdmin() {
    return prisma.user.findMany({
      where: { role: { in: [Role.ADMIN, Role.SUPERADMIN] } },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        avatar: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getAllCustomers() {
    return prisma.user.findMany({
      where: {
        role: Role.CUSTOMER,
        status: { not: 'DELETED' },
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        avatar: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        avatar: true,
        createdAt: true,
      },
    })
  },

  async create(data: { name: string; email: string; phone?: string; role: Role; password: string }) {
    const passwordHash = await hashPassword(data.password)
    const { password, ...userData } = data
    return prisma.user.create({
      data: { ...userData, passwordHash },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        avatar: true,
        createdAt: true,
      },
    })
  },

  async update(id: string, data: { name?: string; phone?: string; role?: Role; status?: UserStatus }) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        status: true,
        avatar: true,
        createdAt: true,
      },
    })
  },

  async delete(id: string) {
    // Soft-delete by suspending
    return prisma.user.update({
      where: { id },
      data: { status: 'DELETED' },
      select: { id: true },
    })
  },
}
