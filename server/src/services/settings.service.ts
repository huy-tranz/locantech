import { prisma } from '@/config/database'
import { cleanupUnreferencedUploads, collectChangedUploads } from '@/utils/upload-cleanup.util'

const defaults = {
  id: 'default',
  siteName: 'Lộc An - Máy tính & Dịch vụ IT',
  hotline: '0989386219',
  email: 'info@locan.vn',
  address: '7 La Dương, Hà Đông, Hà Nội',
  workingHours: '8:00 - 21:00 (Thứ 2 - Chủ nhật)',
  facebook: 'https://facebook.com/locantech',
  zalo: '0989386219',
  footerText: '© 2025 Lộc An. Chuyên máy tính, linh kiện, dịch vụ sửa chữa tại Hà Đông.',
  seoTitle: 'Lộc An - Máy tính, Linh kiện, Sửa chữa tại Hà Đông',
  seoDescription:
    'Lộc An cung cấp laptop, PC, linh kiện máy tính chính hãng và dịch vụ sửa chữa uy tín tại Hà Đông, Hà Nội.',
  metaImage: null,
}

export const settingsService = {
  async get() {
    let config = await prisma.siteConfig.findUnique({ where: { id: 'default' } })
    if (!config) {
      config = await prisma.siteConfig.create({ data: defaults })
    }
    return config
  },

  async update(data: Partial<typeof defaults>) {
    const current = await prisma.siteConfig.findUnique({ where: { id: 'default' } })
    const updated = await prisma.siteConfig.upsert({
      where: { id: 'default' },
      create: { ...defaults, ...data },
      update: data,
    })

    await cleanupUnreferencedUploads(collectChangedUploads([current?.metaImage], [updated.metaImage]))

    return updated
  },
}
