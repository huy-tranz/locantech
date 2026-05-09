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
  BadgePercent,
  Check,
  ChevronDown,
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

function getSpecEntries(product: Product) {
  return Object.entries(product.specs || {});
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
  const heroSpecs = specEntries.slice(0, 5);
  const featureBullets = getFeatureBullets(product, specEntries).slice(0, 4);
  const savings = product.originalPrice ? Math.max(product.originalPrice - product.price, 0) : 0;
  const monthlyInstallment = Math.ceil(product.price / 12);
  const isPurchasable = product.status === "in_stock";
  const viewCount = getViewCount(product);

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
      <main className="section-container py-4 md:py-6">
        <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Trang chủ
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to={`/${product.category}`} className="hover:text-primary">
            {categoryNames[product.category] || product.category}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="line-clamp-1 font-medium text-foreground">{product.name}</span>
        </nav>

        <section className="rounded-2xl bg-white p-4 shadow-sm md:p-5">
          <h1 className="text-2xl font-black leading-tight text-primary md:text-3xl">{product.name}</h1>

          <div className="mt-4 grid grid-cols-1 gap-5 xl:grid-cols-[440px_minmax(0,1fr)_360px]">
            <div>
              <div className="relative overflow-hidden rounded-sm border-[6px] border-orange-500 bg-white">
                <div className="aspect-square">
                  <img
                    ref={mainImageRef}
                    src={images[selectedImg] || product.image}
                    alt={product.name}
                    className="h-full w-full object-contain p-5"
                  />
                </div>
                {product.discount && product.discount > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-sale via-orange-500 to-yellow-400 px-4 py-2 text-center text-xl font-black uppercase italic text-white">
                    Hot - Giảm {product.discount}%
                  </div>
                )}
              </div>

              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setSelectedImg(i)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-sm border bg-white transition ${
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
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border pb-3 text-sm">
                <span className="inline-flex items-center gap-0.5 text-yellow-500">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
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

              <div className="mt-4">
                <h2 className="text-lg font-black text-foreground">Thông số sản phẩm</h2>
                {heroSpecs.length > 0 ? (
                  <ul className="mt-2 space-y-2 text-sm text-foreground">
                    {heroSpecs.map(([key, val]) => (
                      <li key={key} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                        <span>
                          <b>{key}:</b> {val}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">{product.shortDesc}</p>
                )}
              </div>

              <div className="mt-4 overflow-hidden rounded-xl border border-sale bg-red-50">
                <div className="flex items-center justify-between gap-3 bg-sale px-4 py-2 text-white">
                  <span className="inline-flex items-center gap-2 text-lg font-black">
                    <Gift className="h-5 w-5" />
                    BIG SALE
                  </span>
                  <span className="rounded-full bg-yellow-200 px-4 py-1 text-xs font-black text-slate-950">
                    Còn: {Math.max(product.stock, 0)} sản phẩm
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="text-3xl font-black text-sale">{formatPrice(product.price)}</span>
                    {product.discount && product.discount > 0 && <span className="badge-sale">-{product.discount}%</span>}
                  </div>
                  {product.originalPrice && (
                    <p className="mt-2 text-sm">
                      Giá chưa khuyến mại:{" "}
                      <span className="font-black text-foreground line-through">{formatPrice(product.originalPrice)}</span>
                    </p>
                  )}
                  {savings > 0 && <p className="mt-1 text-sm font-bold text-sale">Tiết kiệm {formatPrice(savings)}</p>}

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-primary">Giá đã bao gồm VAT</span>
                    <span className="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-bold text-primary">Bảo hành theo sản phẩm</span>
                    <span className="rounded-md bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">{getStockText(product)}</span>
                  </div>

                  <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Clock3 className="h-4 w-4 text-sale" />
                    Ưu đãi có hạn, liên hệ để được giữ hàng và tư vấn cấu hình.
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-2">
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={!isPurchasable}
                  className="min-h-12 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-600 px-4 text-base font-black uppercase text-white shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Mua ngay
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleAddCart}
                    disabled={!isPurchasable}
                    className="btn-primary min-h-12 rounded-xl text-base disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    Thêm vào giỏ
                  </button>
                  <a
                    href="tel:0989386219"
                    className="btn-primary min-h-12 rounded-xl bg-blue-600 text-base hover:bg-blue-700"
                  >
                    <Phone className="h-5 w-5" />
                    Tư vấn
                  </a>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-semibold text-muted-foreground">
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
                className="flex w-full items-center justify-between rounded-lg border border-border bg-white px-4 py-3 text-left text-sm font-semibold text-foreground"
              >
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Xem chi nhánh còn hàng
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>

              <div className="overflow-hidden rounded-xl border-2 border-primary bg-white">
                <div className="bg-primary px-4 py-2 text-center text-base font-black text-primary-foreground">
                  Yên Tâm Mua Sắm Tại Lộc An
                </div>
                <div className="space-y-3 p-4 text-sm font-semibold text-foreground">
                  {trustItems.map((item) => (
                    <div key={item} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border-2 border-primary bg-white">
                <div className="bg-primary px-4 py-2 text-center text-base font-black text-primary-foreground">
                  Liên Hệ Kinh Doanh Online
                </div>
                <div className="space-y-3 p-4 text-sm">
                  <a href="tel:0989386219" className="flex items-center gap-2 font-bold text-foreground">
                    <Phone className="h-4 w-4 text-primary" />
                    Hotline Hà Nội: <span className="text-sale">0989.386.219</span>
                  </a>
                  <a
                    href="https://zalo.me/0989386219"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 font-bold text-foreground"
                  >
                    <MessageCircle className="h-4 w-4 text-primary" />
                    Chat Zalo: <span className="text-sale">0989.386.219</span>
                  </a>
                  <p className="flex items-center gap-2 font-bold text-foreground">
                    <Wrench className="h-4 w-4 text-primary" />
                    Hỗ trợ kỹ thuật sau mua
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-primary/30 bg-blue-50 p-4">
                <p className="text-sm font-black text-primary">Ưu đãi mua kèm</p>
                <p className="mt-2 text-sm font-semibold text-foreground">
                  Giảm thêm khi mua chuột, phím, balo, túi chống sốc hoặc nâng cấp RAM/SSD cùng sản phẩm.
                </p>
              </div>
            </aside>
          </div>
        </section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div className="space-y-5">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="border-b border-border pb-3 text-xl font-black text-foreground">Đánh giá {product.name}</h2>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-foreground">
                <p>
                  <b>{product.name}</b> là sản phẩm phù hợp cho khách hàng cần một cấu hình ổn định, dễ sử dụng và được
                  Lộc An hỗ trợ kỹ thuật sau mua.
                </p>
                {featureBullets.map((item, index) => (
                  <div key={item}>
                    <h3 className="font-black text-primary">
                      {index + 1}. {index === 0 ? "Điểm nổi bật" : index === 1 ? "Hiệu năng và cấu hình" : "Dịch vụ tại Lộc An"}
                    </h3>
                    <p className="mt-1 text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="text-xl font-black text-foreground">Đánh giá và bình luận</h2>
              <div className="mt-5 grid gap-5 md:grid-cols-[160px_1fr]">
                <div className="text-center">
                  <div className="text-5xl font-black text-foreground">0.0</div>
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
              <h2 className="text-xl font-black text-foreground">Hỏi đáp sản phẩm</h2>
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
              <h2 className="border-b border-border pb-3 text-xl font-black text-foreground">Thông số kỹ thuật</h2>
              {specEntries.length > 0 ? (
                <>
                  <div className="mt-5 overflow-hidden rounded-sm border border-border">
                    <table className="w-full text-center text-xs">
                      <thead className="bg-slate-50 text-foreground">
                        <tr>
                          <th className="border-b border-r px-2 py-3 font-black">STT</th>
                          <th className="border-b border-r px-2 py-3 font-black">Hạng mục</th>
                          <th className="border-b px-2 py-3 font-black">Thông số</th>
                        </tr>
                      </thead>
                      <tbody>
                        {specEntries.map(([key, val], i) => (
                          <tr key={key} className={i % 2 === 0 ? "bg-blue-50/50" : "bg-white"}>
                            <td className="border-b border-r px-2 py-3 font-bold">{i + 1}</td>
                            <td className="border-b border-r px-2 py-3 font-black uppercase">{key}</td>
                            <td className="border-b px-2 py-3 font-black text-primary">{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <a href="#specs" className="mx-auto mt-5 flex w-fit rounded-full bg-primary px-5 py-2 text-sm font-black text-primary-foreground">
                    Xem tất cả thông số
                  </a>
                </>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">Thông số kỹ thuật đang được cập nhật.</p>
              )}
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black text-foreground">Dịch vụ tại Lộc An</h2>
              <div className="mt-3 space-y-3">
                {servicePolicies.map((policy) => (
                  <div key={policy.title} className="flex gap-3 rounded-lg bg-slate-50 p-3">
                    <policy.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="font-black text-foreground">{policy.title}</p>
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
            <h2 className="mb-4 text-xl font-black text-foreground">Sản phẩm liên quan</h2>
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
    </div>
  );
}
