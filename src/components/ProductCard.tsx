import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { type Product, formatPrice } from "@/data/products";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";
import { ShoppingCart, Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const detailPath = (slug: string) => `/san-pham/${slug}`;

const TOOLTIP_GAP = 12;
const VIEWPORT_MARGIN = 12;
/** Sau khi cuộn (hoặc bánh xe), tạm không mở tooltip — tránh “lướt qua” vẫn bật bảng thông tin */
const SCROLL_SUPPRESS_MS = 450;
/** Chờ một nhịp sau khi vào thẻ / gần như dừng di chuột mới mở tooltip */
const HOVER_SHOW_DELAY_MS = 240;
/** Khi chưa mở tooltip, chỉ reset hẹn giờ nếu chuột dịch đủ xa (tránh rung tay làm không bao giờ mở) */
const HOVER_MOVE_RESET_PX_SQ = 12 * 12;

let scrollSuppressUntilMs = 0;
/** Ước lượng để quyết định lật trái/phải (khớp max-w ~ 20rem) */
const TOOLTIP_ESTIMATE_W = 300;
const TOOLTIP_MAX_H = 320;

function stockLabel(status: Product["status"]): string {
  if (status === "in_stock") return "Còn hàng";
  if (status === "coming_soon") return "Sắp về";
  return "Hết hàng";
}

type TipPos = {
  top: number;
  left?: number;
  right?: number;
};

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
  // Bên trái chuột: mép phải panel sát con trỏ; nếu hẹp quá thì neo vào mép viewport
  if (spaceLeft < TOOLTIP_ESTIMATE_W) {
    return { top, left: VIEWPORT_MARGIN };
  }
  return { top, right: vw - clientX + TOOLTIP_GAP };
}

function ProductHoverTip({
  product,
  position,
}: {
  product: Product;
  position: TipPos;
}) {
  const specEntries = product.specs ? Object.entries(product.specs).slice(0, 4) : [];

  return (
    <div
      className="pointer-events-none fixed z-[100] w-[min(20rem,calc(100vw-1.5rem))] max-h-[min(20rem,80vh)] overflow-y-auto rounded-lg border border-neutral-200 bg-white p-3 text-left text-neutral-900 shadow-lg"
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
        <span className="font-medium text-foreground/80">SKU:</span> {product.sku}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{product.shortDesc}</p>
      {specEntries.length > 0 && (
        <ul className="mt-2 space-y-0.5 border-t border-border/50 pt-2 text-[11px] text-muted-foreground">
          {specEntries.map(([k, v]) => (
            <li key={k}>
              <span className="font-medium text-foreground/70">{k}:</span> {v}
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
    (e: React.MouseEvent) => {
      pendingCoordsRef.current = { x: e.clientX, y: e.clientY };
      if (Date.now() < scrollSuppressUntilMs) {
        clearShowTipTimer();
        setTipPos(null);
        return;
      }
      if (tipPosRef.current != null) {
        updateTip(e.clientX, e.clientY);
        return;
      }
      const dx = e.clientX - lastMoveForResetRef.current.x;
      const dy = e.clientY - lastMoveForResetRef.current.y;
      if (dx * dx + dy * dy > HOVER_MOVE_RESET_PX_SQ) {
        lastMoveForResetRef.current = { x: e.clientX, y: e.clientY };
        scheduleShowTip();
      }
    },
    [clearShowTipTimer, scheduleShowTip, updateTip]
  );

  const handlePointerEnter = useCallback(
    (e: React.MouseEvent) => {
      pendingCoordsRef.current = { x: e.clientX, y: e.clientY };
      lastMoveForResetRef.current = { x: e.clientX, y: e.clientY };
      if (Date.now() < scrollSuppressUntilMs) return;
      scheduleShowTip();
    },
    [scheduleShowTip]
  );

  const handlePointerLeave = useCallback(() => {
    clearShowTipTimer();
    setTipPos(null);
  }, [clearShowTipTimer]);

  return (
    <div
      className="card-product group flex flex-col"
      onMouseEnter={handlePointerEnter}
      onMouseMove={handlePointerMove}
      onMouseLeave={handlePointerLeave}
    >
      {tipPos != null &&
        typeof document !== "undefined" &&
        createPortal(<ProductHoverTip product={product} position={tipPos} />, document.body)}

      <div className="relative flex flex-col flex-1">
        {/* Image + badges */}
        <Link
          to={detailPath(product.slug)}
          className="relative block aspect-square overflow-hidden rounded-t-lg bg-muted outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
        >
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="pointer-events-none absolute left-2 top-2 flex flex-col gap-1">
            {product.discount && product.discount > 0 && (
              <span className="badge-sale">-{product.discount}%</span>
            )}
            {product.tags.includes("bán chạy") && (
              <span className="badge-hot">Bán chạy</span>
            )}
            {product.tags.includes("mới") && (
              <span className="badge-new">Mới</span>
            )}
          </div>
          {product.status === "out_of_stock" && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-foreground/50">
              <span className="rounded bg-card px-3 py-1 text-sm font-semibold text-foreground">Hết hàng</span>
            </div>
          )}
        </Link>

        <div className="relative flex flex-1 flex-col p-3">
          <Link
            to={detailPath(product.slug)}
            className="rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <h3 className="mb-1 line-clamp-2 min-h-[40px] text-sm font-medium text-foreground transition-colors group-hover:text-primary">
              {product.name}
            </h3>
          </Link>
          <p className="mb-2 line-clamp-1 text-xs text-muted-foreground">{product.shortDesc}</p>

          <div className="mt-auto">
            <div className="flex items-baseline gap-2">
              <span className="product-price">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="product-price-old">{formatPrice(product.originalPrice)}</span>
              )}
            </div>
            {product.status === "in_stock" && (
              <span className="text-xs font-medium text-success">✓ Còn hàng</span>
            )}
            {product.status === "coming_soon" && (
              <span className="text-xs font-medium text-warning">Sắp về</span>
            )}
          </div>

          <div className="mt-3 flex gap-1.5">
            <Link to={detailPath(product.slug)} className="btn-primary flex-1 py-2 text-xs">
              <Eye className="mr-1 h-3.5 w-3.5" />
              Chi tiết
            </Link>
            <button
              type="button"
              onClick={() => {
                addItem(product);
                toast({
                  title: "Đã thêm vào giỏ hàng",
                  description: product.name,
                });
              }}
              className="btn-cta px-3 py-2 text-xs"
              title="Thêm giỏ hàng"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
