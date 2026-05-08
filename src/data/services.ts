import { Wrench, Monitor, Shield, HardDrive, Cpu, Camera, Wifi, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ServiceIconKey =
  | "wrench"
  | "monitor"
  | "shield"
  | "hard-drive"
  | "cpu"
  | "camera"
  | "wifi"
  | "settings";

export interface ServiceItem {
  id: string;
  name: string;
  slug: string;
  iconKey: ServiceIconKey;
  shortDesc: string;
  priceRange: string;
  duration: string;
}

const STORAGE_KEY = "admin_services_public";

const iconMap: Record<ServiceIconKey, LucideIcon> = {
  wrench: Wrench,
  monitor: Monitor,
  shield: Shield,
  "hard-drive": HardDrive,
  cpu: Cpu,
  camera: Camera,
  wifi: Wifi,
  settings: Settings,
};

const defaultServices: ServiceItem[] = [
  {
    id: "s1",
    name: "Sửa chữa laptop",
    slug: "sua-laptop",
    iconKey: "wrench",
    shortDesc: "Sửa lỗi phần cứng, thay linh kiện, sửa bản lề, thay màn hình laptop các hãng",
    priceRange: "200.000đ - 2.000.000đ",
    duration: "1-3 ngày",
  },
  {
    id: "s2",
    name: "Sửa chữa PC",
    slug: "sua-pc",
    iconKey: "monitor",
    shortDesc: "Kiểm tra, sửa chữa máy tính bàn, thay thế linh kiện hỏng",
    priceRange: "150.000đ - 1.500.000đ",
    duration: "1-2 ngày",
  },
  {
    id: "s3",
    name: "Vệ sinh máy tính",
    slug: "ve-sinh-may-tinh",
    iconKey: "settings",
    shortDesc: "Vệ sinh bụi bẩn, thay keo tản nhiệt, giúp máy mát hơn và hoạt động ổn định",
    priceRange: "150.000đ - 300.000đ",
    duration: "30 phút - 1 giờ",
  },
  {
    id: "s4",
    name: "Cài Windows & phần mềm",
    slug: "cai-windows",
    iconKey: "shield",
    shortDesc: "Cài đặt hệ điều hành, driver, phần mềm bản quyền, diệt virus",
    priceRange: "150.000đ - 500.000đ",
    duration: "1-2 giờ",
  },
  {
    id: "s5",
    name: "Nâng cấp SSD, RAM",
    slug: "nang-cap-ssd-ram",
    iconKey: "hard-drive",
    shortDesc: "Nâng cấp RAM, SSD cho laptop và PC, giúp máy nhanh hơn đáng kể",
    priceRange: "Linh kiện + 100.000đ công",
    duration: "30 phút",
  },
  {
    id: "s6",
    name: "Lắp đặt camera",
    slug: "lap-dat-camera",
    iconKey: "camera",
    shortDesc: "Thi công lắp đặt hệ thống camera giám sát cho gia đình, cửa hàng, văn phòng",
    priceRange: "Từ 3.990.000đ/bộ",
    duration: "Nửa ngày - 1 ngày",
  },
  {
    id: "s7",
    name: "Thi công mạng nội bộ",
    slug: "thi-cong-mang",
    iconKey: "wifi",
    shortDesc: "Thiết kế và thi công hệ thống mạng LAN, WiFi cho văn phòng, quán cafe",
    priceRange: "Theo khảo sát",
    duration: "1-3 ngày",
  },
  {
    id: "s8",
    name: "Bảo trì máy tính văn phòng",
    slug: "bao-tri-van-phong",
    iconKey: "cpu",
    shortDesc: "Dịch vụ bảo trì định kỳ cho doanh nghiệp, đảm bảo hệ thống luôn ổn định",
    priceRange: "Từ 500.000đ/máy/tháng",
    duration: "Theo hợp đồng",
  },
  {
    id: "s9",
    name: "Thu cũ đổi mới",
    slug: "thu-cu-doi-moi",
    iconKey: "settings",
    shortDesc: "Định giá minh bạch, nhận tiền mặt ngay tại chỗ hoặc đổi lên máy mới với giá ưu đãi",
    priceRange: "Theo khảo sát thực tế",
    duration: "15–30 phút định giá",
  },
];

function hasWindow() {
  return typeof window !== "undefined";
}

function normalizeServiceIcon(iconKey?: string): ServiceIconKey {
  if (iconKey && iconKey in iconMap) {
    return iconKey as ServiceIconKey;
  }

  return "wrench";
}

function normalizeService(item: Partial<ServiceItem>): ServiceItem {
  return {
    id: item.id || crypto.randomUUID(),
    name: item.name?.trim() || "",
    slug: item.slug?.trim() || "",
    iconKey: normalizeServiceIcon(item.iconKey),
    shortDesc: item.shortDesc?.trim() || "",
    priceRange: item.priceRange?.trim() || "",
    duration: item.duration?.trim() || "",
  };
}

function getStoredServices(): ServiceItem[] {
  if (!hasWindow()) return defaultServices;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultServices;

    const parsed = JSON.parse(stored) as Partial<ServiceItem>[];
    if (!Array.isArray(parsed) || parsed.length === 0) return defaultServices;

    return parsed.map(normalizeService);
  } catch {
    return defaultServices;
  }
}

function persistServices(items: ServiceItem[]) {
  if (!hasWindow()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const services: ServiceItem[] = getStoredServices();

export function getAllServices(): ServiceItem[] {
  return getStoredServices();
}

export function getServiceBySlug(slug: string) {
  return getStoredServices().find((service) => service.slug === slug);
}

export function saveAllServices(items: ServiceItem[]) {
  persistServices(items.map(normalizeService));
}

export function getServiceIcon(iconKey: ServiceIconKey): LucideIcon {
  return iconMap[iconKey] ?? Wrench;
}

export function getServiceIconOptions() {
  return [
    { value: "wrench", label: "Wrench" },
    { value: "monitor", label: "Monitor" },
    { value: "shield", label: "Shield" },
    { value: "hard-drive", label: "Hard Drive" },
    { value: "cpu", label: "CPU" },
    { value: "camera", label: "Camera" },
    { value: "wifi", label: "WiFi" },
    { value: "settings", label: "Settings" },
  ] as Array<{ value: ServiceIconKey; label: string }>;
}
