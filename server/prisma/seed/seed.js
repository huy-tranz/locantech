"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const seedAdmin_1 = require("./seedAdmin");
const seedCategories_1 = require("./seedCategories");
const seedProducts_1 = require("./seedProducts");
const seedBanners_1 = require("./seedBanners");
const seedNews_1 = require("./seedNews");
const seedServices_1 = require("./seedServices");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🚀 Starting database seed...\n');
    // 1. Admin account
    await (0, seedAdmin_1.seedAdmin)();
    // 2. Categories (must come before products)
    const categoryMap = await (0, seedCategories_1.seedCategories)();
    // 3. Products (need category IDs)
    await (0, seedProducts_1.setCategoryMap)(categoryMap);
    await (0, seedProducts_1.seedProducts)();
    // 4. CMS content
    await (0, seedBanners_1.seedBanners)();
    await (0, seedNews_1.seedNews)();
    await (0, seedServices_1.seedServices)();
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Admin credentials:');
    console.log('   Email:    admin@locan.vn');
    console.log('   Password: Admin@LocAn2024!');
}
main()
    .catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
