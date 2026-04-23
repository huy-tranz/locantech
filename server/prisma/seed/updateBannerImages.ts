import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Map banner ID → image path in uploads folder
const bannerImages: Record<string, string> = {
  b1: '/uploads/banners/banner-pc-gaming.jpg',
  b2: '/uploads/banners/banner-laptop.jpg',
  b3: '/uploads/banners/banner-repair.jpg',
  b4: '/uploads/banners/banner-camera.jpg',
  b5: '/uploads/banners/banner-ssd.jpg',
}

async function main() {
  console.log('🔄 Updating banner images...\n')

  for (const [id, image] of Object.entries(bannerImages)) {
    const updated = await prisma.banner.update({
      where: { id },
      data: { image },
    })
    console.log(`✅ ${id}: ${image}`)
  }

  console.log('\n✅ Done! All banners updated.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
