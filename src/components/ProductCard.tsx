import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { type Product, formatPrice } from "@/data/products";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";
import { flyToCart } from "@/lib/cart-fx";
import { BadgePercent, ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  compact?: boolean;
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

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const { addItem } = useCart();
  const [tipPos, setTipPos] = useState<TipPos | null>(null);
  const savings = product.originalPrice ? Math.max(0, product.originalPrice - product.price) : 0;
  const specHighlights = getProductSpecHighlights(product);
  const tipPosRef = useRef<TipPos | null>(null);
  tipPosRef.current = tipPos;

  const pendingCoordsRef = useRef({ x: 0, y: 0 });
  const lastMoveForResetRef = useRef({ x: 0, y: 0 });
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

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
    flyToCart(imageRef.current, product.image);
    addItem(product);
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: product.name,
    });
  };

  return (
    <div
      className="card-product group flex h-full flex-col"
    >
      {tipPos != null &&
        typeof document !== "undefined" &&
        createPortal(<ProductHoverTip product={product} position={tipPos} />, document.body)}

      <div className="relative flex flex-1 flex-col">
        <Link
          to={detailPath(product.slug)}
          className="relative block aspect-square overflow-hidden bg-gradient-to-br from-slate-100 via-white to-cyan-50 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
          onMouseEnter={handlePointerEnter}
          onMouseMove={handlePointerMove}
          onMouseLeave={handlePointerLeave}
        >
          <div className="pointer-events-none absolute inset-x-4 bottom-3 top-8 rounded-full bg-cyan-300/20 blur-2xl transition-opacity duration-300 group-hover:opacity-90" />
          <img
            ref={imageRef}
            src={product.image}
            alt={product.name}
            className={`relative h-full w-full object-contain drop-shadow-[0_18px_24px_rgba(15,23,42,0.16)] transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_22px_32px_rgba(15,23,42,0.24)] ${
              compact ? "p-3" : "p-4"
            }`}
            loading="lazy"
          />
          {product.discount && product.discount > 0 && (
            <div className="pointer-events-none absolute left-2 top-2">
              <span className="badge-sale">-{product.discount}%</span>
            </div>
          )}
          {product.status === "out_of_stock" && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-foreground/50">
              <span className="rounded bg-card px-3 py-1 text-sm font-semibold text-foreground">Hết hàng</span>
            </div>
          )}
        </Link>

        <div className={`relative flex flex-1 flex-col ${compact ? "p-2.5" : "p-3"}`}>
          <div className={`${compact ? "mb-1 h-4" : "mb-2 h-5"} flex items-center justify-between gap-2`}>
            <span className="truncate text-[10px] font-medium text-primary">{product.brand}</span>
          </div>

          <Link
            to={detailPath(product.slug)}
            className="rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <h3
              className={`line-clamp-2 font-medium text-foreground transition-colors group-hover:text-primary ${
                compact ? "mb-2 h-10 text-[13px] leading-5" : "mb-3 h-[42px] text-sm leading-5"
              }`}
            >
              {product.name}
            </h3>
          </Link>

          {specHighlights.length > 0 && !compact && (
            <div className="mb-3 flex min-h-[3.25rem] flex-wrap content-start gap-1">
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

          <div className="mt-auto">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className={`product-price ${compact ? "text-[17px]" : "text-xl"}`}>{formatPrice(product.price)}</span>
              {product.originalPrice && <span className="product-price-old">{formatPrice(product.originalPrice)}</span>}
            </div>
            <p className={`mt-0.5 min-h-[16px] text-[11px] font-medium ${savings > 0 ? "text-sale" : "text-transparent"}`}>
              {savings > 0 ? `Tiết kiệm ${formatPrice(savings)}` : "Tiết kiệm 0đ"}
            </p>
            <div className={`${compact ? "mt-1 min-h-[22px]" : "mt-1.5 min-h-[24px]"}`}>
              <span className="inline-flex items-center gap-1 rounded-md border border-sale/20 bg-sale/10 px-2 py-1 text-[10px] font-medium text-sale">
                <BadgePercent className="h-3 w-3" />
                Trả góp 0%
              </span>
            </div>
          </div>

          <div className={`${compact ? "mt-2" : "mt-3"} flex items-center justify-end gap-2`}>
            <Link to={detailPath(product.slug)} className="sr-only">
              Chi tiết
            </Link>
            <button
              type="button"
              onClick={handleAddToCart}
              className={`inline-flex shrink-0 items-center justify-center rounded-lg bg-sale text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-sale/90 ${
                compact ? "h-8 w-9" : "h-9 w-10"
              }`}
              title="Thêm giỏ hàng"
              aria-label="Thêm vào giỏ hàng"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
