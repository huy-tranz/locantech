import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function seedAdmin() {
  console.log('Seeding admin account...')

  const passwordHash = await bcrypt.hash('123456', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@locan.vn' },
    update: {
      passwordHash,
      name: 'LocAn Admin',
      phone: '0989386219',
      role: 'SUPERADMIN',
      status: 'ACTIVE',
    },
    create: {
      email: 'admin@locan.vn',
      passwordHash,
      name: 'LocAn Admin',
      phone: '0989386219',
      role: 'SUPERADMIN',
      status: 'ACTIVE',
    },
  })

  console.log(`Admin ready: ${admin.email}`)
  return admin
}
