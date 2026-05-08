import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import ProductCard from "@/components/ProductCard";
import { formatPrice } from "@/data/products";
import { useProductBySlug, useProducts } from "@/hooks/queries/product.queries";
import { adaptProduct, getProductsFromResponse } from "@/lib/productAdapter";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";
import { flyToCart } from "@/lib/cart-fx";
import { getCurrentUser } from "@/lib/auth";
import { addRecentlyViewedProduct } from "@/lib/account";
import {
  Check,
  ChevronRight,
  Gift,
  MessageCircle,
  Phone,
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

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading } = useProductBySlug(slug || "");
  const product = data ? adaptProduct(data) : null;
  const { data: relatedRes } = useProducts({ category: product?.category, limit: 6 });
  const related = getProductsFromResponse(relatedRes).filter((p) => p.id !== product?.id).slice(0, 5);
  const { addItem } = useCart();
  const [activeTab, setActiveTab] = useState("desc");
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
          <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
          <Link to="/" className="btn-primary">Về trang chủ</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddCart = () => {
    flyToCart(mainImageRef.current, images[selectedImg] || product.image);
    addItem(product, qty);
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: qty > 1 ? `${product.name} (x${qty})` : product.name,
    });
  };

  const tabs = [
    { id: "desc", label: "Mô tả" },
    { id: "specs", label: "Thông số kỹ thuật" },
    { id: "reviews", label: "Đánh giá" },
    { id: "qa", label: "Hỏi đáp" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="section-container py-4 md:py-6">
        <nav className="flex items-center text-sm text-muted-foreground mb-4 gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to={`/${product.category}`} className="hover:text-primary">
            {categoryNames[product.category] || product.category}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div>
            <div className="relative bg-card rounded-lg border overflow-hidden aspect-square group">
              <img
                ref={mainImageRef}
                src={images[selectedImg] || product.image}
                alt={product.name}
                className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-500"
              />
              {product.discount && product.discount > 0 && (
                <span className="absolute top-3 left-3 badge-sale text-sm">-{product.discount}%</span>
              )}
              {product.tags.includes("bán chạy") && (
                <span className="absolute top-3 right-3 badge-hot text-sm">Bán chạy</span>
              )}
            </div>
            <div className="flex gap-2 mt-3">
              {images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setSelectedImg(i)}
                  className={`w-16 h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-colors ${
                    selectedImg === i ? "border-primary" : "border-border hover:border-primary/50"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain p-1" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground mb-2 leading-tight">{product.name}</h1>
            <p className="text-sm text-muted-foreground mb-1">Mã SP: {product.sku}</p>

            <div className="flex items-baseline gap-3 mb-3 mt-4">
              <span className="text-2xl md:text-3xl font-extrabold" style={{ color: "hsl(var(--sale))" }}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && <span className="product-price-old text-base">{formatPrice(product.originalPrice)}</span>}
              {product.discount && product.discount > 0 && <span className="badge-sale">-{product.discount}%</span>}
            </div>

            {product.status === "in_stock" && (
              <span className="inline-flex items-center gap-1 text-sm font-medium mb-4" style={{ color: "hsl(var(--success))" }}>
                <Check className="h-4 w-4" /> Còn hàng
              </span>
            )}
            {product.status === "coming_soon" && <span className="text-sm font-medium mb-4" style={{ color: "hsl(var(--warning))" }}>Sắp về hàng</span>}
            {product.status === "out_of_stock" && <span className="text-sm font-medium mb-4 text-muted-foreground">Hết hàng</span>}

            <div className="bg-muted rounded-lg p-4 mb-4 mt-3">
              <h3 className="text-sm font-bold text-foreground mb-2 flex items-center gap-1.5">
                <Gift className="h-4 w-4" style={{ color: "hsl(var(--accent))" }} /> Ưu đãi đặc biệt
              </h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>Tặng chuột không dây khi mua online</li>
                <li>Free vệ sinh máy 6 tháng đầu</li>
                <li>Giảm thêm khi mua combo phụ kiện</li>
              </ul>
            </div>

            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {Object.entries(product.specs).slice(0, 6).map(([key, val]) => (
                  <div key={key} className="flex items-start gap-1.5 text-sm">
                    <span className="text-muted-foreground whitespace-nowrap">{key}:</span>
                    <span className="font-medium text-foreground">{val}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-muted transition-colors text-foreground">-</button>
                <span className="px-4 py-2 text-sm font-medium border-x text-foreground">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-3 py-2 hover:bg-muted transition-colors text-foreground">+</button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <button onClick={handleAddCart} className="btn-primary flex-1 py-3 text-base gap-2">
                <ShoppingCart className="h-5 w-5" /> Thêm giỏ hàng
              </button>
              <button onClick={handleAddCart} className="btn-cta flex-1 py-3 text-base gap-2">
                <Zap className="h-5 w-5" /> Mua ngay
              </button>
            </div>

            <div className="flex gap-2 mb-5">
              <a href="tel:0989386219" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-primary text-primary font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-colors">
                <Phone className="h-4 w-4" /> 0989.386.219
              </a>
              <a href="https://zalo.me/0989386219" target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border text-foreground font-semibold text-sm hover:bg-muted transition-colors" style={{ borderColor: "hsl(210,80%,50%)", color: "hsl(210,80%,50%)" }}>
                <MessageCircle className="h-4 w-4" /> Chat Zalo
              </a>
            </div>

            <div className="border-t pt-4 space-y-2.5">
              {[
                { icon: Truck, text: "Giao hàng nhanh tại Hà Đông" },
                { icon: Wrench, text: "Hỗ trợ kỹ thuật trọn đời" },
                { icon: ShieldCheck, text: "Bảo hành chính hãng rõ ràng" },
              ].map((p) => (
                <div key={p.text} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <p.icon className="h-4 w-4 text-primary" />
                  {p.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex gap-0 border-b overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-card rounded-b-lg border border-t-0 p-5 md:p-6">
            {activeTab === "desc" && (
              <div className="prose prose-sm max-w-none text-foreground">
                <h3 className="text-lg font-bold mb-3">Giới thiệu {product.name}</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">{product.shortDesc || "Sản phẩm được phân phối bởi Lộc An, bảo hành đầy đủ và hỗ trợ kỹ thuật tận tâm."}</p>
              </div>
            )}
            {activeTab === "specs" && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <tbody>
                    {Object.entries(product.specs || {}).map(([key, val], i) => (
                      <tr key={key} className={i % 2 === 0 ? "bg-muted/50" : ""}>
                        <td className="px-4 py-3 font-medium text-foreground w-1/3 border-b">{key}</td>
                        <td className="px-4 py-3 text-muted-foreground border-b">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === "reviews" && (
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-extrabold text-foreground">4.8</div>
                    <div className="flex gap-0.5 justify-center my-1">
                      {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="h-4 w-4 fill-warning text-warning" />)}
                    </div>
                    <p className="text-xs text-muted-foreground">12 đánh giá</p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "qa" && (
              <div className="bg-muted rounded-lg p-4">
                <h4 className="text-sm font-bold text-foreground mb-2">Đặt câu hỏi</h4>
                <textarea placeholder="Nhập câu hỏi của bạn..." rows={2} className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground mb-2" />
                <button className="btn-primary text-sm py-2 px-4">
                  <Send className="h-3.5 w-3.5 mr-1" /> Gửi câu hỏi
                </button>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg md:text-xl font-bold text-foreground mb-4">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
