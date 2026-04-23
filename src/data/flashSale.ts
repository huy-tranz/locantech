import { getAllProducts } from "@/data/products";

export interface FlashSaleConfig {
  title: string;
  subtitle: string;
  badge: string;
  endAt: string;
  bannerImage: string;
  selectedProductIds: string[];
}

export const FLASH_SALE_STORAGE_KEY = "locan_flash_sale";

function hasWindow() {
  return typeof window !== "undefined";
}

function buildDefaultFlashSale(): FlashSaleConfig {
  const saleProducts = getAllProducts()
    .filter((product) => (product.discount ?? 0) > 0)
    .slice(0, 8);

  return {
    title: "🔥 Flash Sale - Giảm giá sốc",
    subtitle: "Giá tốt mỗi ngày cho laptop, PC, linh kiện và phụ kiện nổi bật tại Lộc An Tech.",
    badge: "Chớp deal trong hôm nay",
    endAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    bannerImage: "",
    selectedProductIds: saleProducts.map((product) => product.id),
  };
}

export function getFlashSaleConfig(): FlashSaleConfig {
  const fallback = buildDefaultFlashSale();

  if (!hasWindow()) {
    return fallback;
  }

  try {
    const raw = localStorage.getItem(FLASH_SALE_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(FLASH_SALE_STORAGE_KEY, JSON.stringify(fallback));
      return fallback;
    }

    return {
      ...fallback,
      ...(JSON.parse(raw) as Partial<FlashSaleConfig>),
    };
  } catch {
    return fallback;
  }
}

export function saveFlashSaleConfig(data: FlashSaleConfig) {
  if (!hasWindow()) return;
  localStorage.setItem(FLASH_SALE_STORAGE_KEY, JSON.stringify(data));
}
