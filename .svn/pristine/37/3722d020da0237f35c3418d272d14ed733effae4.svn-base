import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('123456', 12)

  const admin = await prisma.user.update({
    where: { email: 'admin@locan.vn' },
    data: { passwordHash, status: 'ACTIVE' },
  })

  console.log('✅ Admin password updated:', admin.email)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
