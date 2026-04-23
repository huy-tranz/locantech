"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCategories = seedCategories;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const categories = [
    // Root categories
    { id: 'laptop', name: 'Laptop', slug: 'laptop', sortOrder: 1 },
    { id: 'pc', name: 'PC đồng bộ', slug: 'pc', sortOrder: 2 },
    { id: 'pc-gaming', name: 'PC Gaming', slug: 'pc-gaming', sortOrder: 3 },
    { id: 'linh-kien', name: 'Linh kiện', slug: 'linh-kien', sortOrder: 4 },
    { id: 'man-hinh', name: 'Màn hình', slug: 'man-hinh', sortOrder: 5 },
    { id: 'thiet-bi-mang', name: 'Thiết bị mạng', slug: 'thiet-bi-mang', sortOrder: 6 },
    { id: 'camera', name: 'Camera', slug: 'camera', sortOrder: 7 },
    { id: 'ngoai-vi', name: 'Ngoại vi', slug: 'ngoai-vi', sortOrder: 8 },
    { id: 'dich-vu', name: 'Dịch vụ', slug: 'dich-vu', sortOrder: 9 },
    // Laptop children
    { id: 'laptop-theo-nhu-cau', name: 'Theo nhu cầu', slug: 'laptop-theo-nhu-cau', parentSlug: 'laptop', sortOrder: 1 },
    { id: 'laptop-van-phong', name: 'Văn phòng', slug: 'laptop-van-phong', parentSlug: 'laptop-theo-nhu-cau', sortOrder: 1 },
    { id: 'laptop-gaming', name: 'Gaming', slug: 'laptop-gaming', parentSlug: 'laptop-theo-nhu-cau', sortOrder: 2 },
    { id: 'laptop-do-hoa', name: 'Đồ họa', slug: 'laptop-do-hoa', parentSlug: 'laptop-theo-nhu-cau', sortOrder: 3 },
    { id: 'laptop-mong-nhe', name: 'Mỏng nhẹ', slug: 'laptop-mong-nhe', parentSlug: 'laptop-theo-nhu-cau', sortOrder: 4 },
    { id: 'laptop-theo-hang', name: 'Theo hãng', slug: 'laptop-theo-hang', parentSlug: 'laptop', sortOrder: 2 },
    { id: 'laptop-apple', name: 'Apple', slug: 'laptop-apple', parentSlug: 'laptop-theo-hang', sortOrder: 1 },
    { id: 'laptop-dell', name: 'Dell', slug: 'laptop-dell', parentSlug: 'laptop-theo-hang', sortOrder: 2 },
    { id: 'laptop-hp', name: 'HP', slug: 'laptop-hp', parentSlug: 'laptop-theo-hang', sortOrder: 3 },
    { id: 'laptop-asus', name: 'ASUS', slug: 'laptop-asus', parentSlug: 'laptop-theo-hang', sortOrder: 4 },
    { id: 'laptop-theo-gia', name: 'Theo giá', slug: 'laptop-theo-gia', parentSlug: 'laptop', sortOrder: 3 },
    { id: 'laptop-duoi-10-trieu', name: 'Dưới 10 triệu', slug: 'laptop-duoi-10-trieu', parentSlug: 'laptop-theo-gia', sortOrder: 1 },
    { id: 'laptop-10-20-trieu', name: '10 - 20 triệu', slug: 'laptop-10-20-trieu', parentSlug: 'laptop-theo-gia', sortOrder: 2 },
    { id: 'laptop-tren-20-trieu', name: 'Trên 20 triệu', slug: 'laptop-tren-20-trieu', parentSlug: 'laptop-theo-gia', sortOrder: 3 },
    // PC children
    { id: 'pc-theo-nhu-cau', name: 'Theo nhu cầu', slug: 'pc-theo-nhu-cau', parentSlug: 'pc', sortOrder: 1 },
    { id: 'pc-van-phong', name: 'Văn phòng', slug: 'pc-van-phong', parentSlug: 'pc-theo-nhu-cau', sortOrder: 1 },
    { id: 'pc-gaming', name: 'Gaming', slug: 'pc-gaming', parentSlug: 'pc-theo-nhu-cau', sortOrder: 2 },
    { id: 'pc-do-hoa', name: 'Đồ họa', slug: 'pc-do-hoa', parentSlug: 'pc-theo-nhu-cau', sortOrder: 3 },
    { id: 'pc-hoc-tap', name: 'Học tập', slug: 'pc-hoc-tap', parentSlug: 'pc-theo-nhu-cau', sortOrder: 4 },
    { id: 'pc-workstation', name: 'Workstation', slug: 'pc-workstation', parentSlug: 'pc', sortOrder: 2 },
    // PC Gaming children
    { id: 'pc-gaming-pho-thong', name: 'Phổ thông', slug: 'pc-gaming-pho-thong', parentSlug: 'pc-gaming', sortOrder: 1 },
    { id: 'pc-gaming-tam-trung', name: 'Tầm trung', slug: 'pc-gaming-tam-trung', parentSlug: 'pc-gaming', sortOrder: 2 },
    { id: 'pc-gaming-cao-cap', name: 'Cao cấp', slug: 'pc-gaming-cao-cap', parentSlug: 'pc-gaming', sortOrder: 3 },
    { id: 'livestream', name: 'Livestream', slug: 'pc-livestream', parentSlug: 'pc-gaming', sortOrder: 4 },
    // Linh kiện children
    { id: 'cpu', name: 'CPU - Bộ vi xử lý', slug: 'cpu', parentSlug: 'linh-kien', sortOrder: 1 },
    { id: 'ram', name: 'RAM', slug: 'ram', parentSlug: 'linh-kien', sortOrder: 2 },
    { id: 'ssd', name: 'SSD', slug: 'ssd', parentSlug: 'linh-kien', sortOrder: 3 },
    { id: 'hdd', name: 'HDD', slug: 'hdd', parentSlug: 'linh-kien', sortOrder: 4 },
    { id: 'vga', name: 'VGA - Card màn hình', slug: 'vga', parentSlug: 'linh-kien', sortOrder: 5 },
    { id: 'mainboard', name: 'Mainboard', slug: 'mainboard', parentSlug: 'linh-kien', sortOrder: 6 },
    { id: 'psu', name: 'Nguồn máy tính', slug: 'psu', parentSlug: 'linh-kien', sortOrder: 7 },
    { id: 'case', name: 'Case máy tính', slug: 'case', parentSlug: 'linh-kien', sortOrder: 8 },
    { id: 'tan-nhiet', name: 'Tản nhiệt', slug: 'tan-nhiet', parentSlug: 'linh-kien', sortOrder: 9 },
    // Màn hình children
    { id: 'man-hinh-van-phong', name: 'Văn phòng', slug: 'man-hinh-van-phong', parentSlug: 'man-hinh', sortOrder: 1 },
    { id: 'man-hinh-gaming', name: 'Gaming', slug: 'man-hinh-gaming', parentSlug: 'man-hinh', sortOrder: 2 },
    { id: 'man-hinh-do-hoa', name: 'Đồ họa', slug: 'man-hinh-do-hoa', parentSlug: 'man-hinh', sortOrder: 3 },
    // Thiết bị mạng children
    { id: 'router-wifi', name: 'Router WiFi', slug: 'router-wifi', parentSlug: 'thiet-bi-mang', sortOrder: 1 },
    { id: 'mesh-wifi', name: 'Mesh WiFi', slug: 'mesh-wifi', parentSlug: 'thiet-bi-mang', sortOrder: 2 },
    { id: 'switch', name: 'Switch', slug: 'switch', parentSlug: 'thiet-bi-mang', sortOrder: 3 },
    // Camera children
    { id: 'camera-trong-nha', name: 'Trong nhà', slug: 'camera-trong-nha', parentSlug: 'camera', sortOrder: 1 },
    { id: 'camera-ngoai-troi', name: 'Ngoài trời', slug: 'camera-ngoai-troi', parentSlug: 'camera', sortOrder: 2 },
    { id: 'camera-ip', name: 'Camera IP', slug: 'camera-ip', parentSlug: 'camera', sortOrder: 3 },
    // Ngoại vi children
    { id: 'ban-phim', name: 'Bàn phím', slug: 'ban-phim', parentSlug: 'ngoai-vi', sortOrder: 1 },
    { id: 'chuot', name: 'Chuột', slug: 'chuot', parentSlug: 'ngoai-vi', sortOrder: 2 },
    { id: 'tai-nghe', name: 'Tai nghe', slug: 'tai-nghe', parentSlug: 'ngoai-vi', sortOrder: 3 },
    { id: 'loa', name: 'Loa', slug: 'loa', parentSlug: 'ngoai-vi', sortOrder: 4 },
];
async function seedCategories() {
    console.log('📂 Seeding categories...');
    const slugToId = {};
    // First pass: create all categories without parentId
    for (const cat of categories) {
        if (!cat.parentSlug) {
            const created = await prisma.category.upsert({
                where: { slug: cat.slug },
                update: { name: cat.name, sortOrder: cat.sortOrder },
                create: { id: cat.id, name: cat.name, slug: cat.slug, sortOrder: cat.sortOrder },
            });
            slugToId[cat.slug] = created.id;
        }
    }
    // Second pass: create children with parentId
    for (const cat of categories) {
        if (cat.parentSlug && slugToId[cat.parentSlug]) {
            await prisma.category.upsert({
                where: { slug: cat.slug },
                update: { name: cat.name, sortOrder: cat.sortOrder, parentId: slugToId[cat.parentSlug] },
                create: {
                    id: cat.id,
                    name: cat.name,
                    slug: cat.slug,
                    sortOrder: cat.sortOrder,
                    parentId: slugToId[cat.parentSlug],
                },
            });
            slugToId[cat.slug] = cat.id;
        }
    }
    console.log(`✅ Seeded ${categories.length} categories`);
    return slugToId;
}
