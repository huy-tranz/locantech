import { useState, useMemo, type Dispatch, type SetStateAction } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import ProductCard from "@/components/ProductCard";
import { type Product, formatPrice } from "@/data/products";
import { categories, type Category } from "@/data/categories";
import { useProducts } from "@/hooks/queries/product.queries";
import { getProductsFromResponse } from "@/lib/productAdapter";
import { BarChart3, ChevronRight, SlidersHorizontal, X } from "lucide-react";

interface CategoryPageProps {
  categoryId: string;
  title: string;
  description?: string;
  products?: Product[];
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

const categoryBanners: Record<string, { eyebrow: string; title: string; description: string; tone: string }> = {
  laptop: {
    eyebrow: "Laptop chính hãng",
    title: "Chọn laptop đúng nhu cầu, đúng ngân sách",
    description: "Lọc nhanh theo hãng, CPU, RAM và tình trạng hàng để tìm cấu hình phù hợp cho học tập, văn phòng, gaming.",
    tone: "from-primary via-primary-light to-accent",
  },
  pc: {
    eyebrow: "PC văn phòng",
    title: "PC lắp sẵn ổn định cho công việc hằng ngày",
    description: "So sánh cấu hình, giá và tình trạng kho trước khi chọn máy cho gia đình hoặc doanh nghiệp.",
    tone: "from-primary-dark via-primary to-trust",
  },
  "pc-gaming": {
    eyebrow: "PC Gaming",
    title: "Build PC gaming theo hiệu năng bạn cần",
    description: "Lọc CPU, RAM, VGA và khoảng giá để chọn cấu hình chơi game, stream hoặc đồ họa nhanh hơn.",
    tone: "from-primary-dark via-gaming to-sale",
  },
  "linh-kien": {
    eyebrow: "Linh kiện máy tính",
    title: "Nâng cấp linh kiện rõ cấu hình, rõ giá",
    description: "Lọc theo hãng, giá và thông số chính để chọn linh kiện tương thích hơn.",
    tone: "from-primary via-accent to-service",
  },
};

function normalizeSpecValue(value?: string) {
  return value?.replace(/\s+/g, " ").trim();
}

function getSpecValue(product: Product, keys: string[], patterns: RegExp[] = []) {
  const entries = Object.entries(product.specs || {});
  const match = entries.find(([key, value]) =>
    keys.some((candidate) => {
      const needle = candidate.toLowerCase();
      return key.toLowerCase().includes(needle) || value.toLowerCase().includes(needle);
    })
  );
  if (match?.[1]) return normalizeSpecValue(match[1]);

  const descParts = product.shortDesc.split(",").map((part) => part.trim()).filter(Boolean);
  return normalizeSpecValue(descParts.find((part) => patterns.some((pattern) => pattern.test(part))));
}

const getCpuValue = (product: Product) =>
  getSpecValue(product, ["CPU", "Số nhân", "Chip", "Core", "Ryzen", "Apple"], [/intel/i, /amd/i, /core\s/i, /ryzen/i, /apple\s/i]);
const getRamValue = (product: Product) =>
  getSpecValue(product, ["RAM", "Dung lượng"], [/\bram\b/i, /\b\d+\s*gb\s*(ddr)?/i]);
const getVgaValue = (product: Product) =>
  getSpecValue(product, ["VGA", "VRAM", "GPU", "RTX", "GTX", "RX"], [/\brtx\b/i, /\bgtx\b/i, /\brx\s*\d/i]);

function getUniqueOptions(products: Product[], getter: (product: Product) => string | undefined) {
  return Array.from(new Set(products.map(getter).filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b));
}

function formatProductPrice(product: Product) {
  return product.originalPrice ? `${formatPrice(product.price)} / ${formatPrice(product.originalPrice)}` : formatPrice(product.price);
}

function stockLabelForCompare(status: Product["status"]) {
  if (status === "in_stock") return "Còn hàng";
  if (status === "coming_soon") return "Sắp về";
  return "Hết hàng";
}

export default function CategoryPage({ categoryId, title, description, products: initialProducts }: CategoryPageProps) {
  const [sort, setSort] = useState<SortOption>("default");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCpu, setSelectedCpu] = useState<string[]>([]);
  const [selectedRam, setSelectedRam] = useState<string[]>([]);
  const [selectedVga, setSelectedVga] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [showSale, setShowSale] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  const [searchParams] = useSearchParams();
  const subcategorySlug = searchParams.get("subcategory");
  const { data: productRes, isLoading } = useProducts({ category: categoryId, limit: 100 });
  const products = initialProducts ?? getProductsFromResponse(productRes);

  const brands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).sort();
  }, [products]);
  const cpuOptions = useMemo(() => getUniqueOptions(products, getCpuValue), [products]);
  const ramOptions = useMemo(() => getUniqueOptions(products, getRamValue), [products]);
  const vgaOptions = useMemo(() => getUniqueOptions(products, getVgaValue), [products]);
  const category = categories.find(c => c.id === categoryId);
  const subcategories = category?.children || [];
  const banner = categoryBanners[categoryId] || {
    eyebrow: title,
    title: `Tìm nhanh sản phẩm ${title.toLowerCase()}`,
    description: description || "Lọc, sắp xếp và so sánh sản phẩm theo nhu cầu mua hàng thực tế.",
    tone: "from-primary via-primary-light to-accent",
  };

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
    if (selectedCpu.length > 0) {
      result = result.filter(p => {
        const value = getCpuValue(p);
        return value ? selectedCpu.includes(value) : false;
      });
    }
    if (selectedRam.length > 0) {
      result = result.filter(p => {
        const value = getRamValue(p);
        return value ? selectedRam.includes(value) : false;
      });
    }
    if (selectedVga.length > 0) {
      result = result.filter(p => {
        const value = getVgaValue(p);
        return value ? selectedVga.includes(value) : false;
      });
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
  }, [products, selectedBrands, selectedCpu, selectedRam, selectedVga, selectedPrice, selectedStatus, showSale, sort, subcategorySlug, categoryId]);

  const compareProducts = useMemo(
    () => compareIds.map(id => products.find(product => product.id === id)).filter(Boolean) as Product[],
    [compareIds, products],
  );

  const activeFilterCount =
    selectedBrands.length +
    selectedCpu.length +
    selectedRam.length +
    selectedVga.length +
    (selectedPrice !== null ? 1 : 0) +
    (selectedStatus ? 1 : 0) +
    (showSale ? 1 : 0);

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedCpu([]);
    setSelectedRam([]);
    setSelectedVga([]);
    setSelectedPrice(null);
    setSelectedStatus("");
    setShowSale(false);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  };

  const toggleArrayFilter = (value: string, setter: Dispatch<SetStateAction<string[]>>) => {
    setter(prev => prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]);
  };

  const toggleCompare = (productId: string) => {
    setCompareIds(prev => {
      if (prev.includes(productId)) return prev.filter(id => id !== productId);
      if (prev.length >= 3) return prev;
      return [...prev, productId];
    });
  };

  const filterCheckboxGroup = (
    label: string,
    values: string[],
    selected: string[],
    setter: Dispatch<SetStateAction<string[]>>,
  ) => {
    if (values.length === 0) return null;

    return (
      <div className="mb-5">
        <h4 className="mb-2 text-sm font-semibold text-foreground">{label}</h4>
        <div className="max-h-44 space-y-1.5 overflow-y-auto pr-1">
          {values.slice(0, 16).map(value => (
            <label key={value} className="flex cursor-pointer items-center gap-2 text-sm text-foreground hover:text-primary">
              <input
                type="checkbox"
                checked={selected.includes(value)}
                onChange={() => toggleArrayFilter(value, setter)}
                className="accent-primary"
              />
              <span className="line-clamp-1">{value}</span>
            </label>
          ))}
        </div>
      </div>
    );
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

        <section className={`mb-5 overflow-hidden rounded-xl bg-gradient-to-r ${banner.tone} text-white shadow-card`}>
          <div className="relative flex min-h-[150px] items-center justify-between gap-4 p-5 md:p-6">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full border border-white/25 bg-white/12 px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-cyan-50">
                {banner.eyebrow}
              </span>
              <h2 className="mt-3 text-xl font-extrabold leading-tight md:text-2xl">{banner.title}</h2>
              <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-white/82">{banner.description}</p>
            </div>
            <div className="hidden items-end gap-3 md:flex">
              {products.slice(0, 3).map(product => (
                <div key={product.id} className="h-24 w-24 overflow-hidden rounded-lg border border-white/20 bg-white/90 p-2 shadow-sm">
                  <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
                </div>
              ))}
            </div>
          </div>
        </section>

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
          <aside className={`${showFilters ? "fixed inset-x-0 bottom-0 z-50 max-h-[86vh] overflow-y-auto rounded-t-2xl border-t bg-card p-4 shadow-panel" : "hidden"} lg:block lg:sticky lg:top-32 lg:z-auto lg:max-h-none lg:w-[260px] lg:flex-shrink-0 lg:self-start lg:overflow-visible lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}>
            <div className="rounded-xl border bg-card p-4 shadow-sm lg:shadow-none">
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

              {filterCheckboxGroup("CPU", cpuOptions, selectedCpu, setSelectedCpu)}
              {filterCheckboxGroup("RAM", ramOptions, selectedRam, setSelectedRam)}
              {filterCheckboxGroup("VGA", vgaOptions, selectedVga, setSelectedVga)}

              {/* Status */}
              <div className="mb-5">
                <h4 className="text-sm font-semibold text-foreground mb-2">Tình trạng</h4>
                <div className="space-y-1.5">
                  {[{ v: "in_stock", l: "Còn hàng" }, { v: "coming_soon", l: "Sắp về" }, { v: "out_of_stock", l: "Hết hàng" }].map(s => (
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
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">{filtered.length} sản phẩm</span>
                {compareIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowCompare(true)}
                    className="hidden items-center gap-1.5 rounded-full bg-primary/8 px-3 py-1 text-xs font-bold text-primary hover:bg-primary/12 sm:inline-flex"
                  >
                    <BarChart3 className="h-3.5 w-3.5" />
                    So sánh {compareIds.length}/3
                  </button>
                )}
              </div>
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

            {isLoading ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">Đang tải sản phẩm...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">Không tìm thấy sản phẩm phù hợp.</p>
                <button onClick={clearFilters} className="btn-primary mt-3 text-sm">Xóa bộ lọc</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {filtered.map(product => (
                  <div key={product.id} className="relative">
                    <label className="absolute left-2 top-12 z-20 inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-white/80 bg-white/90 px-2 py-1 text-[10px] font-extrabold text-primary shadow-sm backdrop-blur transition-colors hover:bg-white">
                      <input
                        type="checkbox"
                        checked={compareIds.includes(product.id)}
                        onChange={() => toggleCompare(product.id)}
                        disabled={!compareIds.includes(product.id) && compareIds.length >= 3}
                        className="accent-primary"
                      />
                      So sánh
                    </label>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      {compareProducts.length > 0 && (
        <div className="fixed inset-x-3 bottom-3 z-40 rounded-xl border bg-white p-3 shadow-panel md:left-1/2 md:w-[min(46rem,calc(100vw-2rem))] md:-translate-x-1/2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-widest text-primary">So sánh sản phẩm</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {compareProducts.map(product => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => toggleCompare(product.id)}
                    className="inline-flex max-w-[12rem] items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-foreground hover:bg-muted/70"
                    title="Bỏ khỏi so sánh"
                  >
                    <span className="truncate">{product.name}</span>
                    <X className="h-3 w-3 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" className="btn-primary px-4 py-2 text-xs" onClick={() => setShowCompare(true)}>
                <BarChart3 className="mr-1 h-3.5 w-3.5" />
                So sánh
              </button>
              <button
                type="button"
                className="rounded-lg border px-3 py-2 text-xs font-bold text-muted-foreground hover:text-foreground"
                onClick={() => setCompareIds([])}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {showCompare && (
        <div className="fixed inset-0 z-[70] flex items-end bg-foreground/45 p-0 backdrop-blur-sm md:items-center md:justify-center md:p-6">
          <div className="max-h-[88vh] w-full overflow-hidden rounded-t-2xl bg-white shadow-panel md:max-w-5xl md:rounded-2xl">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div>
                <h2 className="text-base font-extrabold text-foreground">So sánh sản phẩm</h2>
                <p className="text-xs text-muted-foreground">Chọn tối đa 3 sản phẩm để đối chiếu nhanh.</p>
              </div>
              <button type="button" onClick={() => setShowCompare(false)} className="rounded-lg p-2 hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            {compareProducts.length < 2 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">Chọn ít nhất 2 sản phẩm để so sánh.</div>
            ) : (
              <div className="overflow-auto p-4">
                <table className="w-full min-w-[42rem] border-separate border-spacing-0 text-sm">
                  <tbody>
                    <tr>
                      <th className="sticky left-0 z-10 w-36 bg-white p-3 text-left text-xs uppercase tracking-widest text-muted-foreground">Sản phẩm</th>
                      {compareProducts.map(product => (
                        <td key={product.id} className="border-l p-3 align-top">
                          <img src={product.image} alt={product.name} className="mx-auto h-24 w-24 object-contain" />
                          <p className="mt-2 line-clamp-2 font-bold text-foreground">{product.name}</p>
                        </td>
                      ))}
                    </tr>
                    {[
                      ["Giá", (product: Product) => formatProductPrice(product)],
                      ["Hãng", (product: Product) => product.brand || "-"],
                      ["CPU", (product: Product) => getCpuValue(product) || "-"],
                      ["RAM", (product: Product) => getRamValue(product) || "-"],
                      ["VGA", (product: Product) => getVgaValue(product) || "-"],
                      ["Tình trạng", (product: Product) => stockLabelForCompare(product.status)],
                    ].map(([label, getter]) => (
                      <tr key={label as string} className="border-t">
                        <th className="sticky left-0 z-10 bg-white p-3 text-left font-bold text-foreground">{label as string}</th>
                        {compareProducts.map(product => (
                          <td key={product.id} className="border-l border-t p-3 font-medium text-foreground/80">
                            {(getter as (product: Product) => string)(product)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
      <Footer />
      <FloatingActions />
    </div>
  );
}
