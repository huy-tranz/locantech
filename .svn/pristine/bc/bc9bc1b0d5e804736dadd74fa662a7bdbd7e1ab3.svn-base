import { PrismaClient } from '@prisma/client'
import { seedAdmin } from './seedAdmin'
import { seedCategories } from './seedCategories'
import { seedProducts, setCategoryMap } from './seedProducts'
import { seedBanners } from './seedBanners'
import { seedNews } from './seedNews'
import { seedServices } from './seedServices'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting database seed...\n')

  // 1. Admin account
  await seedAdmin()

  // 2. Categories (must come before products)
  const categoryMap = await seedCategories()

  // 3. Products (need category IDs)
  await setCategoryMap(categoryMap)
  await seedProducts()

  // 4. CMS content
  await seedBanners()
  await seedNews()
  await seedServices()

  console.log('\n🎉 Database seeding completed successfully!')
  console.log('\n📋 Admin credentials:')
  console.log('   Email:    admin@locan.vn')
  console.log('   Password: 123456')
}

main()
  .catch((err) => {
    console.error('❌ Seeding failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
