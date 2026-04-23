import { Laptop, Monitor, Cpu, Wifi, Camera, Wrench, Keyboard, Gamepad2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: LucideIcon;
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
          { id: "laptop-do-hoa", name: "Đồ họa", slug: "laptop-do-hoa" },
          { id: "laptop-mong-nhe", name: "Mỏng nhẹ", slug: "laptop-mong-nhe" },
        ],
      },
      {
        id: "laptop-theo-hang",
        name: "Theo hãng",
        slug: "laptop-theo-hang",
        children: [
          { id: "laptop-apple", name: "Apple", slug: "laptop-apple" },
          { id: "laptop-dell", name: "Dell", slug: "laptop-dell" },
          { id: "laptop-hp", name: "HP", slug: "laptop-hp" },
          { id: "laptop-asus", name: "ASUS", slug: "laptop-asus" },
        ],
      },
      {
        id: "laptop-theo-gia",
        name: "Theo giá",
        slug: "laptop-theo-gia",
        children: [
          { id: "laptop-duoi-10-trieu", name: "Dưới 10 triệu", slug: "laptop-duoi-10-trieu" },
          { id: "laptop-10-20-trieu", name: "10 - 20 triệu", slug: "laptop-10-20-trieu" },
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
        ],
      },
      {
        id: "pc-theo-gia",
        name: "Theo giá",
        slug: "pc-theo-gia",
        children: [
          { id: "pc-duoi-10-trieu", name: "Dưới 10 triệu", slug: "pc-duoi-10-trieu" },
          { id: "pc-10-20-trieu", name: "10 - 20 triệu", slug: "pc-10-20-trieu" },
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
    children: [
      {
        id: "pc-gaming-theo-cau-hinh",
        name: "Theo cấu hình",
        slug: "pc-gaming-theo-cau-hinh",
        children: [
          { id: "pc-gaming-gia-re", name: "Giá rẻ", slug: "pc-gaming-gia-re" },
          { id: "pc-gaming-tam-trung", name: "Tầm trung", slug: "pc-gaming-tam-trung" },
          { id: "pc-gaming-cao-cap", name: "Cao cấp", slug: "pc-gaming-cao-cap" },
        ],
      },
      {
        id: "pc-gaming-theo-nhu-cau",
        name: "Theo nhu cầu",
        slug: "pc-gaming-theo-nhu-cau",
        children: [
          { id: "pc-gaming-pho-thong", name: "Gaming phổ thông", slug: "pc-gaming-pho-thong" },
          { id: "pc-streaming", name: "Streaming", slug: "pc-streaming" },
          { id: "pc-gaming-do-hoa", name: "Gaming + Đồ họa", slug: "pc-gaming-do-hoa" },
        ],
      },
      {
        id: "pc-gaming-theo-gia",
        name: "Theo giá",
        slug: "pc-gaming-theo-gia",
        children: [
          { id: "pc-gaming-duoi-15-trieu", name: "Dưới 15 triệu", slug: "pc-gaming-duoi-15-trieu" },
          { id: "pc-gaming-15-30-trieu", name: "15 - 30 triệu", slug: "pc-gaming-15-30-trieu" },
          { id: "pc-gaming-tren-30-trieu", name: "Trên 30 triệu", slug: "pc-gaming-tren-30-trieu" },
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
      { id: "cpu", name: "CPU (Bộ vi xử lý)", slug: "cpu" },
      { id: "mainboard", name: "Mainboard (Bo mạch chủ)", slug: "mainboard" },
      { id: "ram", name: "RAM", slug: "ram" },
      { id: "o-cung", name: "Ổ cứng", slug: "o-cung" },
      { id: "ssd", name: "SSD", slug: "ssd" },
      { id: "hdd", name: "HDD", slug: "hdd" },
      { id: "vga", name: "Card đồ họa (VGA)", slug: "card-do-hoa-vga" },
      { id: "psu", name: "Nguồn (PSU)", slug: "nguon-psu" },
      {
        id: "tan-nhiet",
        name: "Tản nhiệt",
        slug: "tan-nhiet",
        children: [
          { id: "tan-khi", name: "Tản khí", slug: "tan-khi" },
          { id: "tan-nuoc", name: "Tản nước", slug: "tan-nuoc" },
        ],
      },
      { id: "case", name: "Case (Vỏ máy)", slug: "case-vo-may" },
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
          { id: "man-hinh-gaming", name: "Gaming", slug: "man-hinh-gaming" },
          { id: "man-hinh-van-phong", name: "Văn phòng", slug: "man-hinh-van-phong" },
          { id: "man-hinh-do-hoa", name: "Đồ họa", slug: "man-hinh-do-hoa" },
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
          { id: "ban-phim-co", name: "Cơ", slug: "ban-phim-co" },
          { id: "ban-phim-gia-co", name: "Giả cơ", slug: "ban-phim-gia-co" },
        ],
      },
      {
        id: "gaming-gear-chuot",
        name: "Chuột",
        slug: "chuot",
        children: [
          { id: "chuot-gaming", name: "Gaming", slug: "chuot-gaming" },
          { id: "chuot-khong-day", name: "Không dây", slug: "chuot-khong-day" },
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
        name: "Bộ phát WiFi",
        slug: "bo-phat-wifi",
        children: [
          { id: "wifi-6", name: "WiFi 6 thế hệ mới", slug: "wifi-6-the-he-moi" },
          { id: "mesh-wifi", name: "Mesh WiFi", slug: "mesh-wifi" },
          { id: "router-gia-dinh", name: "Router gia đình", slug: "router-gia-dinh" },
        ],
      },
      { id: "usb-wifi-card-mang", name: "USB WiFi / Card mạng", slug: "usb-wifi-card-mang" },
      {
        id: "thiet-bi-mang-chuyen-dung",
        name: "Thiết bị chuyên dụng",
        slug: "thiet-bi-chuyen-dung",
        children: [
          { id: "switch", name: "Switch", slug: "switch" },
          { id: "can-bang-tai", name: "Cân bằng tải", slug: "can-bang-tai" },
        ],
      },
      { id: "phu-kien-mang", name: "Phụ kiện mạng", slug: "phu-kien-mang" },
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
          { id: "camera-ngoai-troi", name: "Ngoài trời", slug: "camera-ngoai-troi" },
          { id: "camera-dung-pin", name: "Dùng pin", slug: "camera-dung-pin" },
        ],
      },
      {
        id: "he-thong-camera",
        name: "Hệ thống camera",
        slug: "he-thong-camera",
        children: [
          { id: "camera-ip", name: "Camera IP", slug: "camera-ip" },
          { id: "camera-analog", name: "Camera Analog", slug: "camera-analog" },
          { id: "dau-ghi", name: "Đầu ghi (NVR/DVR)", slug: "dau-ghi-nvr-dvr" },
          { id: "o-cung-camera", name: "Ổ cứng", slug: "o-cung-camera" },
        ],
      },
    ],
  },
  {
    id: "dich-vu",
    name: "Dịch vụ sửa chữa",
    slug: "dich-vu",
    icon: Wrench,
    children: [
      {
        id: "sua-chua-bao-tri",
        name: "Sửa chữa & bảo trì",
        slug: "sua-chua-bao-tri",
        children: [
          { id: "ve-sinh-laptop-pc", name: "Vệ sinh Laptop / PC", slug: "ve-sinh-laptop-pc" },
          { id: "cai-windows-phan-mem", name: "Cài Windows / phần mềm", slug: "cai-windows-phan-mem" },
          { id: "sua-phan-cung", name: "Sửa phần cứng", slug: "sua-phan-cung" },
          { id: "thay-linh-kien", name: "Thay linh kiện", slug: "thay-linh-kien" },
        ],
      },
      {
        id: "thi-cong-tan-noi",
        name: "Thi công tận nơi",
        slug: "thi-cong-tan-noi",
        children: [
          { id: "lap-dat-camera", name: "Lắp đặt camera", slug: "lap-dat-camera" },
          { id: "thi-cong-mang", name: "Thi công mạng", slug: "thi-cong-mang" },
          { id: "bao-tri-van-phong", name: "Bảo trì văn phòng", slug: "bao-tri-van-phong" },
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
