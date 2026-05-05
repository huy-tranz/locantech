import type { Product } from "@/data/products";

export interface ApiProduct {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description?: string | null;
  shortDesc?: string | null;
  price: number | string;
  comparePrice?: number | string | null;
  quantity?: number | null;
  soldCount?: number | null;
  images?: string[] | null;
  thumbnail?: string | null;
  brand?: string | null;
  tags?: string[] | null;
  specifications?: Record<string, string> | null;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED" | string;
  isFeatured?: boolean | null;
  isBestSeller?: boolean | null;
  categoryId?: string | null;
  category?: {
    id?: string;
    name?: string;
    slug?: string;
    parent?: {
      id?: string;
      name?: string;
      slug?: string;
      parent?: {
        id?: string;
        name?: string;
        slug?: string;
      } | null;
    } | null;
  } | null;
}

const toNumber = (value: number | string | null | undefined) => Number(value || 0);

const toUiStatus = (status?: string, quantity = 0): Product["status"] => {
  if (status === "DRAFT") return "coming_soon";
  if (quantity <= 0) return "out_of_stock";
  return "in_stock";
};

export function adaptProduct(product: ApiProduct): Product {
  const price = toNumber(product.price);
  const originalPrice = product.comparePrice != null ? toNumber(product.comparePrice) : undefined;
  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined;
  const categorySlug =
    product.category?.parent?.parent?.slug ||
    product.category?.parent?.slug ||
    product.category?.slug ||
    product.categoryId ||
    "";
  const subcategorySlug = product.category?.slug || categorySlug;
  const image = product.thumbnail || product.images?.[0] || "/placeholder.svg";
  const tags = Array.isArray(product.tags) ? product.tags : [];

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    category: categorySlug,
    subcategory: subcategorySlug,
    brand: product.brand || "",
    price,
    originalPrice,
    discount,
    stock: Number(product.quantity || 0),
    soldCount: Number(product.soldCount || 0),
    status: toUiStatus(product.status, Number(product.quantity || 0)),
    image,
    shortDesc: product.shortDesc || product.description || "",
    tags,
    featured: !!product.isFeatured,
    bestSeller: !!product.isBestSeller,
    showOnHome: true,
    specs: product.specifications || {},
  };
}

export function adaptProducts(products: ApiProduct[] | undefined | null): Product[] {
  return (products || []).map(adaptProduct);
}

export function getProductsFromResponse(response: any): Product[] {
  return adaptProducts(Array.isArray(response) ? response : response?.products);
}
