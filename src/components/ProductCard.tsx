import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { type Product, formatPrice } from "@/data/products";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";
import { BadgePercent, Cpu, Eye, Gift, HardDrive, Headphones, MemoryStick, ShieldCheck, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const detailPath = (slug: string) => `/san-pham/${slug}`;

const TOOLTIP_GAP = 12;
const VIEWPORT_MARGIN = 12;
const SCROLL_SUPPRESS_MS = 450;
const HOVER_SHOW_DELAY_MS = 240;
const HOVER_MOVE_RESET_PX_SQ = 12 * 12;
const TOOLTIP_ESTIMATE_W = 300;
const TOOLTIP_MAX_H = 320;

let scrollSuppressUntilMs = 0;

type TipPos = {
  top: number;
  left?: number;
  right?: number;
};

function stockLabel(status: Product["status"]): string {
  if (status === "in_stock") return "Còn hàng";
  if (status === "coming_soon") return "Sắp về";
  return "Hết hàng";
}

function pickSpec(product: Product, keys: string[]): string | undefined {
  if (!product.specs) return undefined;
  const entries = Object.entries(product.specs);
  const match = entries.find(([key, value]) =>
    keys.some((candidate) => {
      const needle = candidate.toLowerCase();
      return key.toLowerCase().includes(needle) || value.toLowerCase().includes(needle);
    })
  );
  return match?.[1];
}

function buildSpecChips(product: Product) {
  const descParts = product.shortDesc.split(",").map((part) => part.trim()).filter(Boolean);
  const findFromDesc = (patterns: RegExp[]) => descParts.find((part) => patterns.some((pattern) => pattern.test(part)));

  const chips = [
    {
      label: "CPU",
      value:
        pickSpec(product, ["CPU", "Số nhân", "Chip", "Core", "Ryzen", "Apple"]) ||
        findFromDesc([/intel/i, /amd/i, /core\s/i, /ryzen/i, /apple\s/i]),
      icon: Cpu,
    },
    {
      label: "RAM",
      value: pickSpec(product, ["RAM"]) || findFromDesc([/\bram\b/i, /\b\d+\s*gb\s*(ddr)?/i]),
      icon: MemoryStick,
    },
    {
      label: "SSD",
      value: pickSpec(product, ["Ổ cứng", "SSD", "HDD", "NVMe"]) || findFromDesc([/\bssd\b/i, /\bnvme\b/i, /\bhdd\b/i]),
      icon: HardDrive,
    },
    {
      label: "VGA",
      value: pickSpec(product, ["VGA", "VRAM", "GPU", "RTX", "GTX", "RX"]) || findFromDesc([/\brtx\b/i, /\bgtx\b/i, /\brx\s*\d/i]),
      icon: Cpu,
    },
  ];

  const visibleChips = chips.filter((chip) => Boolean(chip.value)).slice(0, 4);
  const isComputerProduct =
    ["laptop", "pc", "pc-gaming"].includes(product.category) || /\b(laptop|pc|gaming|macbook)\b/i.test(product.name);

  if (isComputerProduct && visibleChips.length < 4) {
    return chips.map((chip) => ({ ...chip, value: chip.value || "Cập nhật" })).slice(0, 4);
  }

  return visibleChips;
}

function computeTipPosition(clientX: number, clientY: number): TipPos {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const spaceRight = vw - clientX - TOOLTIP_GAP - VIEWPORT_MARGIN;
  const spaceLeft = clientX - TOOLTIP_GAP - VIEWPORT_MARGIN;
  const placeRight = spaceRight >= TOOLTIP_ESTIMATE_W;

  let top = clientY + TOOLTIP_GAP;
  top = Math.min(top, vh - TOOLTIP_MAX_H - VIEWPORT_MARGIN);
  top = Math.max(VIEWPORT_MARGIN, top);

  if (placeRight) {
    return { top, left: clientX + TOOLTIP_GAP };
  }
  if (spaceLeft < TOOLTIP_ESTIMATE_W) {
    return { top, left: VIEWPORT_MARGIN };
  }
  return { top, right: vw - clientX + TOOLTIP_GAP };
}

function ProductHoverTip({ product, position }: { product: Product; position: TipPos }) {
  const specEntries = product.specs ? Object.entries(product.specs).slice(0, 4) : [];

  return (
    <div
      className="pointer-events-none fixed z-[100] max-h-[min(20rem,80vh)] w-[min(20rem,calc(100vw-1.5rem))] overflow-y-auto rounded-lg border border-neutral-200 bg-white p-3 text-left text-neutral-900 shadow-lg"
      style={{
        top: position.top,
        ...(position.left != null ? { left: position.left } : {}),
        ...(position.right != null ? { right: position.right } : {}),
      }}
      role="tooltip"
    >
      <p className="text-sm font-semibold text-foreground">{product.name}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        <span className="font-medium text-foreground/80">Thương hiệu:</span> {product.brand}
      </p>
      <p className="text-xs text-muted-foreground">
        <span className="font-medium text-foreground/80">Mã SP:</span> {product.sku}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{product.shortDesc}</p>
      {specEntries.length > 0 && (
        <ul className="mt-2 space-y-0.5 border-t border-border/50 pt-2 text-[11px] text-muted-foreground">
          {specEntries.map(([key, value]) => (
            <li key={key}>
              <span className="font-medium text-foreground/70">{key}:</span> {value}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 border-t border-border/50 pt-2 text-xs">
        <span className="font-medium text-foreground/80">Giá:</span>{" "}
        <span className="product-price text-base">{formatPrice(product.price)}</span>
        {product.originalPrice && (
          <span className="product-price-old ml-1.5 text-xs">{formatPrice(product.originalPrice)}</span>
        )}
      </p>
      <p className="text-[11px] font-medium text-foreground/80">{stockLabel(product.status)}</p>
    </div>
  );
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [tipPos, setTipPos] = useState<TipPos | null>(null);
  const specChips = buildSpecChips(product);
  const savings = product.originalPrice ? Math.max(0, product.originalPrice - product.price) : 0;
  const stockPercent = Math.max(12, Math.min(100, product.stock * 8));
  const tipPosRef = useRef<TipPos | null>(null);
  tipPosRef.current = tipPos;

  const pendingCoordsRef = useRef({ x: 0, y: 0 });
  const lastMoveForResetRef = useRef({ x: 0, y: 0 });
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateTip = useCallback((clientX: number, clientY: number) => {
    setTipPos(computeTipPosition(clientX, clientY));
  }, []);

  const clearShowTipTimer = useCallback(() => {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
  }, []);

  const scheduleShowTip = useCallback(() => {
    clearShowTipTimer();
    showTimerRef.current = setTimeout(() => {
      showTimerRef.current = null;
      if (Date.now() < scrollSuppressUntilMs) return;
      const { x, y } = pendingCoordsRef.current;
      updateTip(x, y);
    }, HOVER_SHOW_DELAY_MS);
  }, [clearShowTipTimer, updateTip]);

  useEffect(() => {
    const onUserScrollOrWheel = () => {
      scrollSuppressUntilMs = Date.now() + SCROLL_SUPPRESS_MS;
      clearShowTipTimer();
      setTipPos(null);
    };
    document.addEventListener("scroll", onUserScrollOrWheel, true);
    window.addEventListener("wheel", onUserScrollOrWheel, { passive: true, capture: true });
    return () => {
      document.removeEventListener("scroll", onUserScrollOrWheel, true);
      window.removeEventListener("wheel", onUserScrollOrWheel, { capture: true });
    };
  }, [clearShowTipTimer]);

  useEffect(() => () => clearShowTipTimer(), [clearShowTipTimer]);

  const handlePointerMove = useCallback(
    (event: React.MouseEvent) => {
      pendingCoordsRef.current = { x: event.clientX, y: event.clientY };
      if (Date.now() < scrollSuppressUntilMs) {
        clearShowTipTimer();
        setTipPos(null);
        return;
      }
      if (tipPosRef.current != null) {
        updateTip(event.clientX, event.clientY);
        return;
      }
      const dx = event.clientX - lastMoveForResetRef.current.x;
      const dy = event.clientY - lastMoveForResetRef.current.y;
      if (dx * dx + dy * dy > HOVER_MOVE_RESET_PX_SQ) {
        lastMoveForResetRef.current = { x: event.clientX, y: event.clientY };
        scheduleShowTip();
      }
    },
    [clearShowTipTimer, scheduleShowTip, updateTip]
  );

  const handlePointerEnter = useCallback(
    (event: React.MouseEvent) => {
      pendingCoordsRef.current = { x: event.clientX, y: event.clientY };
      lastMoveForResetRef.current = { x: event.clientX, y: event.clientY };
      if (Date.now() < scrollSuppressUntilMs) return;
      scheduleShowTip();
    },
    [scheduleShowTip]
  );

  const handlePointerLeave = useCallback(() => {
    clearShowTipTimer();
    setTipPos(null);
  }, [clearShowTipTimer]);

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: product.name,
    });
  };

  const quickConsultHref = `tel:0989386219`;

  return (
    <div
      className="card-product group flex h-full flex-col"
      onMouseEnter={handlePointerEnter}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
    >
      {tipPos != null &&
        typeof document !== "undefined" &&
        createPortal(<ProductHoverTip product={product} position={tipPos} />, document.body)}

      <div className="relative flex flex-1 flex-col">
        <Link
          to={detailPath(product.slug)}
          className="relative block aspect-square overflow-hidden bg-gradient-to-br from-slate-100 via-white to-cyan-50 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
        >
          <div className="pointer-events-none absolute inset-x-4 bottom-3 top-8 rounded-full bg-cyan-300/20 blur-2xl transition-opacity duration-300 group-hover:opacity-90" />
          <img
            src={product.image}
            alt={product.name}
            className="relative h-full w-full object-contain p-4 drop-shadow-[0_18px_24px_rgba(15,23,42,0.16)] transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_22px_32px_rgba(15,23,42,0.24)]"
            loading="lazy"
          />
          <div className="pointer-events-none absolute right-2 top-2 rounded-md border border-white/80 bg-white/85 px-2 py-1 text-[10px] font-extrabold text-primary shadow-sm backdrop-blur">
            Bảo hành 36T
          </div>
          <div className="pointer-events-none absolute left-2 top-2 flex flex-col gap-1">
            {product.discount && product.discount > 0 && <span className="badge-sale">-{product.discount}%</span>}
            {product.tags.includes("bán chạy") && <span className="badge-hot">Bán chạy</span>}
            {product.tags.includes("mới") && <span className="badge-new">Mới</span>}
          </div>
          {product.status === "out_of_stock" && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-foreground/50">
              <span className="rounded bg-card px-3 py-1 text-sm font-semibold text-foreground">Hết hàng</span>
            </div>
          )}
        </Link>

        <div className="relative flex flex-1 flex-col p-3">
          <div className="mb-2 flex h-5 items-center justify-between gap-2">
            <span className="truncate text-[10px] font-extrabold uppercase tracking-wider text-primary">{product.brand}</span>
            <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
              {product.sku}
            </span>
          </div>

          <Link
            to={detailPath(product.slug)}
            className="rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <h3 className="mb-1 line-clamp-2 h-[42px] text-sm font-bold text-foreground transition-colors group-hover:text-primary">
              {product.name}
            </h3>
          </Link>
          <p className="mb-2 line-clamp-1 h-[18px] text-xs text-muted-foreground">{product.shortDesc}</p>

          {specChips.length > 0 && (
            <div className="mb-3 grid h-[76px] grid-cols-2 gap-1.5">
              {specChips.map((chip) => {
                const Icon = chip.icon;
                return (
                <span
                  key={chip.label}
                  className="inline-flex min-w-0 items-center gap-1.5 rounded-md border border-primary/10 bg-primary/5 px-2 py-1 text-[10px] font-semibold text-foreground/80"
                  title={`${chip.label}: ${chip.value}`}
                >
                  <Icon className="h-3 w-3 shrink-0 text-primary" />
                  <span className="shrink-0 font-extrabold text-primary">{chip.label}</span>
                  <span className="min-w-0 truncate">{chip.value}</span>
                </span>
                );
              })}
            </div>
          )}

          <div className="mb-3 flex min-h-[26px] flex-wrap gap-1.5">
            <span className="inline-flex min-w-[104px] flex-1 items-center justify-center gap-1 rounded-md border border-sale/20 bg-sale/10 px-2 py-1 text-[10px] font-extrabold text-sale">
              <BadgePercent className="h-3 w-3" />
              Trả góp 0%
            </span>
            <span className="inline-flex min-w-[104px] flex-1 items-center justify-center gap-1 rounded-md border border-trust/20 bg-trust/10 px-2 py-1 text-[10px] font-extrabold text-trust">
              <Gift className="h-3 w-3" />
              Quà tặng
            </span>
          </div>

          <div className="mt-auto h-[68px] overflow-hidden">
            <div className="flex h-[30px] flex-wrap items-baseline gap-x-2 overflow-hidden">
              <span className="product-price">{formatPrice(product.price)}</span>
              {product.originalPrice && <span className="product-price-old">{formatPrice(product.originalPrice)}</span>}
            </div>
            <p className={`mt-0.5 min-h-[16px] text-[11px] font-bold ${savings > 0 ? "text-sale" : "text-transparent"}`}>
              {savings > 0 ? `Tiết kiệm ${formatPrice(savings)}` : "Tiết kiệm 0đ"}
            </p>
            <div className="min-h-[18px]">
              {product.status === "in_stock" && <span className="text-xs font-bold text-success">✓ Còn hàng</span>}
              {product.status === "coming_soon" && <span className="text-xs font-bold text-warning">Sắp về</span>}
              {product.status === "out_of_stock" && <span className="text-xs font-bold text-muted-foreground">Tạm hết hàng</span>}
            </div>
          </div>

          <div className="mt-2 h-[33px]">
            {product.status === "in_stock" ? (
              <>
              <div className="mb-1 flex items-center justify-between text-[10px] font-bold text-muted-foreground">
                <span>Kho sẵn</span>
                <span>{product.stock} sản phẩm</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-gradient-to-r from-success to-accent" style={{ width: `${stockPercent}%` }} />
              </div>
              </>
            ) : (
              <>
                <div className="mb-1 flex items-center justify-between text-[10px] font-bold text-transparent">
                  <span>Kho sẵn</span>
                  <span>0 sản phẩm</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted" />
              </>
            )}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-1.5">
            <Link to={detailPath(product.slug)} className="btn-primary py-2 text-xs">
              <Eye className="mr-1 h-3.5 w-3.5" />
              Chi tiết
            </Link>
            <button
              type="button"
              onClick={handleAddToCart}
              className="btn-cta px-2 py-2 text-xs"
              title="Thêm giỏ hàng"
              aria-label="Thêm vào giỏ hàng"
            >
              <ShoppingCart className="mr-1 h-3.5 w-3.5" />
              <span className="truncate">Thêm giỏ</span>
            </button>
            <a
              href={quickConsultHref}
              className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-lg border border-primary/15 bg-primary/5 px-3 py-2 text-xs font-extrabold text-primary transition-all hover:border-primary/30 hover:bg-primary/10"
            >
              <Headphones className="h-3.5 w-3.5" />
              Tư vấn nhanh
            </a>
          </div>

          <div className="mt-2 flex items-center justify-center gap-1 text-[10px] font-bold text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-trust" />
            Bảo hành rõ ràng, hỗ trợ kỹ thuật
          </div>
        </div>
      </div>
    </div>
  );
}
