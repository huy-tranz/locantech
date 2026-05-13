import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgePercent,
  Camera,
  Clock3,
  Copy,
  Cpu,
  Flame,
  Laptop,
  Monitor,
  ShoppingCart,
  Zap,
} from "lucide-react";
import { formatPrice, type Product } from "@/data/products";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/queries/product.queries";
import { getProductsFromResponse } from "@/lib/productAdapter";
import { flyToCart } from "@/lib/cart-fx";
import { useCarouselAutoplay } from "@/hooks/use-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const saleTabs = [
  { key: "all", label: "Tất cả", icon: Flame, categories: [] },
  { key: "laptop", label: "Laptop", icon: Laptop, categories: ["laptop"] },
  { key: "pc", label: "PC", icon: Monitor, categories: ["pc", "pc-gaming"] },
  { key: "linh-kien", label: "Linh kiện", icon: Cpu, categories: ["linh-kien"] },
  { key: "camera", label: "Camera", icon: Camera, categories: ["camera"] },
] as const;

const coupons = [
  { code: "LOCAN50", value: "Giảm 50k", description: "Đơn từ 3 triệu" },
  { code: "BUILDPC", value: "Ưu đãi combo", description: "PC + màn hình" },
];

type SaleTabKey = (typeof saleTabs)[number]["key"];
type SaleTab = (typeof saleTabs)[number];

function getSaleCountdownParts() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  const totalSeconds = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    { label: "Giờ", value: hours },
    { label: "Phút", value: minutes },
    { label: "Giây", value: seconds },
  ].map((item) => ({ ...item, value: String(item.value).padStart(2, "0") }));
}

function getSaleProgress(product: Product) {
  const seed = product.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const remaining = Math.max(product.status === "in_stock" ? product.stock : 0, 0);
  const estimatedSold = seed % 68 + Math.max(product.discount ?? 0, 0) + (product.bestSeller ? 10 : 0);
  const sold =
    product.soldCount && product.soldCount > 0 ? product.soldCount : Math.max(8, Math.min(76, estimatedSold));
  const total = sold + remaining;
  const percent = total > 0 ? Math.round((sold / total) * 100) : 0;

  return {
    sold,
    remaining,
    percent: Math.max(18, Math.min(96, percent)),
  };
}

function getProductsByTab(products: Product[], tab: SaleTab) {
  if (tab.categories.length === 0) return products;
  const categories = new Set<string>(tab.categories);
  return products.filter((product) => categories.has(product.category));
}

function getProductSpecHighlights(product: Product) {
  if (product.specs) {
    return Object.values(product.specs).slice(0, 4);
  }
  return product.shortDesc
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function SaleCountdown() {
  const [countdown, setCountdown] = useState(() => getSaleCountdownParts());

  useEffect(() => {
    const tick = () => {
      if (document.hidden) return;
      setCountdown(getSaleCountdownParts());
    };
    const timer = window.setInterval(tick, 1000);
    const onVisibilityChange = () => {
      if (!document.hidden) setCountdown(getSaleCountdownParts());
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <div className="flex items-center gap-1 rounded-xl bg-black/20 px-2.5 py-2 backdrop-blur">
      <Clock3 className="mr-1 h-3.5 w-3.5 shrink-0 text-yellow-200" />
      {countdown.map((item, index) => (
        <div key={item.label} className="flex items-center gap-1">
          <span className="flex min-w-[2.5rem] flex-col items-center rounded-lg bg-card px-1.5 py-1 text-sale shadow">
            <span className="font-mono text-base font-semibold leading-none md:text-lg">{item.value}</span>
            <span className="text-[9px] font-medium text-muted-foreground">{item.label}</span>
          </span>
          {index < countdown.length - 1 && (
            <span className="text-xs font-semibold text-yellow-200">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

function FlashSaleDealCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const progress = getSaleProgress(product);
  const savings = Math.max((product.originalPrice ?? product.price) - product.price, 0);
  const isHot = progress.percent >= 70;
  const imageRef = useRef<HTMLImageElement | null>(null);
  const specHighlights = getProductSpecHighlights(product);

  const handleAddToCart = () => {
    flyToCart(imageRef.current, product.image);
    addItem(product);
    toast({ title: "Đã thêm vào giỏ hàng", description: product.name });
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card text-foreground shadow-card transition hover:-translate-y-0.5 hover:border-sale/30 hover:shadow-lg">
      <Link
        to={`/san-pham/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-white"
      >
        <img
          ref={imageRef}
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain p-4 drop-shadow-[0_16px_20px_rgba(15,23,42,0.16)] transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {product.discount ? (
          <span className="absolute left-2 top-2 rounded-full bg-sale px-2.5 py-1 text-xs font-semibold text-white shadow">
            -{product.discount}%
          </span>
        ) : null}
        {isHot && (
          <span className="absolute right-2 top-2 rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
            🔥 Hot
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="truncate text-[10px] font-medium text-primary">{product.brand}</span>
        </div>

        <Link to={`/san-pham/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-5 text-foreground transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>

        {specHighlights.length > 0 && (
          <div className="mt-2 flex min-h-[3.25rem] flex-wrap content-start gap-1">
            {specHighlights.map((spec) => (
              <span
                key={spec}
                className="max-w-full truncate rounded-md bg-muted px-1.5 py-1 text-[10px] font-medium leading-none text-muted-foreground"
                title={spec}
              >
                {spec}
              </span>
            ))}
          </div>
        )}

        <div className="mt-2.5">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-lg font-semibold text-sale">{formatPrice(product.price)}</span>
            {product.originalPrice ? (
              <span className="text-xs font-semibold text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
            ) : null}
          </div>
          {savings > 0 && (
            <p className="mt-0.5 text-[11px] font-medium text-sale">Tiết kiệm {formatPrice(savings)}</p>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-2.5 space-y-1">
          <div className="flex items-center justify-between gap-2 text-[10px] font-medium">
            <span className="text-orange-600">Đã bán: {progress.sold}</span>
            <span className="text-muted-foreground">Còn: {progress.remaining}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sale via-orange-400 to-yellow-400 transition-all duration-500"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          {isHot && (
            <p className="text-[10px] font-semibold text-sale">Sắp hết hàng!</p>
          )}
        </div>

        <div className="mt-auto flex items-center justify-end gap-2 pt-3">
          <Link
            to={`/san-pham/${product.slug}`}
            className="sr-only"
          >
            Chi tiết
          </Link>
          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex h-9 w-10 shrink-0 items-center justify-center rounded-lg bg-sale text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-sale/90"
            aria-label="Thêm vào giỏ hàng"
            title="Thêm vào giỏ hàng"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}

export default function FlashSaleSection() {
  const [activeTab, setActiveTab] = useState<SaleTabKey>("all");
  const { data } = useProducts({ limit: 100 });

  const allSaleProducts = useMemo(
    () =>
      getProductsFromResponse(data)
        .filter((product) => (product.discount ?? 0) > 0)
        .sort((a, b) => (b.discount || 0) - (a.discount || 0)),
    [data],
  );

  const activeTabConfig = saleTabs.find((tab) => tab.key === activeTab) ?? saleTabs[0];
  const filteredProducts = getProductsByTab(allSaleProducts, activeTabConfig);
  const saleProducts = filteredProducts.slice(0, 12);
  const carouselAutoplay = useCarouselAutoplay({
    itemCount: saleProducts.length,
    delayMs: 2800,
    enabled: saleProducts.length > 1,
  });

  if (allSaleProducts.length === 0) return null;

  const maxDiscount = Math.max(...allSaleProducts.map((product) => product.discount || 0));

  const handleCopyCoupon = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({ title: `Đã sao chép mã ${code}` });
    } catch {
      toast({ title: code, description: "Dùng mã này khi đặt hàng để được tư vấn ưu đãi." });
    }
  };

  return (
    <section className="my-4 overflow-hidden rounded-2xl border border-sale/20 bg-card shadow-card md:my-5">
      {/* ── Compact header ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-sale via-orange-500 to-amber-400 px-4 py-3 text-white md:px-5 md:py-3.5">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/15 blur-3xl" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          {/* Branding */}
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-xl font-semibold md:text-2xl">
                <Flame className="h-5 w-5 text-yellow-200" />
                Flash Sale
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-yellow-300 px-2.5 py-1 text-xs font-semibold text-slate-950">
                <BadgePercent className="h-3.5 w-3.5" />
                Giảm tới {maxDiscount}%
              </span>
              <span className="hidden rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-medium backdrop-blur sm:inline-flex">
                Số lượng có hạn
              </span>
            </div>
            <p className="text-[11px] font-semibold text-white/85 md:text-xs">
              Deal công nghệ hôm nay · Giá tốt, hỗ trợ kỹ thuật sau mua tại Lộc An
            </p>
          </div>

          {/* Countdown + CTA */}
          <div className="flex items-center gap-2">
            <SaleCountdown />
            <Link
              to="/flash-sale"
              className="inline-flex items-center gap-1.5 rounded-xl bg-card px-3 py-2 text-xs font-semibold text-sale shadow transition hover:-translate-y-0.5 hover:bg-yellow-50 dark:hover:bg-muted"
            >
              <span className="hidden sm:inline">Xem tất cả</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="bg-card p-3 md:p-4">
        {/* Coupons – compact single row */}
        <div className="mb-3 grid grid-cols-2 gap-2">
          {coupons.map((coupon) => (
            <button
              key={coupon.code}
              type="button"
              onClick={() => handleCopyCoupon(coupon.code)}
              className="group flex items-center justify-between gap-2 rounded-xl border border-dashed border-sale/35 bg-sale/5 px-3 py-2 text-left transition hover:border-sale hover:bg-sale/10"
            >
              <span>
                <span className="block text-[10px] font-semibold text-sale">{coupon.value}</span>
                <span className="block text-sm font-semibold text-foreground">{coupon.code}</span>
                <span className="block text-[10px] font-semibold text-muted-foreground">{coupon.description}</span>
              </span>
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sale text-white transition group-hover:scale-105">
                <Copy className="h-3.5 w-3.5" />
              </span>
            </button>
          ))}
        </div>

        {/* Category tabs */}
        <div className="mb-3 flex gap-2 overflow-x-auto pb-1">
          {saleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.key === activeTab;
            const count = getProductsByTab(allSaleProducts, tab).length;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  isActive
                    ? "border-sale bg-sale text-white shadow-sm"
                    : "border-border bg-muted text-foreground hover:border-sale/40 hover:bg-sale/10"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${isActive ? "bg-white/20" : "bg-card"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Product carousel / grid */}
        {saleProducts.length > 0 ? (
          <>
            <Carousel
              ref={carouselAutoplay.rootRef}
              setApi={carouselAutoplay.setApi}
              opts={{ align: "start", loop: saleProducts.length > 1, dragFree: true, duration: 18 }}
              className="group/flash-sale"
              {...carouselAutoplay.autoplayProps}
            >
              <CarouselContent className="-ml-2 md:-ml-3">
                {saleProducts.map((product) => (
                  <CarouselItem
                    key={product.id}
                    className="basis-[72%] pl-2 sm:basis-[42%] md:basis-1/3 md:pl-3 lg:basis-1/5 xl:basis-1/6"
                  >
                    <FlashSaleDealCard product={product} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-1 hidden border-border bg-card/95 text-sale shadow-md transition hover:bg-card md:inline-flex md:opacity-0 md:group-hover/flash-sale:opacity-100" />
              <CarouselNext className="right-1 hidden border-border bg-card/95 text-sale shadow-md transition hover:bg-card md:inline-flex md:opacity-0 md:group-hover/flash-sale:opacity-100" />
            </Carousel>
            {/* Mobile scroll hint */}
            <div className="mt-2 flex items-center justify-center gap-1.5 md:hidden">
              <Zap className="h-3 w-3 text-sale" />
              <span className="text-[10px] font-medium text-muted-foreground">Vuốt để xem thêm sản phẩm</span>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-border bg-muted px-4 py-8 text-center text-sm font-medium text-muted-foreground">
            Nhóm này chưa có deal đang chạy. Chọn tab khác để xem các sản phẩm đang giảm giá.
          </div>
        )}
      </div>
    </section>
  );
}
