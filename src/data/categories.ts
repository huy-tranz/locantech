import { Laptop, Monitor, Cpu, Wifi, Camera, Wrench, Keyboard, Gamepad2, HardDrive } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: LucideIcon;
  badge?: string; // "Mới" | "Hot" | "Sale"
  children?: Category[];
}

const defaultCategories: Category[] = [
  {
    id: "laptop",
    name: "Laptop",
    slug: "laptop",
    icon: Laptop,
    children: [
      {
        id: "laptop-theo-nhu-cau",
        name: "Theo nhu cầu",
        slug: "laptop-theo-nhu-cau",
        children: [
          { id: "laptop-van-phong", name: "Văn phòng", slug: "laptop-van-phong" },
          { id: "laptop-gaming", name: "Gaming", slug: "laptop-gaming" },
          { id: "laptop-do-hoa", name: "Đồ họa / Sáng tạo", slug: "laptop-do-hoa" },
          { id: "laptop-mong-nhe", name: "Mỏng nhẹ (Ultrabook)", slug: "laptop-mong-nhe" },
          { id: "laptop-sinh-vien", name: "Sinh viên", slug: "laptop-sinh-vien" },
        ],
      },
      {
        id: "laptop-theo-hang",
        name: "Theo hãng",
        slug: "laptop-theo-hang",
        children: [
          { id: "laptop-apple", name: "Apple (MacBook)", slug: "laptop-apple" },
          { id: "laptop-dell", name: "Dell", slug: "laptop-dell" },
          { id: "laptop-hp", name: "HP", slug: "laptop-hp" },
          { id: "laptop-asus", name: "ASUS", slug: "laptop-asus" },
          { id: "laptop-lenovo", name: "Lenovo", slug: "laptop-lenovo" },
          { id: "laptop-acer", name: "Acer", slug: "laptop-acer" },
          { id: "laptop-msi", name: "MSI", slug: "laptop-msi" },
          { id: "laptop-gigabyte", name: "Gigabyte / AORUS", slug: "laptop-gigabyte" },
        ],
      },
      {
        id: "laptop-theo-gia",
        name: "Theo giá",
        slug: "laptop-theo-gia",
        children: [
          { id: "laptop-duoi-10-trieu", name: "Dưới 10 triệu", slug: "laptop-duoi-10-trieu" },
          { id: "laptop-10-15-trieu", name: "10 – 15 triệu", slug: "laptop-10-15-trieu" },
          { id: "laptop-15-20-trieu", name: "15 – 20 triệu", slug: "laptop-15-20-trieu" },
          { id: "laptop-tren-20-trieu", name: "Trên 20 triệu", slug: "laptop-tren-20-trieu" },
        ],
      },
    ],
  },

  {
    id: "pc",
    name: "PC đồng bộ",
    slug: "pc",
    icon: Monitor,
    children: [
      {
        id: "pc-theo-nhu-cau",
        name: "Theo nhu cầu",
        slug: "pc-theo-nhu-cau",
        children: [
          { id: "pc-van-phong", name: "Văn phòng", slug: "pc-van-phong" },
          { id: "pc-hoc-tap", name: "Học tập", slug: "pc-hoc-tap" },
          { id: "pc-doanh-nghiep", name: "Doanh nghiệp", slug: "pc-doanh-nghiep" },
          { id: "pc-mini", name: "Mini PC", slug: "pc-mini" },
        ],
      },
      {
        id: "pc-theo-thuong-hieu",
        name: "Theo thương hiệu",
        slug: "pc-theo-thuong-hieu",
        children: [
          { id: "pc-dell", name: "Dell", slug: "pc-dell" },
          { id: "pc-hp", name: "HP", slug: "pc-hp" },
          { id: "pc-lenovo", name: "Lenovo", slug: "pc-lenovo" },
          { id: "pc-acer", name: "Acer", slug: "pc-acer" },
        ],
      },
      {
        id: "pc-theo-gia",
        name: "Theo giá",
        slug: "pc-theo-gia",
        children: [
          { id: "pc-duoi-10-trieu", name: "Dưới 10 triệu", slug: "pc-duoi-10-trieu" },
          { id: "pc-10-20-trieu", name: "10 – 20 triệu", slug: "pc-10-20-trieu" },
          { id: "pc-tren-20-trieu", name: "Trên 20 triệu", slug: "pc-tren-20-trieu" },
        ],
      },
    ],
  },

  {
    id: "pc-gaming",
    name: "PC Gaming",
    slug: "pc-gaming",
    icon: Gamepad2,
    badge: "Hot",
    children: [
      {
        id: "pc-gaming-theo-gia",
        name: "Theo tầm giá",
        slug: "pc-gaming-theo-gia",
        children: [
          { id: "pc-gaming-duoi-15", name: "Dưới 15 triệu (FHD)", slug: "pc-gaming-duoi-15-trieu" },
          { id: "pc-gaming-15-25", name: "15 – 25 triệu (2K)", slug: "pc-gaming-15-25-trieu" },
          { id: "pc-gaming-25-40", name: "25 – 40 triệu (4K)", slug: "pc-gaming-25-40-trieu" },
          { id: "pc-gaming-tren-40", name: "Trên 40 triệu (Extreme)", slug: "pc-gaming-tren-40-trieu" },
        ],
      },
      {
        id: "pc-gaming-theo-nhu-cau",
        name: "Theo nhu cầu",
        slug: "pc-gaming-theo-nhu-cau",
        children: [
          { id: "pc-gaming-pho-thong", name: "Gaming phổ thông", slug: "pc-gaming-pho-thong" },
          { id: "pc-esports", name: "eSports cạnh tranh", slug: "pc-esports" },
          { id: "pc-streaming", name: "Streaming + Content", slug: "pc-streaming" },
          { id: "pc-gaming-do-hoa", name: "Gaming + Đồ họa", slug: "pc-gaming-do-hoa" },
        ],
      },
      {
        id: "pc-gaming-thuong-hieu",
        name: "Thương hiệu nổi bật",
        slug: "pc-gaming-thuong-hieu",
        children: [
          { id: "pc-asus-rog", name: "ASUS ROG / TUF", slug: "pc-asus-rog" },
          { id: "pc-msi-gaming", name: "MSI Gaming", slug: "pc-msi-gaming" },
          { id: "pc-acer-predator", name: "Acer Predator", slug: "pc-acer-predator" },
        ],
      },
    ],
  },

  {
    id: "linh-kien",
    name: "Linh kiện máy tính",
    slug: "linh-kien",
    icon: Cpu,
    children: [
      {
        id: "cpu",
        name: "CPU (Bộ vi xử lý)",
        slug: "cpu",
        children: [
          { id: "cpu-intel-i3-i5", name: "Intel Core i3 / i5", slug: "cpu-intel-i3-i5" },
          { id: "cpu-intel-i7-i9", name: "Intel Core i7 / i9", slug: "cpu-intel-i7-i9" },
          { id: "cpu-amd-ryzen-5-7", name: "AMD Ryzen 5 / 7", slug: "cpu-amd-ryzen-5-7" },
          { id: "cpu-amd-ryzen-9", name: "AMD Ryzen 9 / Threadripper", slug: "cpu-amd-ryzen-9" },
        ],
      },
      {
        id: "mainboard",
        name: "Mainboard (Bo mạch chủ)",
        slug: "mainboard",
        children: [
          { id: "main-intel", name: "Main Intel (LGA 1700 / 1851)", slug: "mainboard-intel" },
          { id: "main-amd", name: "Main AMD (AM4 / AM5)", slug: "mainboard-amd" },
          { id: "main-itx", name: "Mini-ITX", slug: "mainboard-mini-itx" },
        ],
      },
      {
        id: "ram",
        name: "RAM",
        slug: "ram",
        children: [
          { id: "ram-ddr4", name: "DDR4 Desktop", slug: "ram-ddr4" },
          { id: "ram-ddr5", name: "DDR5 Desktop", slug: "ram-ddr5" },
          { id: "ram-laptop", name: "RAM Laptop (SO-DIMM)", slug: "ram-laptop" },
        ],
      },
      {
        id: "vga",
        name: "VGA (Card đồ họa)",
        slug: "card-do-hoa-vga",
        badge: "Hot",
        children: [
          { id: "vga-nvidia-rtx40", name: "NVIDIA RTX 40-series", slug: "vga-nvidia-rtx40" },
          { id: "vga-nvidia-rtx30", name: "NVIDIA RTX 30-series", slug: "vga-nvidia-rtx30" },
          { id: "vga-amd-radeon", name: "AMD Radeon RX 7000", slug: "vga-amd-radeon" },
          { id: "vga-theo-gia", name: "VGA theo tầm giá", slug: "vga-theo-gia" },
        ],
      },
      {
        id: "ssd",
        name: "SSD",
        slug: "ssd",
        children: [
          { id: "ssd-nvme-m2", name: "SSD NVMe M.2 (PCIe 4.0 / 5.0)", slug: "ssd-nvme-m2" },
          { id: "ssd-sata", name: "SSD SATA 2.5\"", slug: "ssd-sata" },
          { id: "ssd-portable", name: "SSD Portable / Di động", slug: "ssd-portable" },
        ],
      },
      {
        id: "hdd",
        name: "HDD",
        slug: "hdd",
        children: [
          { id: "hdd-desktop", name: "HDD Desktop 3.5\"", slug: "hdd-desktop" },
          { id: "hdd-laptop", name: "HDD Laptop 2.5\"", slug: "hdd-laptop" },
          { id: "hdd-nas", name: "HDD NAS / Surveillance", slug: "hdd-nas" },
        ],
      },
      {
        id: "psu",
        name: "Nguồn (PSU)",
        slug: "nguon-psu",
        children: [
          { id: "psu-500-650w", name: "500W – 650W (80+ Bronze)", slug: "psu-500-650w" },
          { id: "psu-750-850w", name: "750W – 850W (80+ Gold)", slug: "psu-750-850w" },
          { id: "psu-1000w", name: "1000W+ (80+ Platinum / Ti)", slug: "psu-1000w" },
        ],
      },
      {
        id: "case",
        name: "Case (Vỏ máy)",
        slug: "case-vo-may",
        children: [
          { id: "case-mini-itx", name: "Mini-ITX / Micro-ATX", slug: "case-mini-itx" },
          { id: "case-mid-tower", name: "Mid Tower (ATX)", slug: "case-mid-tower" },
          { id: "case-full-tower", name: "Full Tower (E-ATX)", slug: "case-full-tower" },
        ],
      },
      {
        id: "tan-nhiet",
        name: "Tản nhiệt",
        slug: "tan-nhiet",
        children: [
          { id: "tan-khi", name: "Tản khí (Air Cooler)", slug: "tan-khi" },
          { id: "tan-nuoc-aio", name: "Tản nước AIO (240 / 360mm)", slug: "tan-nuoc-aio" },
          { id: "tan-nuoc-custom", name: "Tản nước Custom Loop", slug: "tan-nuoc-custom" },
        ],
      },
    ],
  },

  {
    id: "man-hinh",
    name: "Màn hình",
    slug: "man-hinh",
    icon: Monitor,
    children: [
      {
        id: "man-hinh-theo-nhu-cau",
        name: "Theo nhu cầu",
        slug: "man-hinh-theo-nhu-cau",
        children: [
          { id: "man-hinh-gaming", name: "Gaming (144Hz+)", slug: "man-hinh-gaming" },
          { id: "man-hinh-van-phong", name: "Văn phòng", slug: "man-hinh-van-phong" },
          { id: "man-hinh-do-hoa", name: "Đồ họa / Màu sắc chuẩn", slug: "man-hinh-do-hoa" },
          { id: "man-hinh-xem-phim", name: "Giải trí / Xem phim", slug: "man-hinh-xem-phim" },
        ],
      },
      {
        id: "man-hinh-theo-hang",
        name: "Theo hãng",
        slug: "man-hinh-theo-hang",
        children: [
          { id: "man-hinh-asus", name: "ASUS / ROG Swift", slug: "man-hinh-asus" },
          { id: "man-hinh-lg", name: "LG UltraGear / UltraFine", slug: "man-hinh-lg" },
          { id: "man-hinh-samsung", name: "Samsung Odyssey", slug: "man-hinh-samsung" },
          { id: "man-hinh-dell", name: "Dell UltraSharp", slug: "man-hinh-dell" },
          { id: "man-hinh-aoc", name: "AOC / Philips", slug: "man-hinh-aoc" },
          { id: "man-hinh-viewsonic", name: "ViewSonic / MSI", slug: "man-hinh-viewsonic" },
        ],
      },
      {
        id: "man-hinh-theo-kich-thuoc",
        name: "Theo kích thước",
        slug: "man-hinh-theo-kich-thuoc",
        children: [
          { id: "man-hinh-24", name: "24 inch", slug: "man-hinh-24-inch" },
          { id: "man-hinh-27", name: "27 inch", slug: "man-hinh-27-inch" },
          { id: "man-hinh-32", name: "32 inch", slug: "man-hinh-32-inch" },
          { id: "man-hinh-ultrawide", name: "34\"+ Ultrawide / Curved", slug: "man-hinh-ultrawide" },
        ],
      },
      {
        id: "man-hinh-theo-tan-so",
        name: "Theo tần số quét",
        slug: "man-hinh-theo-tan-so",
        children: [
          { id: "man-hinh-60hz", name: "60Hz (Tiêu chuẩn)", slug: "man-hinh-60hz" },
          { id: "man-hinh-144-165hz", name: "144Hz – 165Hz", slug: "man-hinh-144-165hz" },
          { id: "man-hinh-240hz", name: "240Hz+ (Đỉnh cao)", slug: "man-hinh-240hz" },
        ],
      },
    ],
  },

  {
    id: "ngoai-vi",
    name: "Gaming Gear",
    slug: "ngoai-vi",
    icon: Keyboard,
    children: [
      {
        id: "gaming-gear-ban-phim",
        name: "Bàn phím",
        slug: "ban-phim",
        children: [
          { id: "ban-phim-co", name: "Cơ (Cherry / Gateron)", slug: "ban-phim-co" },
          { id: "ban-phim-gia-co", name: "Giả cơ", slug: "ban-phim-gia-co" },
          { id: "ban-phim-khong-day", name: "Không dây", slug: "ban-phim-khong-day" },
          { id: "ban-phim-75-tkl", name: "75% / TKL / Full-size", slug: "ban-phim-compact" },
        ],
      },
      {
        id: "gaming-gear-chuot",
        name: "Chuột",
        slug: "chuot",
        children: [
          { id: "chuot-gaming-co-day", name: "Gaming có dây", slug: "chuot-gaming" },
          { id: "chuot-khong-day", name: "Không dây", slug: "chuot-khong-day" },
          { id: "chuot-fps-moba", name: "FPS / MOBA chuyên biệt", slug: "chuot-fps-moba" },
        ],
      },
      {
        id: "gaming-gear-tai-nghe",
        name: "Tai nghe",
        slug: "tai-nghe",
        children: [
          { id: "tai-nghe-gaming-71", name: "Gaming 7.1 Surround", slug: "tai-nghe-gaming-71" },
          { id: "tai-nghe-stereo", name: "Stereo Hi-Fi", slug: "tai-nghe-stereo" },
          { id: "tai-nghe-khong-day", name: "Không dây", slug: "tai-nghe-khong-day" },
        ],
      },
      {
        id: "gaming-gear-lot-chuot",
        name: "Lót chuột",
        slug: "lot-chuot",
        children: [
          { id: "lot-chuot-toc-do", name: "Tốc độ (Speed)", slug: "lot-chuot-toc-do" },
          { id: "lot-chuot-kiem-soat", name: "Kiểm soát (Control)", slug: "lot-chuot-kiem-soat" },
          { id: "lot-chuot-rgb", name: "RGB / Đèn led", slug: "lot-chuot-rgb" },
        ],
      },
      {
        id: "ghe-ban-gaming",
        name: "Ghế & Bàn gaming",
        slug: "ghe-ban-gaming",
        children: [
          { id: "ghe-gaming", name: "Ghế gaming", slug: "ghe-gaming" },
          { id: "ban-gaming", name: "Bàn gaming", slug: "ban-gaming" },
        ],
      },
    ],
  },

  {
    id: "thiet-bi-mang",
    name: "Thiết bị mạng",
    slug: "thiet-bi-mang",
    icon: Wifi,
    children: [
      {
        id: "bo-phat-wifi",
        name: "Bộ phát WiFi / Router",
        slug: "bo-phat-wifi",
        children: [
          { id: "wifi-6", name: "WiFi 6 / 6E (thế hệ mới)", slug: "wifi-6-the-he-moi" },
          { id: "mesh-wifi", name: "Mesh WiFi (đa điểm)", slug: "mesh-wifi" },
          { id: "router-gia-dinh", name: "Router gia đình", slug: "router-gia-dinh" },
        ],
      },
      {
        id: "usb-wifi-card-mang",
        name: "USB WiFi / Card mạng",
        slug: "usb-wifi-card-mang",
        children: [
          { id: "usb-wifi", name: "USB WiFi", slug: "usb-wifi" },
          { id: "card-mang", name: "Card mạng PCIe", slug: "card-mang-pcie" },
        ],
      },
      {
        id: "thiet-bi-mang-chuyen-dung",
        name: "Thiết bị chuyên dụng",
        slug: "thiet-bi-chuyen-dung",
        children: [
          { id: "switch-mang", name: "Switch / Hub mạng", slug: "switch" },
          { id: "can-bang-tai", name: "Cân bằng tải / VPN Router", slug: "can-bang-tai" },
          { id: "access-point", name: "Access Point (AP)", slug: "access-point" },
        ],
      },
      { id: "phu-kien-mang", name: "Phụ kiện & cáp mạng", slug: "phu-kien-mang" },
    ],
  },

  {
    id: "camera",
    name: "Camera giám sát",
    slug: "camera",
    icon: Camera,
    children: [
      {
        id: "camera-wifi",
        name: "Camera WiFi",
        slug: "camera-wifi",
        children: [
          { id: "camera-trong-nha", name: "Trong nhà", slug: "camera-trong-nha" },
          { id: "camera-ngoai-troi", name: "Ngoài trời / chống nước", slug: "camera-ngoai-troi" },
          { id: "camera-dung-pin", name: "Dùng pin (không dây 100%)", slug: "camera-dung-pin" },
        ],
      },
      {
        id: "he-thong-camera",
        name: "Hệ thống camera",
        slug: "he-thong-camera",
        children: [
          { id: "camera-ip", name: "Camera IP (PoE)", slug: "camera-ip" },
          { id: "camera-analog", name: "Camera Analog HD", slug: "camera-analog" },
          { id: "dau-ghi", name: "Đầu ghi NVR / DVR", slug: "dau-ghi-nvr-dvr" },
          { id: "o-cung-camera", name: "Ổ cứng camera (surveillance)", slug: "o-cung-camera" },
        ],
      },
      {
        id: "lap-dat-camera",
        name: "Lắp đặt trọn gói",
        slug: "lap-dat-camera-tron-goi",
        children: [
          { id: "lap-camera-gia-dinh", name: "Gia đình / Nhà ở", slug: "camera-gia-dinh" },
          { id: "lap-camera-van-phong", name: "Văn phòng / Cửa hàng", slug: "camera-van-phong" },
          { id: "lap-camera-kho-nha-xuong", name: "Kho / Nhà xưởng", slug: "camera-kho-nha-xuong" },
        ],
      },
    ],
  },

  {
    id: "dich-vu",
    name: "Dịch vụ & Sửa chữa",
    slug: "dich-vu",
    icon: Wrench,
    children: [
      {
        id: "lap-rap-pc",
        name: "Lắp ráp PC theo yêu cầu",
        slug: "lap-rap-pc",
        children: [
          { id: "tu-van-cau-hinh", name: "Tư vấn cấu hình miễn phí", slug: "tu-van-cau-hinh" },
          { id: "lap-rap-pc-van-phong", name: "PC văn phòng / học tập", slug: "lap-rap-pc-van-phong" },
          { id: "lap-rap-pc-gaming", name: "PC gaming theo ngân sách", slug: "lap-rap-pc-gaming-custom" },
          { id: "lap-rap-pc-do-hoa", name: "Workstation / Đồ họa", slug: "lap-rap-workstation" },
        ],
      },
      {
        id: "sua-chua-bao-tri",
        name: "Sửa chữa & bảo trì",
        slug: "sua-chua-bao-tri",
        children: [
          { id: "ve-sinh-laptop-pc", name: "Vệ sinh Laptop / PC", slug: "ve-sinh-laptop-pc" },
          { id: "cai-windows-phan-mem", name: "Cài Windows / phần mềm", slug: "cai-windows-phan-mem" },
          { id: "sua-phan-cung", name: "Sửa phần cứng", slug: "sua-phan-cung" },
          { id: "thay-linh-kien", name: "Thay linh kiện", slug: "thay-linh-kien" },
          { id: "nang-cap-ram-ssd", name: "Nâng cấp RAM / SSD", slug: "nang-cap-ram-ssd" },
        ],
      },
      {
        id: "thi-cong-tan-noi",
        name: "Thi công tận nơi",
        slug: "thi-cong-tan-noi",
        children: [
          { id: "lap-dat-camera-tc", name: "Lắp đặt camera", slug: "lap-dat-camera" },
          { id: "thi-cong-mang", name: "Thi công mạng nội bộ (LAN)", slug: "thi-cong-mang" },
          { id: "bao-tri-van-phong", name: "Bảo trì định kỳ văn phòng", slug: "bao-tri-van-phong" },
        ],
      },
    ],
  },

  {
    id: "phan-mem",
    name: "Phần mềm & Bản quyền",
    slug: "phan-mem",
    icon: HardDrive,
    badge: "Mới",
    children: [
      {
        id: "ban-quyen-windows",
        name: "Windows & Office",
        slug: "ban-quyen-windows",
        children: [
          { id: "windows-11", name: "Windows 11 Home / Pro", slug: "windows-11" },
          { id: "ms-office", name: "Microsoft 365 (Office)", slug: "microsoft-365" },
        ],
      },
      {
        id: "phan-mem-bao-mat",
        name: "Bảo mật & Diệt virus",
        slug: "phan-mem-bao-mat",
        children: [
          { id: "kaspersky", name: "Kaspersky", slug: "kaspersky" },
          { id: "eset", name: "ESET NOD32", slug: "eset" },
          { id: "bitdefender", name: "Bitdefender", slug: "bitdefender" },
        ],
      },
    ],
  },
];

const STORAGE_KEY = "admin_categories";

function getStoredCategories(): Category[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultCategories;
  } catch {
    return defaultCategories;
  }
}

export const categories: Category[] = getStoredCategories();

export function getAllCategories(): Category[] {
  return getStoredCategories();
}
