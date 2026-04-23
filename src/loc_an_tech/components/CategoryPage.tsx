import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import ProductCard from "@/components/ProductCard";
import { type Product, getProductBrands } from "@/data/products";
import { categories, type Category } from "@/data/categories";
import { ChevronRight, SlidersHorizontal, X } from "lucide-react";

interface CategoryPageProps {
  categoryId: string;
  title: string;
  description?: string;
  products: Product[];
}

type SortOption = "default" | "price-asc" | "price-desc" | "newest" | "best-seller" | "discount";

const sortLabels: Record<SortOption, string> = {
  default: "Mặc định",
  "price-asc": "Giá tăng dần",
  "price-desc": "Giá giảm dần",
  newest: "Mới nhất",
  "best-seller": "Bán chạy",
  discount: "Giảm giá nhiều",
};

const priceRanges = [
  { label: "Dưới 5 triệu", min: 0, max: 5000000 },
  { label: "5 - 10 triệu", min: 5000000, max: 10000000 },
  { label: "10 - 15 triệu", min: 10000000, max: 15000000 },
  { label: "15 - 20 triệu", min: 15000000, max: 20000000 },
  { label: "20 - 30 triệu", min: 20000000, max: 30000000 },
  { label: "Trên 30 triệu", min: 30000000, max: Infinity },
];

export default function CategoryPage({ categoryId, title, description, products }: CategoryPageProps) {
  const [sort, setSort] = useState<SortOption>("default");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [showSale, setShowSale] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [searchParams] = useSearchParams();
  const subcategorySlug = searchParams.get("subcategory");

  const brands = getProductBrands(categoryId);
  const category = categories.find(c => c.id === categoryId);
  const subcategories = category?.children || [];

  const isLeafCategory = (item: Category) => !item.children || item.children.length === 0;

  const filtered = useMemo(() => {
    let result = [...products];

    // Optional: filter products by subcategory from URL query (?subcategory=...).
    // If exact match yields no results, fallback to brand-based matching to avoid "empty" pages.
    if (subcategorySlug) {
      const exact = result.filter(p => p.subcategory === subcategorySlug);
      if (exact.length > 0) {
        result = exact;
      } else {
        const slugKey = subcategorySlug
          .trim()
          .toLowerCase()
          .replace(new RegExp(`^${categoryId}-`, "i"), "")
          .replace(/\s+/g, "-");
        const byBrand = result.filter(p => p.brand.trim().toLowerCase().replace(/\s+/g, "-") === slugKey);
        if (byBrand.length > 0) {
          result = byBrand;
        }
      }
    }

    if (selectedBrands.length > 0) {
      result = result.filter(p => selectedBrands.includes(p.brand));
    }
    if (selectedPrice !== null) {
      const range = priceRanges[selectedPrice];
      result = result.filter(p => p.price >= range.min && p.price < range.max);
    }
    if (selectedStatus) {
      result = result.filter(p => p.status === selectedStatus);
    }
    if (showSale) {
      result = result.filter(p => p.discount && p.discount > 0);
    }

    switch (sort) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "newest": result.sort((a, b) => (a.tags.includes("mới") ? -1 : 1)); break;
      case "best-seller": result.sort((a, b) => (a.bestSeller ? -1 : 1)); break;
      case "discount": result.sort((a, b) => (b.discount || 0) - (a.discount || 0)); break;
    }

    return result;
  }, [products, selectedBrands, selectedPrice, selectedStatus, showSale, sort, subcategorySlug, categoryId]);

  const activeFilterCount = selectedBrands.length + (selectedPrice !== null ? 1 : 0) + (selectedStatus ? 1 : 0) + (showSale ? 1 : 0);

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedPrice(null);
    setSelectedStatus("");
    setShowSale(false);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  };

  return (
    <div className="bg-background">
      <Header />
      <main className="section-container py-4 md:py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-muted-foreground mb-4 gap-1.5">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">{title}</span>
        </nav>

        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">{title}</h1>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
          {/* Mobile filter toggle */}
          <button
            className="lg:hidden btn-primary text-xs py-2 relative"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4 mr-1" />
            Lọc
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center">{activeFilterCount}</span>
            )}
          </button>
        </div>

        {/* Subcategory groups */}
        {subcategories.length > 0 && (
          <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {subcategories.map(sub => (
              <div key={sub.id} className="rounded-xl border bg-card p-4">
                <h3 className="text-sm font-semibold text-foreground">{sub.name}</h3>
                {isLeafCategory(sub) ? (
                  <div className="mt-3">
                    <Link
                      to={`?subcategory=${encodeURIComponent(sub.slug)}`}
                      className="inline-flex rounded-full border px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      {sub.name}
                    </Link>
                  </div>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {sub.children?.map(child => (
                      <Link
                        key={child.id}
                        to={`?subcategory=${encodeURIComponent(child.slug)}`}
                        className="inline-flex rounded-full border px-3 py-1.5 text-xs font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-5 items-start">
          {/* Filters sidebar: self-start + sticky — tránh cột filter bị stretch bằng chiều cao lưới (gây vùng trống / scroll lạ) */}
          <aside className={`${showFilters ? "fixed inset-0 z-50 bg-card overflow-y-auto p-4" : "hidden"} lg:block lg:sticky lg:top-32 lg:z-auto lg:w-[240px] lg:flex-shrink-0 lg:self-start`}>
            <div>
              {/* Mobile close */}
              <div className="flex items-center justify-between lg:hidden mb-4">
                <h3 className="font-bold text-foreground">Bộ lọc</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Active filters */}
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-xs text-sale font-medium mb-3 hover:underline">
                  ✕ Xóa tất cả bộ lọc ({activeFilterCount})
                </button>
              )}

              {/* Price */}
              <div className="mb-5">
                <h4 className="text-sm font-semibold text-foreground mb-2">Khoảng giá</h4>
                <div className="space-y-1.5">
                  {priceRanges.map((range, i) => (
                    <label key={i} className="flex items-center gap-2 text-sm text-foreground cursor-pointer hover:text-primary">
                      <input
                        type="radio"
                        name="price"
                        checked={selectedPrice === i}
                        onChange={() => setSelectedPrice(selectedPrice === i ? null : i)}
                        className="accent-primary"
                      />
                      {range.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand */}
              {brands.length > 0 && (
                <div className="mb-5">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Hãng</h4>
                  <div className="space-y-1.5">
                    {brands.map(brand => (
                      <label key={brand} className="flex items-center gap-2 text-sm text-foreground cursor-pointer hover:text-primary">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="accent-primary"
                        />
                        {brand}
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Status */}
              <div className="mb-5">
                <h4 className="text-sm font-semibold text-foreground mb-2">Tình trạng</h4>
                <div className="space-y-1.5">
                  {[{ v: "in_stock", l: "Còn hàng" }, { v: "coming_soon", l: "Sắp về" }].map(s => (
                    <label key={s.v} className="flex items-center gap-2 text-sm text-foreground cursor-pointer hover:text-primary">
                      <input type="radio" name="status" checked={selectedStatus === s.v} onChange={() => setSelectedStatus(selectedStatus === s.v ? "" : s.v)} className="accent-primary" />
                      {s.l}
                    </label>
                  ))}
                </div>
              </div>

              {/* Sale only */}
              <div className="mb-5">
                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer hover:text-primary">
                  <input type="checkbox" checked={showSale} onChange={() => setShowSale(!showSale)} className="accent-accent" />
                  <span className="font-medium text-sale">Chỉ sản phẩm khuyến mãi</span>
                </label>
              </div>

              {/* Mobile apply */}
              <button className="lg:hidden w-full btn-cta mt-4" onClick={() => setShowFilters(false)}>
                Áp dụng ({filtered.length} sản phẩm)
              </button>
            </div>
          </aside>

          {/* Product grid */}
          <div className="min-h-0 flex-1 min-w-0">
            {/* Sort bar */}
            <div className="flex items-center justify-between bg-card border rounded-lg px-4 py-2.5 mb-4">
              <span className="text-sm text-muted-foreground">{filtered.length} sản phẩm</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground hidden sm:block">Sắp xếp:</span>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value as SortOption)}
                  className="text-sm border rounded-md px-2.5 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {Object.entries(sortLabels).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">Không tìm thấy sản phẩm phù hợp.</p>
                <button onClick={clearFilters} className="btn-primary mt-3 text-sm">Xóa bộ lọc</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {filtered.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
