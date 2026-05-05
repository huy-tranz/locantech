import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const sku = 'LA-MZA-004'
const image = '/uploads/products/1777015413256-53258-laptop-acer-gaming-nitro-v-16-ai-propanel-anv16s-61-r9.jpg'

async function main() {
  const product = await prisma.product.findUnique({ where: { sku } })

  if (!product) {
    console.log(`Product ${sku} not found`)
    return
  }

  await prisma.product.update({
    where: { sku },
    data: {
      thumbnail: image,
      images: [image],
    },
  })

  console.log(`Restored ${sku} image to ${image}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
