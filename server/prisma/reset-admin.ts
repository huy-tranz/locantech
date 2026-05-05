import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('123456', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@locan.vn' },
    update: {
      passwordHash,
      status: 'ACTIVE',
      role: 'SUPERADMIN',
      name: 'LocAn Admin',
      phone: '0989386219',
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

  await prisma.refreshToken.deleteMany({ where: { userId: admin.id } })

  console.log('Admin account ready:', admin.email)
  console.log('Password reset to: 123456')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
