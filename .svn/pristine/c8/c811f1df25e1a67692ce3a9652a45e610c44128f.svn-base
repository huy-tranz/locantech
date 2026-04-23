"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedBanners = seedBanners;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const banners = [
    { id: 'b1', title: 'PC Gaming Lộc An - Cấu hình mạnh, giá hợp lý', subtitle: 'Tư vấn build PC theo ngân sách, bảo hành 36 tháng', image: 'https://placehold.co/1200x400/1a1a2e/FFF?text=PC+Gaming', link: '/pc-gaming', position: 'HERO', sortOrder: 1, isActive: true },
    { id: 'b2', title: 'Laptop văn phòng từ 9.990.000đ', subtitle: 'Hàng chính hãng, bảo hành toàn quốc', image: 'https://placehold.co/1200x400/2563eb/FFF?text=Laptop', link: '/laptop', position: 'HERO', sortOrder: 2, isActive: true },
    { id: 'b3', title: 'Dịch vụ sửa chữa máy tính tận nơi', subtitle: 'Hotline: 0989386219 - Có mặt trong 60 phút', image: 'https://placehold.co/1200x400/dc2626/FFF?text=Sua+Chua', link: '/dich-vu', position: 'HERO', sortOrder: 3, isActive: true },
    { id: 'b4', title: 'Combo camera giám sát từ 3.990.000đ', subtitle: 'Lắp đặt miễn phí tại Hà Đông', image: 'https://placehold.co/600x300/059669/FFF?text=Camera', link: '/camera', position: 'SIDEBAR', sortOrder: 1, isActive: true },
    { id: 'b5', title: 'Nâng cấp SSD - Máy nhanh gấp 5 lần', subtitle: 'Chỉ từ 590.000đ bao gồm công lắp', image: 'https://placehold.co/600x300/7c3aed/FFF?text=SSD', link: '/dich-vu/nang-cap-ssd-ram', position: 'SIDEBAR', sortOrder: 2, isActive: true },
];
async function seedBanners() {
    console.log('🖼️ Seeding banners...');
    for (const b of banners) {
        await prisma.banner.upsert({
            where: { id: b.id },
            update: { title: b.title, subtitle: b.subtitle, image: b.image, link: b.link, position: b.position, sortOrder: b.sortOrder, isActive: b.isActive },
            create: b,
        });
    }
    console.log(`✅ Seeded ${banners.length} banners`);
}
