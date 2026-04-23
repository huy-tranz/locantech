import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface ProductData {
  id: string
  name: string
  slug: string
  sku: string
  categorySlug: string
  brand: string
  price: number
  originalPrice?: number
  discount?: number
  stock: number
  status: 'in_stock' | 'coming_soon' | 'out_of_stock'
  shortDesc: string
  tags: string[]
  featured: boolean
  bestSeller: boolean
  showOnHome: boolean
  specs?: Record<string, string>
}

const products: ProductData[] = [
  // LAPTOP
  { id: 'l1', name: 'Laptop Acer Aspire 5 A515-58M', slug: 'acer-aspire-5-a515', sku: 'LA-LT-001', categorySlug: 'laptop-van-phong', brand: 'Acer', price: 12990000, originalPrice: 14990000, discount: 13, stock: 15, status: 'in_stock', shortDesc: 'Intel Core i5-1335U, 8GB RAM, 512GB SSD, 15.6" FHD IPS', tags: ['bán chạy'], featured: true, bestSeller: true, showOnHome: true, specs: { CPU: 'Intel Core i5-1335U', RAM: '8GB DDR4', 'Ổ cứng': '512GB NVMe SSD', 'Màn hình': '15.6" FHD IPS' } },
  { id: 'l2', name: 'Laptop ASUS VivoBook 15 OLED', slug: 'asus-vivobook-15-oled', sku: 'LA-LT-002', categorySlug: 'laptop-van-phong', brand: 'ASUS', price: 15490000, originalPrice: 17490000, discount: 11, stock: 8, status: 'in_stock', shortDesc: 'Intel Core i7-1355U, 16GB RAM, 512GB SSD, OLED 15.6"', tags: ['mới'], featured: true, bestSeller: false, showOnHome: true },
  { id: 'l3', name: 'Laptop Lenovo IdeaPad Slim 3', slug: 'lenovo-ideapad-slim-3', sku: 'LA-LT-003', categorySlug: 'laptop', brand: 'Lenovo', price: 9990000, stock: 20, status: 'in_stock', shortDesc: 'AMD Ryzen 5 7520U, 8GB RAM, 256GB SSD, 15.6" FHD', tags: [], featured: false, bestSeller: true, showOnHome: true },
  { id: 'l4', name: 'Laptop HP Victus 15 Gaming', slug: 'hp-victus-15-gaming', sku: 'LA-LT-004', categorySlug: 'laptop-gaming', brand: 'HP', price: 18990000, originalPrice: 21990000, discount: 14, stock: 5, status: 'in_stock', shortDesc: 'Intel Core i5-13420H, RTX 3050, 8GB RAM, 512GB SSD', tags: ['giảm giá', 'bán chạy'], featured: true, bestSeller: true, showOnHome: true },
  { id: 'l5', name: 'Laptop MSI Katana 15 B13VFK', slug: 'msi-katana-15', sku: 'LA-LT-005', categorySlug: 'laptop-gaming', brand: 'MSI', price: 27990000, originalPrice: 29990000, discount: 7, stock: 3, status: 'in_stock', shortDesc: 'Intel Core i7-13620H, RTX 4060, 16GB RAM, 512GB SSD', tags: ['mới'], featured: true, bestSeller: false, showOnHome: true },
  { id: 'l6', name: 'Laptop Dell Latitude 5540', slug: 'dell-latitude-5540', sku: 'LA-LT-006', categorySlug: 'laptop-van-phong', brand: 'Dell', price: 22990000, stock: 4, status: 'in_stock', shortDesc: 'Intel Core i7-1365U, 16GB RAM, 512GB SSD, 15.6" FHD', tags: [], featured: false, bestSeller: false, showOnHome: true },
  { id: 'l7', name: 'MacBook Air M2 2024', slug: 'macbook-air-m2-2024', sku: 'LA-LT-007', categorySlug: 'laptop-apple', brand: 'Apple', price: 24990000, originalPrice: 27990000, discount: 11, stock: 6, status: 'in_stock', shortDesc: 'Apple M2, 8GB RAM, 256GB SSD, 13.6" Liquid Retina', tags: ['giảm giá'], featured: true, bestSeller: true, showOnHome: true },
  { id: 'l8', name: 'Laptop ASUS TUF Gaming F15', slug: 'asus-tuf-gaming-f15', sku: 'LA-LT-008', categorySlug: 'laptop-gaming', brand: 'ASUS', price: 21490000, originalPrice: 23990000, discount: 10, stock: 7, status: 'in_stock', shortDesc: 'Intel Core i5-12500H, RTX 4050, 8GB RAM, 512GB SSD', tags: ['bán chạy'], featured: false, bestSeller: true, showOnHome: true },
  { id: 'l9', name: 'Laptop HP ProBook 450 G10', slug: 'hp-probook-450', sku: 'LA-LT-009', categorySlug: 'laptop-van-phong', brand: 'HP', price: 16990000, stock: 10, status: 'in_stock', shortDesc: 'Intel Core i5-1335U, 8GB RAM, 512GB SSD, 15.6" FHD', tags: [], featured: false, bestSeller: false, showOnHome: true },
  { id: 'l10', name: 'Laptop Lenovo ThinkPad E16 Gen 1', slug: 'lenovo-thinkpad-e16', sku: 'LA-LT-010', categorySlug: 'laptop-do-hoa', brand: 'Lenovo', price: 19990000, originalPrice: 22490000, discount: 11, stock: 4, status: 'in_stock', shortDesc: 'Intel Core i7-1355U, 16GB RAM, 512GB SSD, 16" WUXGA', tags: ['mới'], featured: false, bestSeller: false, showOnHome: true },

  // PC
  { id: 'p1', name: 'PC Lộc An VP Core i3-12100', slug: 'pc-loc-an-vp-i3', sku: 'LA-PC-001', categorySlug: 'pc-van-phong', brand: 'Lộc An', price: 6990000, stock: 20, status: 'in_stock', shortDesc: 'Intel Core i3-12100, 8GB RAM, 256GB SSD', tags: ['bán chạy'], featured: true, bestSeller: true, showOnHome: true },
  { id: 'p2', name: 'PC Lộc An VP Core i5-12400', slug: 'pc-loc-an-vp-i5', sku: 'LA-PC-002', categorySlug: 'pc-van-phong', brand: 'Lộc An', price: 9490000, originalPrice: 10490000, discount: 10, stock: 15, status: 'in_stock', shortDesc: 'Intel Core i5-12400, 16GB RAM, 512GB SSD', tags: ['bán chạy'], featured: true, bestSeller: true, showOnHome: true },
  { id: 'p3', name: 'PC Lộc An VP Ryzen 5 5600G', slug: 'pc-loc-an-vp-r5', sku: 'LA-PC-003', categorySlug: 'pc-van-phong', brand: 'Lộc An', price: 7990000, stock: 12, status: 'in_stock', shortDesc: 'AMD Ryzen 5 5600G, 8GB RAM, 256GB SSD', tags: [], featured: false, bestSeller: false, showOnHome: true },
  { id: 'p4', name: 'PC Lộc An Đồ Họa i7-12700', slug: 'pc-loc-an-dh-i7', sku: 'LA-PC-004', categorySlug: 'pc-do-hoa', brand: 'Lộc An', price: 18990000, originalPrice: 20990000, discount: 10, stock: 5, status: 'in_stock', shortDesc: 'Intel Core i7-12700, RTX 3060 12GB, 32GB RAM, 1TB SSD', tags: ['mới'], featured: true, bestSeller: false, showOnHome: true },
  { id: 'p5', name: 'PC Lộc An Học Tập i3-10105', slug: 'pc-loc-an-ht-i3', sku: 'LA-PC-005', categorySlug: 'pc-hoc-tap', brand: 'Lộc An', price: 4990000, stock: 25, status: 'in_stock', shortDesc: 'Intel Core i3-10105, 4GB RAM, 128GB SSD', tags: [], featured: false, bestSeller: false, showOnHome: true },
  { id: 'p6', name: 'PC Lộc An VP Core i5-13400', slug: 'pc-loc-an-vp-i5-13', sku: 'LA-PC-006', categorySlug: 'pc-van-phong', brand: 'Lộc An', price: 11490000, originalPrice: 12990000, discount: 12, stock: 8, status: 'in_stock', shortDesc: 'Intel Core i5-13400, 16GB DDR5, 512GB SSD', tags: ['mới'], featured: false, bestSeller: false, showOnHome: true },
  { id: 'p7', name: 'PC Lộc An VP Ryzen 7 5700G', slug: 'pc-loc-an-vp-r7', sku: 'LA-PC-007', categorySlug: 'pc-van-phong', brand: 'Lộc An', price: 10990000, stock: 6, status: 'in_stock', shortDesc: 'AMD Ryzen 7 5700G, 16GB RAM, 512GB SSD', tags: [], featured: false, bestSeller: false, showOnHome: true },
  { id: 'p8', name: 'PC Lộc An Workstation i9-13900', slug: 'pc-loc-an-ws-i9', sku: 'LA-PC-008', categorySlug: 'pc-workstation', brand: 'Lộc An', price: 35990000, stock: 2, status: 'in_stock', shortDesc: 'Intel Core i9-13900, RTX 4070 12GB, 64GB DDR5, 2TB SSD', tags: ['mới'], featured: true, bestSeller: false, showOnHome: true },
  { id: 'p9', name: 'PC Lộc An Kế Toán i5-12400', slug: 'pc-loc-an-kt-i5', sku: 'LA-PC-009', categorySlug: 'pc-van-phong', brand: 'Lộc An', price: 8490000, stock: 10, status: 'in_stock', shortDesc: 'Intel Core i5-12400, 8GB RAM, 512GB SSD, Win 11 Pro', tags: [], featured: false, bestSeller: true, showOnHome: true },
  { id: 'p10', name: 'PC Lộc An Đồ Họa R7-5800X', slug: 'pc-loc-an-dh-r7', sku: 'LA-PC-010', categorySlug: 'pc-do-hoa', brand: 'Lộc An', price: 22990000, originalPrice: 24990000, discount: 8, stock: 3, status: 'in_stock', shortDesc: 'AMD Ryzen 7 5800X, RTX 3070 8GB, 32GB RAM, 1TB SSD', tags: ['giảm giá'], featured: false, bestSeller: false, showOnHome: true },

  // PC GAMING
  { id: 'g1', name: 'PC Gaming Lộc An Storm i5-12400F/RTX 3060', slug: 'pc-gaming-storm-i5-3060', sku: 'LA-PG-001', categorySlug: 'pc-gaming-pho-thong', brand: 'Lộc An', price: 14990000, originalPrice: 16990000, discount: 12, stock: 10, status: 'in_stock', shortDesc: 'Intel Core i5-12400F, RTX 3060 12GB, 16GB DDR4, 512GB SSD', tags: ['bán chạy', 'giảm giá'], featured: true, bestSeller: true, showOnHome: true },
  { id: 'g2', name: 'PC Gaming Lộc An Thunder i5-13400F/RTX 4060', slug: 'pc-gaming-thunder-i5-4060', sku: 'LA-PG-002', categorySlug: 'pc-gaming-tam-trung', brand: 'Lộc An', price: 19990000, originalPrice: 22490000, discount: 11, stock: 7, status: 'in_stock', shortDesc: 'Intel Core i5-13400F, RTX 4060 8GB, 16GB DDR5, 512GB SSD', tags: ['bán chạy'], featured: true, bestSeller: true, showOnHome: true },
  { id: 'g3', name: 'PC Gaming Lộc An Titan i7-13700F/RTX 4070', slug: 'pc-gaming-titan-i7-4070', sku: 'LA-PG-003', categorySlug: 'pc-gaming-cao-cap', brand: 'Lộc An', price: 29990000, originalPrice: 32990000, discount: 9, stock: 4, status: 'in_stock', shortDesc: 'Intel Core i7-13700F, RTX 4070 12GB, 32GB DDR5, 1TB SSD', tags: ['mới'], featured: true, bestSeller: false, showOnHome: true },
  { id: 'g4', name: 'PC Gaming Lộc An R5/RX 7600', slug: 'pc-gaming-r5-rx7600', sku: 'LA-PG-004', categorySlug: 'pc-gaming-pho-thong', brand: 'Lộc An', price: 13490000, stock: 8, status: 'in_stock', shortDesc: 'AMD Ryzen 5 5600, RX 7600 8GB, 16GB DDR4, 512GB SSD', tags: [], featured: false, bestSeller: false, showOnHome: true },
  { id: 'g5', name: 'PC Gaming Lộc An Ultra i7-14700F/RTX 4070 Ti', slug: 'pc-gaming-ultra-i7-4070ti', sku: 'LA-PG-005', categorySlug: 'pc-gaming-cao-cap', brand: 'Lộc An', price: 38990000, originalPrice: 42990000, discount: 9, stock: 2, status: 'in_stock', shortDesc: 'Intel Core i7-14700F, RTX 4070 Ti 12GB, 32GB DDR5, 1TB SSD', tags: ['mới'], featured: true, bestSeller: false, showOnHome: true },
  { id: 'g6', name: 'PC Gaming Lộc An Flash i5/RTX 4050', slug: 'pc-gaming-flash-i5-4050', sku: 'LA-PG-006', categorySlug: 'pc-gaming-pho-thong', brand: 'Lộc An', price: 15990000, stock: 6, status: 'in_stock', shortDesc: 'Intel Core i5-12400F, RTX 4050 6GB, 16GB DDR4, 512GB SSD', tags: [], featured: false, bestSeller: true, showOnHome: true },
  { id: 'g7', name: 'PC Gaming Lộc An Stream R7/RTX 4060', slug: 'pc-gaming-stream-r7-4060', sku: 'LA-PG-007', categorySlug: 'pc-livestream', brand: 'Lộc An', price: 23990000, originalPrice: 25990000, discount: 8, stock: 3, status: 'in_stock', shortDesc: 'AMD Ryzen 7 5800X3D, RTX 4060 8GB, 32GB DDR4, 1TB SSD', tags: ['giảm giá'], featured: false, bestSeller: false, showOnHome: true },
  { id: 'g8', name: 'PC Gaming Lộc An Bolt i5-13400F/RTX 3060', slug: 'pc-gaming-bolt-i5-3060', sku: 'LA-PG-008', categorySlug: 'pc-gaming-pho-thong', brand: 'Lộc An', price: 13990000, originalPrice: 15490000, discount: 10, stock: 12, status: 'in_stock', shortDesc: 'Intel Core i5-13400F, RTX 3060 12GB, 16GB DDR4, 512GB SSD', tags: ['bán chạy'], featured: false, bestSeller: true, showOnHome: true },
  { id: 'g9', name: 'PC Gaming Lộc An R5/RTX 4060 Ti', slug: 'pc-gaming-r5-4060ti', sku: 'LA-PG-009', categorySlug: 'pc-gaming-tam-trung', brand: 'Lộc An', price: 22490000, stock: 5, status: 'in_stock', shortDesc: 'AMD Ryzen 5 7600, RTX 4060 Ti 8GB, 16GB DDR5, 1TB SSD', tags: ['mới'], featured: false, bestSeller: false, showOnHome: true },
  { id: 'g10', name: 'PC Gaming Lộc An Supreme i9/RTX 4080', slug: 'pc-gaming-supreme-i9-4080', sku: 'LA-PG-010', categorySlug: 'pc-gaming-cao-cap', brand: 'Lộc An', price: 55990000, stock: 1, status: 'in_stock', shortDesc: 'Intel Core i9-14900K, RTX 4080 16GB, 64GB DDR5, 2TB SSD', tags: ['mới'], featured: true, bestSeller: false, showOnHome: true },

  // LINH KIEN
  { id: 'lk1', name: 'CPU Intel Core i5-12400F', slug: 'cpu-i5-12400f', sku: 'LA-LK-001', categorySlug: 'cpu', brand: 'Intel', price: 2990000, originalPrice: 3490000, discount: 14, stock: 30, status: 'in_stock', shortDesc: '6 nhân 12 luồng, 2.5GHz - 4.4GHz, Socket LGA 1700', tags: ['bán chạy'], featured: false, bestSeller: true, showOnHome: true },
  { id: 'lk2', name: 'RAM Kingston Fury Beast 16GB DDR4 3200MHz', slug: 'ram-kingston-fury-16gb', sku: 'LA-LK-002', categorySlug: 'ram', brand: 'Kingston', price: 890000, stock: 50, status: 'in_stock', shortDesc: '16GB DDR4, Bus 3200MHz, Heatsink', tags: ['bán chạy'], featured: false, bestSeller: true, showOnHome: true },
  { id: 'lk3', name: 'SSD Samsung 980 Pro 1TB NVMe M.2', slug: 'ssd-samsung-980-pro-1tb', sku: 'LA-LK-003', categorySlug: 'ssd', brand: 'Samsung', price: 2490000, originalPrice: 2990000, discount: 17, stock: 20, status: 'in_stock', shortDesc: '1TB, NVMe M.2 2280, Đọc 7000MB/s, Ghi 5000MB/s', tags: ['giảm giá'], featured: false, bestSeller: true, showOnHome: true },
  { id: 'lk4', name: 'VGA GIGABYTE RTX 4060 Eagle OC 8GB', slug: 'vga-rtx-4060-eagle-oc', sku: 'LA-LK-004', categorySlug: 'vga', brand: 'Gigabyte', price: 7990000, originalPrice: 8990000, discount: 11, stock: 8, status: 'in_stock', shortDesc: '8GB GDDR6, CUDA 3072, Boost Clock 2535MHz', tags: ['mới'], featured: true, bestSeller: false, showOnHome: true },
  { id: 'lk5', name: 'Mainboard ASUS PRIME B660M-A D4', slug: 'mainboard-asus-prime-b660m', sku: 'LA-LK-005', categorySlug: 'mainboard', brand: 'ASUS', price: 2490000, stock: 15, status: 'in_stock', shortDesc: 'Intel B660, LGA 1700, DDR4, M.2, mATX', tags: [], featured: false, bestSeller: false, showOnHome: true },
  { id: 'lk6', name: 'Nguồn Corsair CV650 650W 80+ Bronze', slug: 'nguon-corsair-cv650', sku: 'LA-LK-006', categorySlug: 'psu', brand: 'Corsair', price: 1290000, stock: 25, status: 'in_stock', shortDesc: '650W, 80+ Bronze, Non-modular', tags: ['bán chạy'], featured: false, bestSeller: true, showOnHome: true },
  { id: 'lk7', name: 'Case NZXT H5 Flow', slug: 'case-nzxt-h5-flow', sku: 'LA-LK-007', categorySlug: 'case', brand: 'NZXT', price: 2190000, stock: 10, status: 'in_stock', shortDesc: 'Mid Tower, ATX, Tempered Glass, Airflow', tags: ['mới'], featured: false, bestSeller: false, showOnHome: true },
  { id: 'lk8', name: 'Tản nhiệt DeepCool AK400', slug: 'tan-nhiet-deepcool-ak400', sku: 'LA-LK-008', categorySlug: 'tan-nhiet', brand: 'DeepCool', price: 590000, stock: 30, status: 'in_stock', shortDesc: 'Tower cooler, 4 ống đồng, TDP 220W, quạt 120mm', tags: ['bán chạy'], featured: false, bestSeller: true, showOnHome: true },
  { id: 'lk9', name: 'CPU AMD Ryzen 5 5600X', slug: 'cpu-r5-5600x', sku: 'LA-LK-009', categorySlug: 'cpu', brand: 'AMD', price: 3290000, originalPrice: 3890000, discount: 15, stock: 18, status: 'in_stock', shortDesc: '6 nhân 12 luồng, 3.7GHz - 4.6GHz, Socket AM4', tags: ['giảm giá'], featured: false, bestSeller: false, showOnHome: true },
  { id: 'lk10', name: 'RAM Corsair Vengeance 16GB DDR5 5600MHz', slug: 'ram-corsair-ddr5-16gb', sku: 'LA-LK-010', categorySlug: 'ram', brand: 'Corsair', price: 1390000, stock: 20, status: 'in_stock', shortDesc: '16GB DDR5, Bus 5600MHz', tags: ['mới'], featured: false, bestSeller: false, showOnHome: true },
  { id: 'lk11', name: 'HDD Seagate BarraCuda 2TB', slug: 'hdd-seagate-2tb', sku: 'LA-LK-011', categorySlug: 'hdd', brand: 'Seagate', price: 1190000, stock: 35, status: 'in_stock', shortDesc: '2TB, 7200RPM, SATA3, 256MB Cache', tags: [], featured: false, bestSeller: false, showOnHome: true },
  { id: 'lk12', name: 'VGA MSI RTX 4070 Ventus 2X OC 12GB', slug: 'vga-msi-rtx-4070', sku: 'LA-LK-012', categorySlug: 'vga', brand: 'MSI', price: 13990000, originalPrice: 15490000, discount: 10, stock: 4, status: 'in_stock', shortDesc: '12GB GDDR6X, CUDA 5888, Boost Clock 2475MHz', tags: ['giảm giá'], featured: true, bestSeller: false, showOnHome: true },

  // THIET BI MANG
  { id: 'm1', name: 'Router WiFi 6 TP-Link AX1500', slug: 'router-tplink-ax1500', sku: 'LA-TBM-001', categorySlug: 'router-wifi', brand: 'TP-Link', price: 890000, originalPrice: 1090000, discount: 18, stock: 20, status: 'in_stock', shortDesc: 'WiFi 6 AX1500, 4 ăng-ten, Gigabit', tags: ['bán chạy', 'giảm giá'], featured: false, bestSeller: true, showOnHome: true },
  { id: 'm2', name: 'Mesh WiFi TP-Link Deco M4 (3-pack)', slug: 'mesh-tplink-deco-m4', sku: 'LA-TBM-002', categorySlug: 'mesh-wifi', brand: 'TP-Link', price: 2490000, stock: 10, status: 'in_stock', shortDesc: 'Mesh WiFi AC1200, phủ 370m², 3 bộ', tags: [], featured: false, bestSeller: false, showOnHome: true },
  { id: 'm3', name: 'Switch TP-Link TL-SG108E 8 Port Gigabit', slug: 'switch-tplink-sg108e', sku: 'LA-TBM-003', categorySlug: 'switch', brand: 'TP-Link', price: 590000, stock: 25, status: 'in_stock', shortDesc: '8 Port Gigabit, Managed, VLAN', tags: [], featured: false, bestSeller: false, showOnHome: true },
  { id: 'm4', name: 'Router ASUS RT-AX1800S WiFi 6', slug: 'router-asus-rt-ax1800s', sku: 'LA-TBM-004', categorySlug: 'router-wifi', brand: 'ASUS', price: 1090000, originalPrice: 1290000, discount: 15, stock: 15, status: 'in_stock', shortDesc: 'WiFi 6 AX1800, 4 ăng-ten, AiProtection', tags: ['giảm giá'], featured: false, bestSeller: false, showOnHome: true },

  // CAMERA
  { id: 'c1', name: 'Camera IP Yoosee 3MP Full HD', slug: 'camera-yoosee-3mp', sku: 'LA-CAM-001', categorySlug: 'camera-ip', brand: 'Yoosee', price: 690000, originalPrice: 890000, discount: 22, stock: 30, status: 'in_stock', shortDesc: '3MP, Full HD 1080p, Hồng ngoại 20m, Xoay 360°', tags: ['bán chạy', 'giảm giá'], featured: false, bestSeller: true, showOnHome: true },
  { id: 'c2', name: 'Camera Hikvision DS-2CD1043G2-I 4MP', slug: 'camera-hikvision-4mp', sku: 'LA-CAM-002', categorySlug: 'camera-ngoai-troi', brand: 'Hikvision', price: 1290000, stock: 20, status: 'in_stock', shortDesc: '4MP, IP67, Hồng ngoại 30m, SOEM', tags: [], featured: false, bestSeller: false, showOnHome: true },
  { id: 'c3', name: 'Camera IMOU Ranger 2 3MP', slug: 'camera-imou-ranger-2', sku: 'LA-CAM-003', categorySlug: 'camera-trong-nha', brand: 'IMOU', price: 890000, originalPrice: 1090000, discount: 18, stock: 15, status: 'in_stock', shortDesc: '3MP, Xoay nghiêng, Theo dõi chuyển động', tags: ['giảm giá'], featured: false, bestSeller: false, showOnHome: true },

  // NGOAI VI
  { id: 'nv1', name: 'Bàn phím cơ AKKO 3098B Plus', slug: 'ban-phim-akko-3098b', sku: 'LA-NV-001', categorySlug: 'ban-phim', brand: 'AKKO', price: 1590000, originalPrice: 1890000, discount: 16, stock: 20, status: 'in_stock', shortDesc: 'Akko CS Lavender Purple, 98 phím, Wireless', tags: ['bán chạy', 'giảm giá'], featured: false, bestSeller: true, showOnHome: true },
  { id: 'nv2', name: 'Chuột gaming Logitech G502 HERO', slug: 'chuot-logitech-g502-hero', sku: 'LA-NV-002', categorySlug: 'chuot', brand: 'Logitech', price: 1290000, stock: 25, status: 'in_stock', shortDesc: 'HERO 25K sensor, 11 nút có thể lập trình', tags: ['bán chạy'], featured: false, bestSeller: true, showOnHome: true },
  { id: 'nv3', name: 'Tai nghe HyperX Cloud II', slug: 'tai-nghe-hyperx-cloud-ii', sku: 'LA-NV-003', categorySlug: 'tai-nghe', brand: 'HyperX', price: 1990000, originalPrice: 2490000, discount: 20, stock: 12, status: 'in_stock', shortDesc: '7.1 Surround, Mic có thể tháo, Memory foam', tags: ['giảm giá'], featured: false, bestSeller: false, showOnHome: true },
  { id: 'nv4', name: 'Bàn phím Corsair K70 RGB MK.2', slug: 'ban-phim-corsair-k70', sku: 'LA-NV-004', categorySlug: 'ban-phim', brand: 'Corsair', price: 3990000, stock: 8, status: 'in_stock', shortDesc: 'Cherry MX Red, RGB per-key, USB passthrough', tags: ['mới'], featured: false, bestSeller: false, showOnHome: true },
  { id: 'nv5', name: 'Chuột Razer DeathAdder V3', slug: 'chuot-razer-deathadder-v3', sku: 'LA-NV-005', categorySlug: 'chuot', brand: 'Razer', price: 1890000, stock: 10, status: 'in_stock', shortDesc: 'Focus Pro 30K sensor, 59g, Wireless', tags: ['mới'], featured: false, bestSeller: false, showOnHome: true },
  { id: 'nv6', name: 'Tai nghe SteelSeries Arctis 7+', slug: 'tai-nghe-steelseries-arctis-7', sku: 'LA-NV-006', categorySlug: 'tai-nghe', brand: 'SteelSeries', price: 3990000, originalPrice: 4490000, discount: 11, stock: 6, status: 'in_stock', shortDesc: 'Wireless 2.4GHz, 32h pin, ChatMix dial', tags: ['giảm giá'], featured: false, bestSeller: false, showOnHome: true },

  // MAN HINH
  { id: 'mh1', name: 'Màn hình LG 27GP850-B 27" 2K 180Hz', slug: 'man-hinh-lg-27gp850', sku: 'LA-MH-001', categorySlug: 'man-hinh-gaming', brand: 'LG', price: 8990000, originalPrice: 9990000, discount: 10, stock: 8, status: 'in_stock', shortDesc: '27" Nano IPS, 2K, 180Hz, 1ms, G-Sync Compatible', tags: ['bán chạy'], featured: true, bestSeller: true, showOnHome: true },
  { id: 'mh2', name: 'Màn hình Dell P2422H 24" FHD IPS', slug: 'man-hinh-dell-p2422h', sku: 'LA-MH-002', categorySlug: 'man-hinh-van-phong', brand: 'Dell', price: 4990000, stock: 15, status: 'in_stock', shortDesc: '24" IPS, FHD 60Hz, USB Hub, Chân xoay', tags: [], featured: false, bestSeller: false, showOnHome: true },
  { id: 'mh3', name: 'Màn hình Samsung Odyssey G7 32" 2K 240Hz', slug: 'man-hinh-samsung-odyssey-g7', sku: 'LA-MH-003', categorySlug: 'man-hinh-gaming', brand: 'Samsung', price: 15990000, originalPrice: 17990000, discount: 11, stock: 3, status: 'in_stock', shortDesc: '32" VA Curved 1000R, 2K, 240Hz, 1ms', tags: ['mới'], featured: true, bestSeller: false, showOnHome: true },
  { id: 'mh4', name: 'Màn hình ViewSonic VX2776-2K 27" 2K IPS', slug: 'man-hinh-viewsonic-vx2776', sku: 'LA-MH-004', categorySlug: 'man-hinh-van-phong', brand: 'ViewSonic', price: 5490000, stock: 10, status: 'in_stock', shortDesc: '27" IPS, 2K, 75Hz, Viền mỏng', tags: [], featured: false, bestSeller: false, showOnHome: true },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const categorySlugToId: Record<string, any> = {}

export async function setCategoryMap(slugToId: Record<string, string>) {
  // Copy the slugToId map for product seeding
  for (const [slug, id] of Object.entries(slugToId)) {
    categorySlugToId[slug] = id
  }
}

export async function seedProducts() {
  console.log('📦 Seeding products...')

  let seeded = 0
  for (const p of products) {
    const categoryId = categorySlugToId[p.categorySlug] || null

    const productData = {
      sku: p.sku,
      name: p.name,
      slug: p.slug,
      brand: p.brand,
      price: p.price,
      comparePrice: p.originalPrice ?? null,
      quantity: p.stock,
      shortDesc: p.shortDesc,
      tags: p.tags,
      status: 'PUBLISHED' as const,
      isFeatured: p.featured,
      isBestSeller: p.bestSeller,
      specifications: p.specs ?? undefined,
      images: [],
      categoryId,
    }

    await prisma.product.upsert({
      where: { sku: p.sku },
      update: productData,
      create: { id: p.id, ...productData },
    })

    seeded++
  }

  console.log(`✅ Seeded ${seeded} products`)
}
