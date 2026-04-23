import { useMemo } from "react";
import {
  useProducts as useProductsQuery,
  useProductBySlug,
} from "@/hooks/queries/product.queries";

export function useProducts() {
  const query = useProductsQuery({ status: "all", limit: 200 });

  const products = useMemo(() => {
    const list = (query.data?.products || []) as any[];
    return list.map((p) => ({
      ...p,
      price: Number(p.price || 0),
      originalPrice: p.comparePrice != null ? Number(p.comparePrice) : undefined,
      stock: Number(p.quantity || 0),
      image: p.thumbnail || p.images?.[0] || "",
      category: p.category?.slug || p.categoryId || "",
      featured: !!p.isFeatured,
      bestSeller: !!p.isBestSeller,
      specs: p.specifications || {},
      status: p.status === "DRAFT" ? "coming_soon" : Number(p.quantity || 0) > 0 ? "in_stock" : "out_of_stock",
    }));
  }, [query.data]);

  return { products, isLoading: query.isLoading, error: query.error };
}

export function useProduct(slug: string) {
  return useProductBySlug(slug);
}
