export type OrderStatus = "pending" | "processing" | "shipping" | "completed" | "cancelled" | "refunded";
export type RepairStatus = "received" | "repairing" | "completed" | "cancelled";

export interface AccountOrderItem {
  productId: string;
  quantity: number;
  price: number;
  productName?: string;
  productSku?: string;
  productImage?: string;
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
  return {
    orders: [],
    repairs: [],
    addresses: [],
    wishlist: [],
    recentlyViewed: [],
  };
}

export function getAccountData(userId: string): AccountData {
  if (!hasWindow()) return buildDefaultData();

  const key = keyForUser(userId);

  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw) as AccountData;
      return { ...buildDefaultData(), ...parsed, orders: [], repairs: [] };
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
