import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import ProductCard from "@/components/ProductCard";
import { FLASH_SALE_STORAGE_KEY, getFlashSaleConfig } from "@/data/flashSale";
import { formatPrice, type Product } from "@/data/products";
import { useProducts } from "@/hooks/queries/product.queries";
import { toast } from "@/hooks/use-toast";
import { getProductsFromResponse } from "@/lib/productAdapter";
import {
  BadgePercent,
  Camera,
  ChevronRight,
  Clock,
  Copy,
  Cpu,
  Flame,
  Gift,
  Laptop,
  Monitor,
  Mouse,
  Network,
  SlidersHorizontal,
  Sparkles,
  Zap,
} from "lucide-react";

interface CountdownProps {
  targetDate: Date;
}

const saleTabs = [
  { key: "all", label: "Tất cả", categories: [], icon: Flame },
  { key: "laptop", label: "Laptop", categories: ["laptop"], icon: Laptop },
  { key: "pc", label: "PC", categories: ["pc", "pc-gaming"], icon: Monitor },
  { key: "linh-kien", label: "Linh kiện", categories: ["linh-kien"], icon: Cpu },
  { key: "man-hinh", label: "Màn hình", categories: ["man-hinh"], icon: Monitor },
  { key: "mang", label: "Thiết bị mạng", categories: ["thiet-bi-mang"], icon: Network },
  { key: "camera", label: "Camera", categories: ["camera"], icon: Camera },
  { key: "ngoai-vi", label: "Ngoại vi", categories: ["ngoai-vi"], icon: Mouse },
] as const;

const saleSlots = [
  { time: "00:00", label: "Đang chạy", active: false },
  { time: "12:00", label: "Đang chạy", active: true },
  { time: "18:00", label: "Sắp mở", active: false },
  { time: "21:00", label: "Sắp mở", active: false },
];

const coupons = [
  { code: "LOCAN50", value: "Giảm 50K", description: "Cho đơn hàng từ 3 triệu" },
  { code: "BUILDPC", value: "Ưu đãi combo", description: "Khi mua PC kèm màn hình" },
  { code: "FREESHIP", value: "Hỗ trợ giao hàng", description: "Áp dụng nội thành Hà Nội" },
];

type SaleTabKey = (typeof saleTabs)[number]["key"];
type SortKey = "discount" | "price-asc" | "price-desc" | "selling-fast";

function CountdownTimer({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const parts = [
    { label: "Ngày", value: timeLeft.days },
    { label: "Giờ", value: timeLeft.hours },
    { label: "Phút", value: timeLeft.minutes },
    { label: "Giây", value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 md:justify-end">
      {parts.map((item, index) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className="flex min-w-[3.2rem] flex-col items-center justify-center rounded-lg bg-white px-2 py-1.5 text-sale shadow-sm">
            <span className="font-mono text-lg font-black leading-none">{String(item.value).padStart(2, "0")}</span>
            <span className="mt-1 text-[10px] font-extrabold uppercase text-slate-500">{item.label}</span>
          </span>
          {index < parts.length - 1 && <span className="font-black text-yellow-200">:</span>}
        </div>
      ))}
    </div>
  );
}

function getSaleProducts(products: Product[], selectedProductIds: string[]) {
  const selected = selectedProductIds
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));

  if (selected.length > 0) return selected;

  return products
    .filter((product) => (product.discount ?? 0) > 0)
    .sort((a, b) => (b.discount || 0) - (a.discount || 0));
}

function getFilteredProducts(products: Product[], activeTab: SaleTabKey, sortKey: SortKey) {
  const tab = saleTabs.find((item) => item.key === activeTab) ?? saleTabs[0];
  const filtered =
    tab.categories.length === 0 ? products : products.filter((product) => tab.categories.includes(product.category));

  return [...filtered].sort((a, b) => {
    if (sortKey === "price-asc") return a.price - b.price;
    if (sortKey === "price-desc") return b.price - a.price;
    if (sortKey === "selling-fast") return (a.stock || 0) - (b.stock || 0);
    return (b.discount || 0) - (a.discount || 0);
  });
}

export default function FlashSalePage() {
  const [config, setConfig] = useState(() => getFlashSaleConfig());
  const [activeTab, setActiveTab] = useState<SaleTabKey>("all");
  const [sortKey, setSortKey] = useState<SortKey>("discount");
  const { data: productRes } = useProducts({ limit: 100 });
  const allProducts = getProductsFromResponse(productRes);

  useEffect(() => {
    const syncConfig = () => setConfig(getFlashSaleConfig());

    syncConfig();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === FLASH_SALE_STORAGE_KEY) {
        syncConfig();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const saleProducts = useMemo(
    () => getSaleProducts(allProducts, config.selectedProductIds),
    [allProducts, config.selectedProductIds],
  );

  const visibleProducts = useMemo(
    () => getFilteredProducts(saleProducts, activeTab, sortKey),
    [activeTab, saleProducts, sortKey],
  );

  const totalSavings = saleProducts.reduce((acc, product) => {
    if (product.originalPrice) {
      return acc + (product.originalPrice - product.price);
    }
    return acc;
  }, 0);

  const maxDiscount = saleProducts.reduce((max, product) => Math.max(max, product.discount ?? 0), 0);
  const lowStockCount = saleProducts.filter((product) => product.stock <= 5).length;

  const targetDate = useMemo(() => {
    const parsed = new Date(config.endAt);
    if (Number.isNaN(parsed.getTime())) {
      const fallback = new Date();
      fallback.setHours(fallback.getHours() + 24);
      return fallback;
    }
    return parsed;
  }, [config.endAt]);

  const handleCopyCoupon = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({ title: `Đã sao chép mã ${code}` });
    } catch {
      toast({ title: code, description: "Dùng mã này khi đặt hàng để được tư vấn ưu đãi." });
    }
  };

  return (
    <div className="bg-background">
      <Header />
      <main className="section-container py-4 md:py-6">
        <nav className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Trang chủ
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">Flash Sale</span>
        </nav>

        <section className="relative mb-5 overflow-hidden rounded-xl border border-sale/30 bg-gradient-to-br from-[#1f0715] via-[#7c1123] to-[#f34a18] p-4 text-white shadow-[0_24px_60px_rgba(220,38,38,0.22)] md:p-6">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.11)_0,transparent_34%),radial-gradient(circle_at_18%_18%,rgba(250,204,21,0.28),transparent_20rem),radial-gradient(circle_at_88%_8%,rgba(34,211,238,0.17),transparent_18rem)]" />
          {config.bannerImage ? (
            <div
              className="absolute inset-y-0 right-0 hidden w-1/3 bg-cover bg-center opacity-20 lg:block"
              style={{ backgroundImage: `url(${config.bannerImage})` }}
            />
          ) : null}

          <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-widest text-yellow-100 backdrop-blur">
                  <Flame className="h-4 w-4 text-yellow-300" />
                  {config.badge}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-yellow-300 px-3 py-1.5 text-xs font-extrabold uppercase tracking-widest text-slate-950">
                  <BadgePercent className="h-4 w-4" />
                  Giảm tới {maxDiscount}%
                </span>
              </div>

              <h1 className="max-w-3xl text-2xl font-black leading-tight md:text-4xl">{config.title}</h1>
              <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/82 md:text-base">{config.subtitle}</p>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                {[
                  { icon: Zap, label: `${saleProducts.length} deal đang chạy` },
                  { icon: Gift, label: `Tiết kiệm ${formatPrice(totalSavings)}` },
                  { icon: Sparkles, label: `${lowStockCount} deal sắp hết hàng` },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <span
                      key={item.label}
                      className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3 py-2 text-xs font-extrabold text-white/90 backdrop-blur"
                    >
                      <Icon className="h-4 w-4 text-yellow-200" />
                      {item.label}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-yellow-200/30 bg-black/22 p-3 shadow-inner backdrop-blur lg:min-w-[360px]">
              <div className="mb-2 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest text-yellow-100 md:justify-end">
                <Clock className="h-4 w-4" />
                Kết thúc sau
              </div>
              <CountdownTimer targetDate={targetDate} />
            </div>
          </div>
        </section>

        <section className="mb-4 grid gap-3 lg:grid-cols-[1.1fr_1fr]">
          <div className="rounded-xl border bg-card p-3">
            <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-foreground">
              <Clock className="h-4 w-4 text-sale" />
              Khung giờ săn deal
            </div>
            <div className="grid grid-cols-4 gap-2">
              {saleSlots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  className={`rounded-lg border px-2 py-2 text-center transition ${
                    slot.active
                      ? "border-sale bg-sale text-white shadow-sm"
                      : "border-border bg-muted/30 text-muted-foreground hover:border-sale/40 hover:text-sale"
                  }`}
                >
                  <span className="block text-sm font-black">{slot.time}</span>
                  <span className="mt-0.5 block text-[10px] font-bold">{slot.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-3">
            {coupons.map((coupon) => (
              <button
                key={coupon.code}
                type="button"
                onClick={() => handleCopyCoupon(coupon.code)}
                className="group flex min-h-[88px] items-center justify-between gap-3 rounded-xl border border-dashed border-sale/35 bg-sale/5 px-3 py-2 text-left transition hover:border-sale hover:bg-sale/10"
              >
                <span className="min-w-0">
                  <span className="block text-xs font-black text-sale">{coupon.value}</span>
                  <span className="mt-0.5 block truncate text-sm font-black text-foreground">{coupon.code}</span>
                  <span className="mt-1 block text-[11px] font-semibold leading-4 text-muted-foreground">{coupon.description}</span>
                </span>
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sale text-white transition group-hover:scale-105">
                  <Copy className="h-4 w-4" />
                </span>
              </button>
            ))}
          </div>
        </section>

        {saleProducts.length === 0 ? (
          <div className="rounded-lg border bg-card py-16 text-center">
            <p className="mb-2 text-muted-foreground">Chưa có sản phẩm nào trong chiến dịch Flash Sale.</p>
            <Link to="/" className="btn-primary">
              Về trang chủ
            </Link>
          </div>
        ) : (
          <>
            <div className="sticky top-0 z-20 mb-4 rounded-xl border bg-card/95 p-3 shadow-sm backdrop-blur md:top-2">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 gap-2 overflow-x-auto pb-1">
                  {saleTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.key;
                    const count =
                      tab.categories.length === 0
                        ? saleProducts.length
                        : saleProducts.filter((product) => tab.categories.includes(product.category)).length;

                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-extrabold transition ${
                          isActive
                            ? "border-sale bg-sale text-white"
                            : "border-border bg-background text-muted-foreground hover:border-sale/40 hover:text-sale"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                        <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${isActive ? "bg-white/18" : "bg-muted"}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <label className="flex shrink-0 items-center gap-2 rounded-lg border bg-background px-3 py-2 text-xs font-bold text-muted-foreground">
                  <SlidersHorizontal className="h-4 w-4 text-sale" />
                  Sắp xếp
                  <select
                    value={sortKey}
                    onChange={(event) => setSortKey(event.target.value as SortKey)}
                    className="bg-transparent text-xs font-extrabold text-foreground outline-none"
                  >
                    <option value="discount">Giảm sâu nhất</option>
                    <option value="selling-fast">Sắp hết hàng</option>
                    <option value="price-asc">Giá thấp đến cao</option>
                    <option value="price-desc">Giá cao đến thấp</option>
                  </select>
                </label>
              </div>

            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
