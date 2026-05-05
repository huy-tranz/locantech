import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgePercent,
  Camera,
  CheckCircle2,
  Clock3,
  Copy,
  Cpu,
  Eye,
  Flame,
  Gift,
  Laptop,
  Monitor,
  ShoppingCart,
  Sparkles,
  Zap,
} from "lucide-react";
import { formatPrice, type Product } from "@/data/products";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/queries/product.queries";
import { getProductsFromResponse } from "@/lib/productAdapter";

const saleTabs = [
  { key: "all", label: "Tất cả", icon: Flame, categories: [] },
  { key: "laptop", label: "Laptop", icon: Laptop, categories: ["laptop"] },
  { key: "pc", label: "PC", icon: Monitor, categories: ["pc", "pc-gaming"] },
  { key: "linh-kien", label: "Linh kiện", icon: Cpu, categories: ["linh-kien"] },
  { key: "camera", label: "Camera", icon: Camera, categories: ["camera"] },
] as const;

const coupons = [
  { code: "LOCAN50", value: "Giảm 50k", description: "cho đơn hàng từ 3 triệu" },
  { code: "BUILDPC", value: "Ưu đãi combo", description: "khi mua PC kèm màn hình" },
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
  const sold = product.soldCount && product.soldCount > 0 ? product.soldCount : Math.max(8, Math.min(76, estimatedSold));
  const total = sold + remaining;
  const percent = total > 0 ? Math.round((sold / total) * 100) : 0;

  return {
    sold,
    remaining,
    percent: Math.max(18, Math.min(96, percent)),
  };
}

function getProductsByTab(products: Product[], tab: SaleTab) {
  if (tab.categories.length === 0) {
    return products;
  }

  const categories = new Set<string>(tab.categories);
  return products.filter((product) => categories.has(product.category));
}

function FlashSaleDealCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const progress = getSaleProgress(product);
  const savings = Math.max((product.originalPrice ?? product.price) - product.price, 0);

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: product.name,
    });
  };

  return (
    <article className="group flex h-full min-w-[235px] flex-col overflow-hidden rounded-xl border border-white/20 bg-white text-slate-950 shadow-[0_16px_36px_rgba(15,23,42,0.16)] md:min-w-0">
      <div className="bg-gradient-to-r from-sale via-orange-500 to-yellow-400 px-3 py-2 text-white">
        <div className="mb-1 flex items-center justify-between gap-2 text-[10px] font-black uppercase tracking-wide">
          <span>Đã bán {progress.sold}</span>
          <span>Còn {progress.remaining}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/30">
          <div className="h-full rounded-full bg-white" style={{ width: `${progress.percent}%` }} />
        </div>
      </div>

      <Link to={`/san-pham/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-gradient-to-br from-cyan-50 via-white to-orange-50">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain p-4 drop-shadow-[0_16px_20px_rgba(15,23,42,0.16)] transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {product.discount ? (
          <span className="absolute left-2 top-2 rounded-full bg-sale px-2.5 py-1 text-xs font-black text-white">
            -{product.discount}%
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="truncate text-[10px] font-black uppercase tracking-wider text-primary">{product.brand}</span>
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
            {product.sku}
          </span>
        </div>

        <Link to={`/san-pham/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-black leading-5 text-slate-950 transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-1 text-xs text-slate-500">{product.shortDesc}</p>

        <div className="mt-3">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-lg font-black text-sale">{formatPrice(product.price)}</span>
            {product.originalPrice ? (
              <span className="text-xs font-semibold text-slate-400 line-through">{formatPrice(product.originalPrice)}</span>
            ) : null}
          </div>
          <p className={`mt-0.5 text-[11px] font-bold ${savings > 0 ? "text-sale" : "text-transparent"}`}>
            {savings > 0 ? `Tiết kiệm ${formatPrice(savings)}` : "Tiết kiệm 0đ"}
          </p>
        </div>

        <div className="mt-auto grid grid-cols-[1fr_auto] gap-2 pt-3">
          <Link
            to={`/san-pham/${product.slug}`}
            className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-black text-primary-foreground transition hover:bg-primary/90"
          >
            <Eye className="h-3.5 w-3.5" />
            Chi tiết
          </Link>
          <button
            type="button"
            onClick={handleAddToCart}
            className="inline-flex h-9 w-10 items-center justify-center rounded-lg bg-sale text-white transition hover:bg-sale/90"
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
  const [countdown, setCountdown] = useState(() => getSaleCountdownParts());
  const { data } = useProducts({ limit: 100 });

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getSaleCountdownParts());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const allSaleProducts = useMemo(
    () =>
      getProductsFromResponse(data)
        .filter((product) => (product.discount ?? 0) > 0)
        .sort((a, b) => (b.discount || 0) - (a.discount || 0)),
    [data],
  );

  const activeTabConfig = saleTabs.find((tab) => tab.key === activeTab) ?? saleTabs[0];
  const filteredProducts = getProductsByTab(allSaleProducts, activeTabConfig);
  const saleProducts = filteredProducts.slice(0, 5);

  if (allSaleProducts.length === 0) return null;

  const maxDiscount = Math.max(...allSaleProducts.map((product) => product.discount || 0));
  const totalSavings = saleProducts.reduce(
    (sum, product) => sum + Math.max((product.originalPrice ?? product.price) - product.price, 0),
    0,
  );

  const handleCopyCoupon = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({ title: `Đã sao chép mã ${code}` });
    } catch {
      toast({ title: code, description: "Dùng mã này khi đặt hàng để được tư vấn ưu đãi." });
    }
  };

  return (
    <section className="relative my-6 overflow-hidden rounded-2xl border border-sale/30 bg-gradient-to-br from-[#15051f] via-[#5f0b1f] to-[#ef3f16] p-3 text-white shadow-[0_26px_70px_rgba(220,38,38,0.3)] md:my-8 md:p-5">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_0,transparent_32%),radial-gradient(circle_at_16%_12%,rgba(250,204,21,0.3),transparent_24rem),radial-gradient(circle_at_86%_4%,rgba(34,211,238,0.16),transparent_18rem)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-200/70 to-transparent" />
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 mb-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-extrabold uppercase tracking-widest text-yellow-100 backdrop-blur">
              <Flame className="h-4 w-4 text-yellow-300" />
              Deal công nghệ hôm nay
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-yellow-300 px-3 py-1.5 text-xs font-extrabold uppercase tracking-widest text-slate-950">
              <BadgePercent className="h-4 w-4" />
              Giảm tới {maxDiscount}%
            </span>
          </div>

          <h2 className="text-2xl font-extrabold leading-tight md:text-3xl">
            Flash Sale công nghệ
            <span className="block text-yellow-200">giá tốt, số lượng có hạn</span>
          </h2>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/80">
            Chọn nhanh các sản phẩm đang giảm sâu, có quà tặng và hỗ trợ kỹ thuật sau mua tại Lộc An.
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-extrabold text-white/85 max-sm:hidden">
            {["Số lượng có hạn", "Ưu tiên khách chốt nhanh", `Đang tiết kiệm ${formatPrice(totalSavings)}`].map((item) => (
              <span key={item} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur">
                <CheckCircle2 className="h-3.5 w-3.5 text-yellow-200" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-[auto_auto] lg:min-w-[420px]">
          <div className="rounded-2xl border border-yellow-200/30 bg-black/20 p-2.5 shadow-inner backdrop-blur md:p-3">
            <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-yellow-100">
              <Clock3 className="h-4 w-4" />
              Kết thúc sau
            </div>
            <div className="flex items-center gap-1.5">
              {countdown.map((item, index) => (
                <div key={item.label} className="flex items-center gap-1.5">
                  <span className="flex min-w-[3.65rem] flex-col items-center justify-center rounded-xl bg-white px-2 py-1.5 text-sale shadow-[0_10px_24px_rgba(15,23,42,0.2)] md:min-w-[4.15rem] md:py-2">
                    <span className="font-mono text-xl font-black leading-none md:text-2xl">{item.value}</span>
                    <span className="mt-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">{item.label}</span>
                  </span>
                  {index < countdown.length - 1 && <span className="font-black text-yellow-200">:</span>}
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/flash-sale"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-extrabold text-sale shadow-lg transition-all hover:-translate-y-0.5 hover:bg-yellow-100"
          >
            Xem tất cả ưu đãi
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="relative z-10 mb-3 grid grid-cols-1 gap-2 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="hidden gap-2 sm:grid sm:grid-cols-3 lg:grid-cols-1">
          {[
            { icon: Zap, text: "Giá sale cập nhật mỗi ngày" },
            { icon: Gift, text: "Kèm quà tặng theo sản phẩm" },
            { icon: Sparkles, text: "Ưu tiên tư vấn cấu hình phù hợp" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.text} className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold text-white/90 backdrop-blur">
                <Icon className="h-4 w-4 text-yellow-200" />
                {item.text}
              </div>
            );
          })}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {coupons.map((coupon) => (
            <button
              key={coupon.code}
              type="button"
              onClick={() => handleCopyCoupon(coupon.code)}
              className="group flex items-center justify-between gap-3 rounded-xl border border-dashed border-yellow-200/45 bg-yellow-200/12 px-3 py-2 text-left transition hover:border-yellow-200 hover:bg-yellow-200/20"
            >
              <span>
                <span className="block text-[11px] font-bold uppercase tracking-widest text-yellow-100">{coupon.value}</span>
                <span className="mt-0.5 block text-sm font-black text-white">Nhập {coupon.code}</span>
                <span className="hidden text-[11px] font-semibold text-white/70 sm:block">{coupon.description}</span>
              </span>
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sale transition group-hover:scale-105 md:h-9 md:w-9">
                <Copy className="h-4 w-4" />
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 mb-3 flex gap-2 overflow-x-auto pb-1">
        {[
          ...saleTabs,
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.key === activeTab;
          const count = getProductsByTab(allSaleProducts, tab).length;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-extrabold transition ${
                isActive
                  ? "border-yellow-200 bg-yellow-200 text-slate-950 shadow-lg"
                  : "border-white/15 bg-white/10 text-white/85 hover:border-white/30 hover:bg-white/15"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${isActive ? "bg-slate-950/10" : "bg-white/10"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative z-10 flex snap-x gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 lg:grid-cols-5">
        {saleProducts.length > 0 ? saleProducts.map((product) => (
          <div key={product.id} className="snap-start">
            <FlashSaleDealCard product={product} />
          </div>
        )) : (
          <div className="col-span-full rounded-xl border border-white/15 bg-white/10 px-4 py-8 text-center text-sm font-bold text-white/80 backdrop-blur">
            Nhóm này chưa có deal đang chạy. Chọn tab khác để xem các sản phẩm đang giảm giá.
          </div>
        )}
      </div>
    </section>
  );
}
