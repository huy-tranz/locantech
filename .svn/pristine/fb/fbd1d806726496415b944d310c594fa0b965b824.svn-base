import { products } from "@/data/products";

export type OrderStatus = "pending" | "processing" | "shipping" | "completed";
export type RepairStatus = "received" | "repairing" | "completed";

export interface AccountOrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface AccountOrder {
  id: string;
  code: string;
  createdAt: string;
  status: OrderStatus;
  address: string;
  paymentMethod: string;
  shippingFee: number;
  note?: string;
  items: AccountOrderItem[];
}

export interface RepairTimelineEntry {
  id: string;
  title: string;
  time: string;
  note?: string;
}

export interface RepairRequest {
  id: string;
  code: string;
  deviceName: string;
  issueDescription: string;
  receivedAt: string;
  status: RepairStatus;
  estimate: string;
  history: RepairTimelineEntry[];
}

export interface AccountAddress {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  ward: string;
  district: string;
  city: string;
  note?: string;
  isDefault: boolean;
}

export interface AccountData {
  orders: AccountOrder[];
  repairs: RepairRequest[];
  addresses: AccountAddress[];
  wishlist: string[];
  recentlyViewed: string[];
}

const ACCOUNT_STORAGE_PREFIX = "locan_account_data";

function hasWindow() {
  return typeof window !== "undefined";
}

function keyForUser(userId: string) {
  return `${ACCOUNT_STORAGE_PREFIX}:${userId}`;
}

function buildDefaultData(): AccountData {
  const p1 = products[0];
  const p2 = products[4];
  const p3 = products[10];
  const p4 = products[20];
  const p5 = products[30];
  const p6 = products[40];

  return {
    orders: [
      {
        id: "order-1",
        code: "LA24031501",
        createdAt: "2026-03-15T09:30:00",
        status: "shipping",
        address: "7 La Duong, Duong Noi, Ha Dong, Ha Noi",
        paymentMethod: "COD",
        shippingFee: 30000,
        note: "Giao gio hanh chinh",
        items: [
          { productId: p1.id, quantity: 1, price: p1.price },
          { productId: p3.id, quantity: 2, price: p3.price },
        ],
      },
      {
        id: "order-2",
        code: "LA24031002",
        createdAt: "2026-03-10T14:15:00",
        status: "completed",
        address: "Khu do thi Duong Noi, Ha Dong, Ha Noi",
        paymentMethod: "Chuyen khoan",
        shippingFee: 0,
        items: [{ productId: p4.id, quantity: 1, price: p4.price }],
      },
      {
        id: "order-3",
        code: "LA24031903",
        createdAt: "2026-03-19T11:10:00",
        status: "processing",
        address: "To 12, Van Phuc, Ha Dong, Ha Noi",
        paymentMethod: "COD",
        shippingFee: 25000,
        note: "Goi truoc khi giao",
        items: [
          { productId: p5.id, quantity: 1, price: p5.price },
          { productId: p6.id, quantity: 1, price: p6.price },
        ],
      },
    ],
    repairs: [
      {
        id: "repair-1",
        code: "SC24031801",
        deviceName: "Laptop Dell Latitude 5540",
        issueDescription: "May nong va tat dot ngot sau khoang 20 phut su dung.",
        receivedAt: "2026-03-18T08:45:00",
        status: "repairing",
        estimate: "Du kien ban giao 2026-03-21",
        history: [
          { id: "h1", title: "Da tiep nhan may", time: "2026-03-18 08:45", note: "Nhan tai cua hang La Duong" },
          { id: "h2", title: "Da kiem tra loi tan nhiet", time: "2026-03-18 10:20", note: "Can ve sinh va thay keo tan nhiet" },
          { id: "h3", title: "Dang sua chua", time: "2026-03-19 09:15", note: "Cho kiem tra stress test lan cuoi" },
        ],
      },
      {
        id: "repair-2",
        code: "SC24030502",
        deviceName: "PC Loc An VP Core i5-12400",
        issueDescription: "Khong nhan man hinh sau khi mat dien.",
        receivedAt: "2026-03-05T15:30:00",
        status: "completed",
        estimate: "Da ban giao",
        history: [
          { id: "h4", title: "Da tiep nhan bo may", time: "2026-03-05 15:30" },
          { id: "h5", title: "Da thay nguon moi", time: "2026-03-06 10:10", note: "Nguon cu loi sau su co dien" },
          { id: "h6", title: "Da ban giao khach", time: "2026-03-06 17:40", note: "May hoat dong on dinh" },
        ],
      },
    ],
    addresses: [
      {
        id: "addr-1",
        fullName: "Nguyen Van An",
        phone: "0989386219",
        line1: "7 La Duong",
        ward: "Duong Noi",
        district: "Ha Dong",
        city: "Ha Noi",
        note: "Can ho 12A",
        isDefault: true,
      },
      {
        id: "addr-2",
        fullName: "Nguyen Van An",
        phone: "0989386219",
        line1: "So 18 To huu",
        ward: "Van Phuc",
        district: "Ha Dong",
        city: "Ha Noi",
        note: "Dia chi van phong",
        isDefault: false,
      },
    ],
    wishlist: [p2.id, p4.id, p6.id],
    recentlyViewed: [p1.id, p5.id, p2.id, p3.id],
  };
}

export function getAccountData(userId: string): AccountData {
  if (!hasWindow()) return buildDefaultData();

  const key = keyForUser(userId);

  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      return JSON.parse(raw) as AccountData;
    }
  } catch {
    return buildDefaultData();
  }

  const seeded = buildDefaultData();
  localStorage.setItem(key, JSON.stringify(seeded));
  return seeded;
}

export function saveAccountData(userId: string, data: AccountData) {
  if (!hasWindow()) return;
  localStorage.setItem(keyForUser(userId), JSON.stringify(data));
}

export function addRecentlyViewedProduct(userId: string, productId: string) {
  const current = getAccountData(userId);
  const next: AccountData = {
    ...current,
    recentlyViewed: [productId, ...current.recentlyViewed.filter((id) => id !== productId)].slice(0, 12),
  };
  saveAccountData(userId, next);
  return next;
}
