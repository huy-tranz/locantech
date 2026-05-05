import 'dotenv/config'
import fs from 'node:fs/promises'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const repoRoot = path.resolve(__dirname, '../../..')
const assetDir = path.join(repoRoot, 'src/assets/products')
const uploadDir = path.join(repoRoot, 'server/uploads/products')

const assetToUploadName: Record<string, string> = {
  'camera-outdoor.png': 'sample-camera-outdoor.png',
  'camera.png': 'sample-camera.png',
  'case.png': 'sample-case.png',
  'cpu.png': 'sample-cpu.png',
  'headset.png': 'sample-headset.png',
  'keyboard.png': 'sample-keyboard.png',
  'laptop-1.png': 'sample-laptop-1.png',
  'laptop-3.png': 'sample-laptop-3.png',
  'laptop-gaming.png': 'sample-laptop-gaming.png',
  'mainboard.png': 'sample-mainboard.png',
  'monitor-gaming.png': 'sample-monitor-gaming.png',
  'monitor.png': 'sample-monitor.png',
  'mouse.png': 'sample-mouse.png',
  'pc-gaming.png': 'sample-pc-gaming.png',
  'pc-office.png': 'sample-pc-office.png',
  'psu.png': 'sample-psu.png',
  'ram.png': 'sample-ram.png',
  'router.png': 'sample-router.png',
  'ssd.png': 'sample-ssd.png',
  'switch.png': 'sample-switch.png',
  'vga.png': 'sample-vga.png',
}

function normalize(value: string) {
  return value.toLowerCase()
}

function selectAsset(sku: string, name: string) {
  const text = normalize(`${sku} ${name}`)

  if (sku.startsWith('LA-LT-')) {
    if (/(gaming|tuf|msi|victus|katana)/i.test(text)) return 'laptop-gaming.png'
    if (/(macbook|ideapad)/i.test(text)) return 'laptop-3.png'
    return 'laptop-1.png'
  }

  if (sku.startsWith('LA-PC-')) return 'pc-office.png'
  if (sku.startsWith('LA-PG-')) return 'pc-gaming.png'

  if (sku.startsWith('LA-LK-')) {
    if (/(ram|memory)/i.test(text)) return 'ram.png'
    if (/(ssd|hdd|ổ cứng|o cung)/i.test(text)) return 'ssd.png'
    if (/(vga|rtx|rx |card)/i.test(text)) return 'vga.png'
    if (/(mainboard|prime|b660|bo mạch|bo mach)/i.test(text)) return 'mainboard.png'
    if (/(nguồn|nguon|psu|corsair cv)/i.test(text)) return 'psu.png'
    if (/(case|vỏ|vo may)/i.test(text)) return 'case.png'
    return 'cpu.png'
  }

  if (sku.startsWith('LA-TBM-')) {
    if (/(switch|sg108)/i.test(text)) return 'switch.png'
    return 'router.png'
  }

  if (sku.startsWith('LA-CAM-')) {
    if (/(ngoài trời|ngoai troi|bullet|hikvision)/i.test(text)) return 'camera-outdoor.png'
    return 'camera.png'
  }

  if (sku.startsWith('LA-MH-')) {
    if (/(gaming|hz|odyssey|g274|27gp|vg249)/i.test(text)) return 'monitor-gaming.png'
    return 'monitor.png'
  }

  if (sku.startsWith('LA-NV-')) {
    if (/(bàn phím|ban phim|keyboard|akko|corsair k70|rapoo)/i.test(text)) return 'keyboard.png'
    if (/(chuột|chuot|mouse|logitech|razer)/i.test(text)) return 'mouse.png'
    if (/(tai nghe|headset|hyperx|steelseries)/i.test(text)) return 'headset.png'
    return 'camera.png'
  }

  return 'laptop-1.png'
}

async function copyAssets() {
  await fs.mkdir(uploadDir, { recursive: true })

  for (const [assetName, uploadName] of Object.entries(assetToUploadName)) {
    await fs.copyFile(path.join(assetDir, assetName), path.join(uploadDir, uploadName))
  }
}

async function main() {
  await copyAssets()

  const products = await prisma.product.findMany({
    select: { id: true, sku: true, name: true, thumbnail: true, images: true },
    orderBy: { sku: 'asc' },
  })

  let updated = 0

  for (const product of products) {
    if (product.thumbnail && !product.thumbnail.includes('/sample-')) {
      continue
    }

    const assetName = selectAsset(product.sku, product.name)
    const uploadName = assetToUploadName[assetName]
    const url = `/uploads/products/${uploadName}`

    await prisma.product.update({
      where: { id: product.id },
      data: {
        thumbnail: url,
        images: [url],
      },
    })

    updated += 1
  }

  console.log(`Copied ${Object.keys(assetToUploadName).length} sample images to ${uploadDir}`)
  console.log(`Updated ${updated} products with upload URLs`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
