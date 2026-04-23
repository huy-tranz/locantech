import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/data/products";
import { ChevronRight, Trash2, ShoppingCart, ArrowLeft, Phone } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();
  const shippingFee = totalPrice >= 2000000 ? 0 : 30000;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="section-container py-4 md:py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-muted-foreground mb-4 gap-1.5">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">Giỏ hàng</span>
        </nav>

        <h1 className="text-xl md:text-2xl font-bold text-foreground mb-6">
          Giỏ hàng ({items.length} sản phẩm)
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground mb-4">Giỏ hàng trống</p>
            <Link to="/" className="btn-primary">Tiếp tục mua sắm</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Items list */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <div key={item.product.id} className="bg-card rounded-lg border p-4 flex gap-4">
                  <Link to={`/san-pham/${item.product.slug}`} className="flex-shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 md:w-24 md:h-24 object-contain rounded-lg bg-muted p-2"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/san-pham/${item.product.slug}`} className="text-sm font-medium text-foreground hover:text-primary line-clamp-2">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.product.shortDesc}</p>
                    <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                      <span className="font-bold" style={{ color: "hsl(var(--sale))" }}>
                        {formatPrice(item.product.price)}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2.5 py-1.5 hover:bg-muted text-sm text-foreground"
                          >-</button>
                          <span className="px-3 py-1.5 text-sm font-medium border-x text-foreground">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2.5 py-1.5 hover:bg-muted text-sm text-foreground"
                          >+</button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right mt-1">
                      <span className="text-sm text-muted-foreground">
                        Thành tiền: <span className="font-semibold text-foreground">{formatPrice(item.product.price * item.quantity)}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border p-5 sticky top-28">
                <h2 className="font-bold text-foreground mb-4">Tổng đơn hàng</h2>
                <div className="space-y-3 text-sm mb-4">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tạm tính</span>
                    <span className="text-foreground font-medium">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Phí giao hàng</span>
                    <span className="text-foreground font-medium">
                      {shippingFee === 0 ? <span style={{ color: "hsl(var(--success))" }}>Miễn phí</span> : formatPrice(shippingFee)}
                    </span>
                  </div>
                  {shippingFee > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Miễn phí ship cho đơn từ 2.000.000₫
                    </p>
                  )}
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-bold text-foreground">Tổng thanh toán</span>
                    <span className="font-extrabold text-lg" style={{ color: "hsl(var(--sale))" }}>
                      {formatPrice(totalPrice + shippingFee)}
                    </span>
                  </div>
                </div>

                <Link
                  to="/checkout"
                  className="btn-cta w-full py-3 text-base mb-2 inline-flex items-center justify-center"
                >
                  Thanh toán
                </Link>
                <Link to="/" className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-1">
                  <ArrowLeft className="h-4 w-4" /> Tiếp tục mua
                </Link>

                <div className="mt-4 pt-4 border-t">
                  <a href="tel:0989386219" className="flex items-center justify-center gap-2 text-sm text-primary font-semibold">
                    <Phone className="h-4 w-4" /> Đặt hàng qua điện thoại: 0989.386.219
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
