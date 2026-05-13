import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import ProductCard from "@/components/ProductCard";
import { formatPrice, type Product } from "@/data/products";
import { useProductBySlug, useProducts } from "@/hooks/queries/product.queries";
import { adaptProduct, getProductsFromResponse } from "@/lib/productAdapter";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";
import { flyToCart } from "@/lib/cart-fx";
import { getCurrentUser } from "@/lib/auth";
import { addRecentlyViewedProduct } from "@/lib/account";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BadgePercent,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  CreditCard,
  Gift,
  Heart,
  MapPin,
  MessageCircle,
  Minus,
  Phone,
  Plus,
  RotateCcw,
  Scale,
  Send,
  ShieldCheck,
  ShoppingCart,
  Star,
  Truck,
  Wrench,
  Zap,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

const categoryNames: Record<string, string> = {
  laptop: "Laptop",
  pc: "PC",
  "pc-gaming": "PC Gaming",
  "linh-kien": "Linh kiện",
  "man-hinh": "Màn hình",
  "thiet-bi-mang": "Thiết bị mạng",
  camera: "Camera",
  "ngoai-vi": "Ngoại vi",
};

const quickActions = [
  { icon: Heart, label: "Yêu thích" },
  { icon: CircleHelp, label: "Hỏi đáp" },
  { icon: Scale, label: "So sánh" },
];

const trustItems = [
  "Kỹ thuật Lộc An tư vấn đúng nhu cầu",
  "Thanh toán linh hoạt, hỗ trợ trả góp",
  "Sản phẩm chính hãng, nguồn gốc rõ ràng",
  "Bảo hành minh bạch theo từng linh kiện",
  "Hỗ trợ cài đặt và kiểm tra sau mua",
];

const servicePolicies = [
  { icon: Truck, title: "Giao nhanh Hà Nội", desc: "Hỗ trợ giao và lắp đặt trong khu vực." },
  { icon: Wrench, title: "Hỗ trợ kỹ thuật", desc: "Tư vấn nâng cấp RAM/SSD, cài đặt cơ bản." },
  { icon: ShieldCheck, title: "Bảo hành rõ ràng", desc: "Kiểm tra tình trạng và phiếu bảo hành khi nhận máy." },
  { icon: RotateCcw, title: "Đổi trả 7 ngày", desc: "Áp dụng theo tình trạng sản phẩm và chính sách cửa hàng." },
];

function TechnicalSpecsTable({ rows, compact = false }: { rows: TechnicalSpecRow[]; compact?: boolean }) {
  return (
    <div className="overflow-hidden border border-border bg-white">
      <table className="w-full table-fixed text-center text-xs">
        <thead className="bg-white text-foreground">
          <tr>
            <th className="w-12 border-b border-r px-2 py-3 font-bold">STT</th>
            <th className="w-20 border-b border-r px-2 py-3 font-bold">MÃ HÀNG</th>
            <th className="border-b border-r px-2 py-3 font-bold">TÊN HÀNG</th>
            <th className="w-28 border-b px-2 py-3 font-bold">THỜI HẠN BẢO HÀNH</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={`${row.code}-${i}`} className={i % 2 === 0 ? "bg-blue-50/70" : "bg-white"}>
              <td className="border-b border-r px-2 py-3 font-bold">{i + 1}</td>
              <td className="border-b border-r px-2 py-3 font-bold uppercase">{row.code}</td>
              <td className={`border-b border-r px-2 py-3 font-bold uppercase text-primary ${compact ? "text-[11px] leading-snug" : ""}`}>
                {row.name}
              </td>
              <td className="border-b px-2 py-3 font-bold uppercase">{row.warranty}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TechnicalSpecsModal({ rows }: { rows: TechnicalSpecRow[] }) {
  return (
    <DialogContent className="max-w-[760px] gap-0 border-0 bg-white p-4 shadow-2xl sm:rounded-none [&>button]:-right-7 [&>button]:-top-7 [&>button]:text-white [&>button]:opacity-90 [&>button]:ring-offset-transparent [&>button:hover]:opacity-100">
      <DialogTitle className="sr-only">Thông số kỹ thuật</DialogTitle>
      <div className="max-h-[75vh] overflow-auto p-1">
        <TechnicalSpecsTable rows={rows} />
      </div>
    </DialogContent>
  );
}

function getSpecEntries(product: Product) {
  return Object.entries(product.specs || {});
}

const heroSpecPriority = [
  { label: "CPU", tests: [/^cpu$/i, /processor/i, /bo xu ly/i, /bộ xử lý/i] },
  { label: "RAM", tests: [/^ram$/i, /memory/i, /bo nho/i, /bộ nhớ/i] },
  { label: "SSD", tests: [/ssd/i, /o cung/i, /ổ cứng/i, /storage/i, /luu tru/i, /lưu trữ/i] },
  { label: "VGA", tests: [/^vga$/i, /^gpu$/i, /card/i, /graphics/i, /do hoa/i, /đồ họa/i] },
];

function normalizeSpecKey(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function isWarrantySpec(key: string) {
  const normalized = normalizeSpecKey(key);
  return /bao hanh|warranty/.test(normalized);
}

function getHeroSpecs(product: Product, specs: [string, string][]) {
  const usedKeys = new Set<string>();
  const picked: [string, string][] = [];
  const shouldShowMissingSpecs = ["laptop", "pc", "pc-gaming"].includes(product.category);

  for (const item of heroSpecPriority) {
    const found = specs.find(([key]) => {
      if (usedKeys.has(key)) return false;
      const normalized = normalizeSpecKey(key);
      return item.tests.some((test) => test.test(key) || test.test(normalized));
    });

    if (found) {
      picked.push([item.label, found[1]]);
      usedKeys.add(found[0]);
    } else if (shouldShowMissingSpecs) {
      picked.push([item.label, "Đang cập nhật"]);
    }
  }

  return picked.slice(0, 4);
}

interface TechnicalSpecRow {
  code: string;
  name: string;
  warranty: string;
}

function getTechnicalSpecs(product: Product, specs: [string, string][]) {
  const warranty = specs.find(([key]) => isWarrantySpec(key))?.[1] || "Theo chính sách";
  const rows = specs
    .filter(([key]) => !isWarrantySpec(key))
    .map(([code, name]) => ({ code, name, warranty }));

  if (rows.length > 0) return rows;

  if (["laptop", "pc", "pc-gaming"].includes(product.category)) {
    return heroSpecPriority.map((item) => ({
      code: item.label,
      name: "Đang cập nhật",
      warranty: "Đang cập nhật",
    }));
  }

  return [];
}

function getStockText(product: Product) {
  if (product.status === "in_stock") return product.stock > 0 ? `Còn ${product.stock} sản phẩm` : "Còn hàng";
  if (product.status === "coming_soon") return "Sắp về hàng";
  return "Tạm hết hàng";
}

function getViewCount(product: Product) {
  const seed = product.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return 180 + (seed % 420);
}

function getFeatureBullets(product: Product, specs: [string, string][]) {
  return [
    product.shortDesc,
    specs.length > 0 ? `Cấu hình nổi bật: ${specs.slice(0, 3).map(([, value]) => value).join(" / ")}` : "",
    product.category === "pc" || product.category === "pc-gaming"
      ? "Phù hợp làm việc, học tập, chơi game và nâng cấp linh hoạt."
      : "Phù hợp học tập, văn phòng, giải trí và làm việc hằng ngày.",
    "Được Lộc An hỗ trợ tư vấn, cài đặt và kỹ thuật sau mua.",
  ].filter(Boolean);
}

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = useProductBySlug(slug || "");
  const product = data ? adaptProduct(data) : null;
  const { data: relatedRes } = useProducts({ category: product?.category, limit: 6 });
  const related = getProductsFromResponse(relatedRes).filter((p) => p.id !== product?.id).slice(0, 5);
  const { addItem } = useCart();
  const [selectedImg, setSelectedImg] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [qty, setQty] = useState(1);
  const mainImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!product) return;
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    addRecentlyViewedProduct(currentUser.id, product.id);
  }, [product]);

  const images = useMemo(() => {
    if (!data) return [];
    const raw = [data.thumbnail, ...(data.images || [])].filter(Boolean) as string[];
    return Array.from(new Set(raw.length ? raw : [product?.image || "/placeholder.svg"]));
  }, [data, product?.image]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="section-container py-20 text-center text-muted-foreground">Đang tải sản phẩm...</main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="section-container py-20 text-center">
          <h1 className="mb-4 text-2xl font-bold">Không tìm thấy sản phẩm</h1>
          <Link to="/" className="btn-primary">
            Về trang chủ
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const specEntries = getSpecEntries(product);
  const heroSpecs = getHeroSpecs(product, specEntries);
  const technicalSpecs = getTechnicalSpecs(product, specEntries);
  const featureBullets = getFeatureBullets(product, specEntries).slice(0, 4);
  const savings = product.originalPrice ? Math.max(product.originalPrice - product.price, 0) : 0;
  const monthlyInstallment = Math.ceil(product.price / 12);
  const isPurchasable = product.status === "in_stock";
  const viewCount = getViewCount(product);

  const openImageZoom = (index: number) => {
    setSelectedImg(index);
    setZoomed(false);
    setZoomOpen(true);
  };

  const changeImage = (direction: -1 | 1) => {
    setSelectedImg((current) => (current + direction + images.length) % images.length);
    setZoomed(false);
  };

  const handleAddCart = () => {
    flyToCart(mainImageRef.current, images[selectedImg] || product.image);
    addItem(product, qty);
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: qty > 1 ? `${product.name} (x${qty})` : product.name,
    });
  };

  const handleBuyNow = () => {
    handleAddCart();
    toast({
      title: "Sản phẩm đã sẵn sàng trong giỏ",
      description: "Bạn có thể kiểm tra đơn và tiến hành thanh toán.",
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20 lg:pb-0">
      <Header />
      <main className="section-container py-3 md:py-4">
        <nav className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Trang chủ
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={`/${product.category}`} className="hover:text-primary">
            {categoryNames[product.category] || product.category}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="line-clamp-1 font-medium text-foreground">{product.name}</span>
        </nav>

        <section className="rounded-xl bg-white p-3 shadow-sm md:p-4">
          <h1 className="text-xl font-bold leading-snug text-primary md:text-2xl">{product.name}</h1>

          <div className="mt-3 grid grid-cols-1 gap-4 xl:grid-cols-[390px_minmax(0,1fr)_330px]">
            <div>
              <button
                type="button"
                onClick={() => openImageZoom(selectedImg)}
                className="relative block w-full overflow-hidden rounded-sm border-[4px] border-orange-500 bg-white text-left"
                aria-label="Phóng to ảnh sản phẩm"
              >
                <div className="aspect-square">
                  <img
                    ref={mainImageRef}
                    src={images[selectedImg] || product.image}
                    alt={product.name}
                    className="h-full w-full object-contain p-4 transition duration-300 hover:scale-105"
                  />
                </div>
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/70 px-2.5 py-1 text-xs font-semibold text-white">
                  <ZoomIn className="h-3.5 w-3.5" />
                  Zoom
                </span>
                {product.discount && product.discount > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-sale via-orange-500 to-yellow-400 px-3 py-1.5 text-center text-base font-bold uppercase italic text-white">
                    Hot - Giảm {product.discount}%
                  </div>
                )}
              </button>

              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => openImageZoom(i)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-sm border bg-white transition ${
                      selectedImg === i ? "border-2 border-primary" : "border-border hover:border-primary/50"
                    }`}
                    aria-label={`Xem ảnh ${i + 1}`}
                  >
                    <img src={img} alt="" className="h-full w-full object-contain p-1" />
                  </button>
                ))}
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 border-b border-border pb-2 text-xs">
                <span className="inline-flex items-center gap-0.5 text-yellow-500">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </span>
                <span className="font-semibold text-muted-foreground">(0)</span>
                <span className="text-muted-foreground">
                  Lượt xem: <b className="text-primary">{viewCount}</b>
                </span>
                <span className="text-muted-foreground">
                  Tình trạng: <b className={isPurchasable ? "text-green-600" : "text-sale"}>{getStockText(product)}</b>
                </span>
              </div>

              <div className="mt-3">
                <h2 className="text-base font-bold text-foreground">Thông số sản phẩm</h2>
                {heroSpecs.length > 0 ? (
                  <ul className="mt-2 space-y-1.5 text-xs text-foreground">
                    {heroSpecs.map(([key, val]) => (
                      <li key={key} className="flex gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                        <span>
                          <b className="font-semibold">{key} :</b> {val}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-xs text-muted-foreground">{product.shortDesc}</p>
                )}
              </div>

              <div className="mt-3 overflow-hidden rounded-lg border border-sale bg-red-50">
                <div className="flex items-center justify-between gap-3 bg-sale px-3 py-1.5 text-white">
                  <span className="inline-flex items-center gap-2 text-base font-bold">
                    <Gift className="h-4 w-4" />
                    BIG SALE
                  </span>
                  <span className="rounded-full bg-yellow-200 px-3 py-0.5 text-[11px] font-bold text-slate-950">
                    Còn: {Math.max(product.stock, 0)} sản phẩm
                  </span>
                </div>

                <div className="p-3">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-2xl font-bold leading-tight text-sale">{formatPrice(product.price)}</span>
                    {product.discount && product.discount > 0 && <span className="badge-sale">-{product.discount}%</span>}
                  </div>
                  {product.originalPrice && (
                    <p className="mt-1.5 text-xs">
                      Giá chưa khuyến mại:{" "}
                      <span className="font-semibold text-foreground line-through">{formatPrice(product.originalPrice)}</span>
                    </p>
                  )}
                  {savings > 0 && <p className="mt-1 text-xs font-bold text-sale">Tiết kiệm {formatPrice(savings)}</p>}

                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-primary">Giá đã bao gồm VAT</span>
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[11px] font-bold text-primary">Bảo hành theo sản phẩm</span>
                    <span className="rounded-md bg-green-50 px-2 py-0.5 text-[11px] font-bold text-green-700">{getStockText(product)}</span>
                  </div>

                  <p className="mt-2.5 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <Clock3 className="h-3.5 w-3.5 text-sale" />
                    Ưu đãi có hạn, liên hệ để được giữ hàng và tư vấn cấu hình.
                  </p>
                </div>
              </div>

              <div className="mt-3 grid gap-2">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={!isPurchasable}
                  className="min-h-10 rounded-lg bg-gradient-to-r from-yellow-400 to-orange-600 px-4 text-sm font-bold uppercase text-white shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Mua ngay
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleAddCart}
                    disabled={!isPurchasable}
                    className="btn-primary min-h-10 rounded-lg text-sm disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Thêm vào giỏ
                  </button>
                  <a
                    href="tel:0989386219"
                    className="btn-primary min-h-10 rounded-lg bg-blue-600 text-sm hover:bg-blue-700"
                  >
                    <Phone className="h-4 w-4" />
                    Tư vấn
                  </a>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-semibold text-muted-foreground">
                <span className="inline-flex items-center gap-2">
                  <Truck className="h-4 w-4 text-primary" />
                  Miễn phí giao hàng nội thành Hà Nội
                </span>
                <span className="inline-flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-primary" />
                  Trả góp từ {formatPrice(monthlyInstallment)}/tháng
                </span>
              </div>
            </div>

            <aside className="space-y-3">
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-md border border-border bg-white px-3 py-2.5 text-left text-xs font-semibold text-foreground"
              >
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  Xem chi nhánh còn hàng
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>

              <div className="overflow-hidden rounded-lg border-2 border-primary bg-white">
                <div className="bg-primary px-3 py-1.5 text-center text-sm font-bold text-primary-foreground">
                  Yên Tâm Mua Sắm Tại Lộc An
                </div>
                <div className="space-y-2.5 p-3 text-xs font-semibold text-foreground">
                  {trustItems.map((item) => (
                    <div key={item} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border-2 border-primary bg-white">
                <div className="bg-primary px-3 py-1.5 text-center text-sm font-bold text-primary-foreground">
                  Liên Hệ Kinh Doanh Online
                </div>
                <div className="space-y-2.5 p-3 text-xs">
                  <a href="tel:0989386219" className="flex items-center gap-2 font-bold text-foreground">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                    Hotline Hà Nội: <span className="text-sale">0989.386.219</span>
                  </a>
                  <a
                    href="https://zalo.me/0989386219"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-bold text-foreground"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-primary" />
                    Chat Zalo: <span className="text-sale">0989.386.219</span>
                  </a>
                  <p className="flex items-center gap-2 font-bold text-foreground">
                    <Wrench className="h-3.5 w-3.5 text-primary" />
                    Hỗ trợ kỹ thuật sau mua
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-primary/30 bg-blue-50 p-3">
                <p className="text-xs font-bold text-primary">Ưu đãi mua kèm</p>
                <p className="mt-1.5 text-xs font-semibold leading-relaxed text-foreground">
                  Giảm thêm khi mua chuột, phím, balo, túi chống sốc hoặc nâng cấp RAM/SSD cùng sản phẩm.
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-5">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="border-b border-border pb-3 text-xl font-bold text-foreground">Đánh giá {product.name}</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-foreground">
                <p>
                  <b>{product.name}</b> là sản phẩm phù hợp cho khách hàng cần một cấu hình ổn định, dễ sử dụng và được
                  Lộc An hỗ trợ kỹ thuật sau mua.
                </p>
                {featureBullets.map((item, index) => (
                  <div key={item}>
                    <h3 className="font-bold text-primary">
                      {index + 1}. {index === 0 ? "Điểm nổi bật" : index === 1 ? "Hiệu năng và cấu hình" : "Dịch vụ tại Lộc An"}
                    </h3>
                    <p className="mt-1 text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold text-foreground">Đánh giá và bình luận</h2>
              <div className="mt-5 grid gap-5 md:grid-cols-[160px_1fr]">
                <div className="text-center">
                  <div className="text-5xl font-bold text-foreground">0.0</div>
                  <p className="mt-1 text-sm text-muted-foreground">0 lượt đánh giá</p>
                  <div className="mt-2 flex justify-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="grid grid-cols-[36px_1fr_20px] items-center gap-2 text-sm text-muted-foreground">
                      <span>{star} ★</span>
                      <div className="h-2 rounded-full bg-slate-200" />
                      <span>0</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="text-xl font-bold text-foreground">Hỏi đáp sản phẩm</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Cần tư vấn cấu hình, nâng cấp RAM/SSD hoặc kiểm tra khả năng chạy phần mềm? Gửi câu hỏi cho Lộc An.
              </p>
              <div className="mt-4 rounded-lg bg-slate-100 p-3">
                <textarea
                  placeholder="Nhập câu hỏi của bạn..."
                  rows={3}
                  className="w-full rounded-lg border bg-white px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="btn-primary mt-2 px-4 py-2 text-sm">
                  <Send className="h-3.5 w-3.5" />
                  Gửi câu hỏi
                </button>
              </div>
            </div>
          </div>

          <aside className="space-y-5">
            <div id="specs" className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="border-b border-border pb-3 text-xl font-bold text-foreground">Thông số kỹ thuật</h2>
              {technicalSpecs.length > 0 ? (
                <>
                  <div className="mt-5">
                    <TechnicalSpecsTable rows={technicalSpecs.slice(0, 8)} compact />
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button type="button" className="mx-auto mt-5 flex w-fit rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground">
                        Xem tất cả thông số
                      </button>
                    </DialogTrigger>
                    <TechnicalSpecsModal rows={technicalSpecs} />
                  </Dialog>
                </>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">Thông số kỹ thuật đang được cập nhật.</p>
              )}
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-foreground">Dịch vụ tại Lộc An</h2>
              <div className="mt-3 space-y-3">
                {servicePolicies.map((policy) => (
                  <div key={policy.title} className="flex gap-3 rounded-lg bg-slate-50 p-3">
                    <policy.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="font-bold text-foreground">{policy.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{policy.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>

        {related.length > 0 && (
          <section className="mt-5 rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-bold text-foreground">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white p-2 shadow-[0_-8px_24px_rgba(15,23,42,0.12)] lg:hidden">
        <div className="grid grid-cols-[auto_auto_1fr] gap-2">
          <a href="tel:0989386219" className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-primary text-primary">
            <Phone className="h-5 w-5" />
          </a>
          <a
            href="https://zalo.me/0989386219"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-blue-500 text-blue-600"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
          <button type="button" onClick={handleBuyNow} disabled={!isPurchasable} className="btn-cta h-11 disabled:opacity-60">
            <Zap className="h-4 w-4" />
            Mua ngay
          </button>
        </div>
      </div>

      <Footer />
      <FloatingActions />

      <Dialog
        open={zoomOpen}
        onOpenChange={(open) => {
          setZoomOpen(open);
          if (!open) setZoomed(false);
        }}
      >
        <DialogContent className="max-w-[96vw] gap-0 border-0 bg-white p-0 shadow-2xl sm:max-w-[1100px]">
          <DialogTitle className="sr-only">Ảnh sản phẩm</DialogTitle>
          <div className="grid max-h-[90vh] grid-rows-[1fr_auto] overflow-hidden">
            <div className="relative flex min-h-[55vh] items-center justify-center bg-slate-50 p-4 md:min-h-[70vh]">
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => changeImage(-1)}
                    className="absolute left-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow transition hover:bg-white"
                    aria-label="Ảnh trước"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={() => changeImage(1)}
                    className="absolute right-3 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow transition hover:bg-white"
                    aria-label="Ảnh sau"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() => setZoomed((value) => !value)}
                className={`h-full max-h-[72vh] w-full overflow-auto ${zoomed ? "cursor-zoom-out" : "cursor-zoom-in"}`}
                aria-label={zoomed ? "Thu nhỏ ảnh" : "Phóng to ảnh"}
              >
                <img
                  src={images[selectedImg] || product.image}
                  alt={product.name}
                  className={`mx-auto h-full max-h-[72vh] w-full object-contain transition-transform duration-200 ${
                    zoomed ? "scale-150" : "scale-100"
                  }`}
                />
              </button>

              <button
                type="button"
                onClick={() => setZoomed((value) => !value)}
                className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-primary shadow"
              >
                {zoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
                {zoomed ? "Thu nhỏ" : "Phóng to"}
              </button>
            </div>

            <div className="flex gap-2 overflow-x-auto border-t bg-white p-3">
              {images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => {
                    setSelectedImg(i);
                    setZoomed(false);
                  }}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-sm border bg-white transition ${
                    selectedImg === i ? "border-2 border-primary" : "border-border hover:border-primary/50"
                  }`}
                  aria-label={`Xem ảnh ${i + 1}`}
                >
                  <img src={img} alt="" className="h-full w-full object-contain p-1" />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
