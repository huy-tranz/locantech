import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ServiceData {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  features: string[]
  priceFrom?: number
  isActive: boolean
  sortOrder: number
}

const services: ServiceData[] = [
  { id: 's1', name: 'Sửa chữa laptop', slug: 'sua-laptop', description: 'Sửa lỗi phần cứng, thay linh kiện, sửa bản lề, thay màn hình laptop các hãng', icon: '🔧', features: ['Sửa lỗi phần cứng', 'Thay linh kiện', 'Sửa bản lề', 'Thay màn hình'], priceFrom: 200000, isActive: true, sortOrder: 1 },
  { id: 's2', name: 'Sửa chữa PC', slug: 'sua-pc', description: 'Kiểm tra, sửa chữa máy tính bàn, thay thế linh kiện hỏng', icon: '🖥️', features: ['Kiểm tra miễn phí', 'Sửa lỗi phần mềm', 'Thay thế linh kiện'], priceFrom: 150000, isActive: true, sortOrder: 2 },
  { id: 's3', name: 'Vệ sinh máy tính', slug: 've-sinh-may-tinh', description: 'Vệ sinh bụi bẩn, thay keo tản nhiệt, giúp máy mát hơn và hoạt động ổn định', icon: '🧹', features: ['Vệ sinh bụi bẩn', 'Thay keo tản nhiệt', 'Kiểm tra quạt'], priceFrom: 150000, isActive: true, sortOrder: 3 },
  { id: 's4', name: 'Cài Windows & phần mềm', slug: 'cai-windows', description: 'Cài đặt hệ điều hành, driver, phần mềm bản quyền, diệt virus', icon: '💿', features: ['Cài Windows bản quyền', 'Cài driver', 'Cài phần mềm văn phòng', 'Diệt virus'], priceFrom: 150000, isActive: true, sortOrder: 4 },
  { id: 's5', name: 'Nâng cấp SSD, RAM', slug: 'nang-cap-ssd-ram', description: 'Nâng cấp RAM, SSD cho laptop và PC, giúp máy nhanh hơn đáng kể', icon: '💾', features: ['Nâng cấp RAM', 'Nâng cấp SSD', 'Chuyển dữ liệu miễn phí'], priceFrom: 100000, isActive: true, sortOrder: 5 },
  { id: 's6', name: 'Lắp đặt camera', slug: 'lap-dat-camera', description: 'Thi công lắp đặt hệ thống camera giám sát cho gia đình, cửa hàng, văn phòng', icon: '📷', features: ['Tư vấn miễn phí', 'Thi công chuyên nghiệp', 'Bảo hành 12 tháng'], priceFrom: 3990000, isActive: true, sortOrder: 6 },
  { id: 's7', name: 'Thi công mạng nội bộ', slug: 'thi-cong-mang', description: 'Thiết kế và thi công hệ thống mạng LAN, WiFi cho văn phòng, quán cafe', icon: '🌐', features: ['Khảo sát miễn phí', 'Thiết kế mạng', 'Bảo hành 12 tháng'], priceFrom: 0, isActive: true, sortOrder: 7 },
  { id: 's8', name: 'Bảo trì máy tính văn phòng', slug: 'bao-tri-van-phong', description: 'Dịch vụ bảo trì định kỳ cho doanh nghiệp, đảm bảo hệ thống luôn ổn định', icon: '🛡️', features: ['Bảo trì định kỳ', 'Hỗ trợ từ xa', 'Ưu tiên xử lý'], priceFrom: 500000, isActive: true, sortOrder: 8 },
]

export async function seedServices() {
  console.log('🔧 Seeding services...')

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: { name: s.name, description: s.description, icon: s.icon, features: s.features, priceFrom: s.priceFrom ?? null, isActive: s.isActive, sortOrder: s.sortOrder },
      create: s,
    })
  }

  console.log(`✅ Seeded ${services.length} services`)
}
