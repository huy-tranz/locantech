import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔍 Checking admin user...\n')

  const user = await prisma.user.findUnique({
    where: { email: 'admin@locan.vn' },
    select: { id: true, email: true, role: true, status: true, passwordHash: true },
  })

  if (!user) {
    console.log('❌ Admin user NOT found in database!')
    return
  }

  console.log('✅ Admin user found:', user.email)
  console.log('   Role:', user.role)
  console.log('   Status:', user.status)
  console.log('   Password hash:', user.passwordHash.substring(0, 30) + '...')

  // Test password
  const passwords = ['123456', 'Admin@LocAn2024!']
  for (const pwd of passwords) {
    const valid = await bcrypt.compare(pwd, user.passwordHash)
    console.log(`\n   Password "${pwd}": ${valid ? '✅ VALID' : '❌ INVALID'}`)
  }

  // Also list ALL users
  console.log('\n📋 All users in database:')
  const allUsers = await prisma.user.findMany({
    select: { id: true, email: true, role: true, status: true },
  })
  console.log(JSON.stringify(allUsers, null, 2))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
