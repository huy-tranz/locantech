import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface NewsData {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  image?: string
  author: string
  tags: string[]
  isPublished: boolean
  publishedAt: Date
}

const news: NewsData[] = [
  {
    id: 'n1',
    title: 'Hướng dẫn chọn laptop văn phòng 2025 phù hợp ngân sách',
    slug: 'huong-dan-chon-laptop-van-phong-2025',
    excerpt: 'Bạn đang tìm laptop văn phòng giá tốt? Lộc An tổng hợp tiêu chí chọn laptop phù hợp với công việc và ngân sách của bạn.',
    content: '<p>Nội dung bài viết đang được cập nhật...</p>',
    image: 'https://placehold.co/800x400/1e40af/FFF?text=Laptop+Guide',
    author: 'Lộc An Tech',
    tags: ['Tư vấn', 'Laptop'],
    isPublished: true,
    publishedAt: new Date('2025-03-15'),
  },
  {
    id: 'n2',
    title: 'Build PC Gaming 15 triệu chơi mượt mọi tựa game 2025',
    slug: 'build-pc-gaming-15-trieu',
    excerpt: 'Với 15 triệu, bạn hoàn toàn có thể sở hữu một bộ PC Gaming mạnh mẽ. Xem cấu hình gợi ý từ Lộc An.',
    content: '<p>Nội dung bài viết đang được cập nhật...</p>',
    image: 'https://placehold.co/800x400/7c3aed/FFF?text=Build+PC',
    author: 'Lộc An Tech',
    tags: ['Tư vấn', 'PC Gaming'],
    isPublished: true,
    publishedAt: new Date('2025-03-10'),
  },
  {
    id: 'n3',
    title: 'Khi nào cần vệ sinh máy tính? Dấu hiệu và cách xử lý',
    slug: 'khi-nao-can-ve-sinh-may-tinh',
    excerpt: 'Máy tính chạy chậm, nóng bất thường? Có thể đã đến lúc vệ sinh. Lộc An chia sẻ dấu hiệu cần chú ý.',
    content: '<p>Nội dung bài viết đang được cập nhật...</p>',
    image: 'https://placehold.co/800x400/059669/FFF?text=Maintenance',
    author: 'Lộc An Tech',
    tags: ['Kinh nghiệm'],
    isPublished: true,
    publishedAt: new Date('2025-03-05'),
  },
  {
    id: 'n4',
    title: 'So sánh SSD NVMe và SATA: Nên chọn loại nào?',
    slug: 'so-sanh-ssd-nvme-sata',
    excerpt: 'Tìm hiểu sự khác biệt giữa SSD NVMe và SATA để chọn ổ cứng phù hợp với nhu cầu sử dụng.',
    content: '<p>Nội dung bài viết đang được cập nhật...</p>',
    image: 'https://placehold.co/800x400/dc2626/FFF?text=SSD+vs+SATA',
    author: 'Lộc An Tech',
    tags: ['Kiến thức'],
    isPublished: true,
    publishedAt: new Date('2025-02-28'),
  },
  {
    id: 'n5',
    title: 'Hướng dẫn lắp đặt camera giám sát tại nhà đơn giản',
    slug: 'huong-dan-lap-camera-tai-nha',
    excerpt: 'Lộc An hướng dẫn chi tiết các bước lắp đặt camera giám sát tại nhà, phù hợp cho người mới bắt đầu.',
    content: '<p>Nội dung bài viết đang được cập nhật...</p>',
    image: 'https://placehold.co/800x400/1e40af/FFF?text=Camera+Setup',
    author: 'Lộc An Tech',
    tags: ['Hướng dẫn', 'Camera'],
    isPublished: true,
    publishedAt: new Date('2025-02-20'),
  },
  {
    id: 'n6',
    title: 'Top 5 router WiFi 6 giá tốt nhất cho gia đình năm 2025',
    slug: 'top-5-router-wifi-6-gia-tot',
    excerpt: 'Danh sách 5 router WiFi 6 đáng mua nhất với mức giá hợp lý, phủ sóng tốt cho căn hộ và nhà phố.',
    content: '<p>Nội dung bài viết đang được cập nhật...</p>',
    image: 'https://placehold.co/800x400/7c3aed/FFF?text=WiFi+6',
    author: 'Lộc An Tech',
    tags: ['Tư vấn', 'WiFi'],
    isPublished: true,
    publishedAt: new Date('2025-02-15'),
  },
]

export async function seedNews() {
  console.log('📰 Seeding news...')

  for (const n of news) {
    await prisma.news.upsert({
      where: { slug: n.slug },
      update: { title: n.title, excerpt: n.excerpt, content: n.content, image: n.image, tags: n.tags, isPublished: n.isPublished, publishedAt: n.publishedAt },
      create: n,
    })
  }

  console.log(`✅ Seeded ${news.length} news articles`)
}
