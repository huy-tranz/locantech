import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import { useCart } from "@/hooks/use-cart";
import { useGuestCreateOrder } from "@/hooks/queries/order.queries";
import { formatPrice } from "@/data/products";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, Phone, Package, Truck, CreditCard, ArrowLeft } from "lucide-react";

type PaymentMethod = "cod" | "bank";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();

  const shippingFee = useMemo(
    () => (totalPrice >= 2000000 ? 0 : 30000),
    [totalPrice]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [savedOrder, setSavedOrder] = useState<{ orderNumber: string } | null>(null);

  const createOrder = useGuestCreateOrder();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    note: "",
    paymentMethod: "cod" as PaymentMethod,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ tên";

    const phoneClean = form.phone.replace(/\s/g, "");
    if (!phoneClean) newErrors.phone = "Vui lòng nhập số điện thoại";
    else if (!/^(0[0-9]{9,10})$/.test(phoneClean)) newErrors.phone = "Số điện thoại không hợp lệ";

    if (!form.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const orderPayload = {
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: Number(item.product.price),
          productName: item.product.name,
          productSku: item.product.sku || item.product.id,
          productImage: item.product.image,
        })),
        paymentMethod: form.paymentMethod === "cod" ? "COD" : "BANK_TRANSFER",
        shippingFee,
        recipientName: form.fullName,
        recipientPhone: form.phone.replace(/\s/g, ""),
        shippingAddress: form.address,
        note: form.note || undefined,
      };

      const result = await createOrder.mutateAsync(orderPayload);
      clearCart();
      setSavedOrder({ orderNumber: result.orderNumber });
      setOrderSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });

      toast({
        title: "Đặt hàng thành công",
        description: `Mã đơn: ${result.orderNumber}`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Đã xảy ra lỗi, vui lòng thử lại";
      toast({ title: "Lỗi đặt hàng", description: message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="section-container py-16 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground mb-4">Giỏ hàng trống</p>
          <Link to="/" className="btn-primary inline-block">
            Tiếp tục mua sắm
          </Link>
        </main>
        <Footer />
        <FloatingActions />
      </div>
    );
  }

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="section-container py-8 md:py-12">
          <div className="max-w-xl mx-auto text-center">
            <div className="bg-card rounded-xl border p-8 md:p-10">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Đặt hàng thành công!
              </h1>
              <p className="text-muted-foreground mb-1">
                Cảm ơn bạn đã đặt hàng tại <strong>Lộc An</strong>
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Mã đơn hàng:{" "}
                <span className="font-bold text-foreground">{savedOrder?.orderNumber}</span>
              </p>

              <div className="space-y-3">
                <Link
                  to="/"
                  className="btn-primary w-full inline-block py-3 text-base"
                >
                  Tiếp tục mua sắm
                </Link>
                <Link
                  to="/gio-hang"
                  className="btn-outline w-full inline-block py-2.5"
                >
                  Quay lại giỏ hàng
                </Link>
              </div>

              <div className="bg-accent/5 rounded-lg p-4 text-left mt-6">
                <div className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  Xác nhận đơn hàng
                </div>
                <p className="text-sm text-muted-foreground mb-0.5">
                  Nhân viên Lộc An sẽ gọi điện xác nhận đơn trong{" "}
                  <strong className="text-foreground">5 - 15 phút</strong>.
                </p>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-primary font-semibold">
                <ArrowLeft className="h-4 w-4" />
                Nếu cần hỗ trợ ngay, gọi: 0989.386.219
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <FloatingActions />
      </div>
    );
  }

  const totalPayment = totalPrice + shippingFee;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="section-container py-4 md:py-6">
        <nav className="flex items-center text-sm text-muted-foreground mb-4 gap-1.5">
          <Link to="/" className="hover:text-primary">
            Trang chủ
          </Link>
          <Truck className="h-3.5 w-3.5" />
          <Link to="/gio-hang" className="hover:text-primary">
            Giỏ hàng
          </Link>
          <span className="text-foreground font-medium">Thanh toán</span>
        </nav>

        <h1 className="text-xl md:text-2xl font-bold text-foreground mb-6">
          Thanh toán
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-card rounded-lg border p-5">
                <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  Thông tin giao hàng
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-foreground mb-1.5 block">
                      Họ và tên <span className="text-destructive">*</span>
                    </label>
                    <input
                      name="fullName"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="Nguyễn Văn A"
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.fullName ? "border-destructive" : ""
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground mb-1.5 block">
                      Số điện thoại <span className="text-destructive">*</span>
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="0912 345 678"
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.phone ? "border-destructive" : ""
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-foreground mb-1.5 block">
                      Email (không bắt buộc)
                    </label>
                    <input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="email@gmail.com"
                      className="w-full px-4 py-2.5 rounded-lg border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-foreground mb-1.5 block">
                      Địa chỉ cụ thể <span className="text-destructive">*</span>
                    </label>
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Số nhà, tên đường..."
                      className={`w-full px-4 py-2.5 rounded-lg border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.address ? "border-destructive" : ""
                      }`}
                    />
                    {errors.address && (
                      <p className="text-xs text-destructive mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-foreground mb-1.5 block">
                      Ghi chú đơn hàng
                    </label>
                    <textarea
                      name="note"
                      value={form.note}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                      className="w-full px-4 py-2.5 rounded-lg border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-lg border p-5">
                <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Phương thức thanh toán
                </h2>

                <div className="space-y-3">
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                      form.paymentMethod === "cod"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={form.paymentMethod === "cod"}
                      onChange={() =>
                        setForm((prev) => ({ ...prev, paymentMethod: "cod" }))
                      }
                      className="mt-0.5 accent-primary"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-foreground">
                        Thanh toán khi nhận hàng (COD)
                      </span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Trả tiền mặt hoặc chuyển khoản khi nhận được hàng
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                      COD
                    </span>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-lg border cursor-pointer transition-all ${
                      form.paymentMethod === "bank"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={form.paymentMethod === "bank"}
                      onChange={() =>
                        setForm((prev) => ({ ...prev, paymentMethod: "bank" }))
                      }
                      className="mt-0.5 accent-primary"
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium text-foreground">
                        Chuyển khoản ngân hàng
                      </span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Sau khi đặt hàng, nhân viên sẽ gửi thông tin thanh toán
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-foreground whitespace-nowrap">
                      Ngân hàng
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border p-5 sticky top-28">
                <h2 className="font-bold text-foreground mb-4">
                  Đơn hàng của bạn
                </h2>

                <div className="space-y-3 max-h-64 overflow-y-auto mb-4 pr-1">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-14 h-14 object-contain rounded-lg bg-muted p-1"
                        />
                        {/* Badge đặt không top âm để tránh bị cắt khi container có `overflow-y-auto` */}
                        <span className="absolute top-0 -right-1.5 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground line-clamp-2 leading-tight">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatPrice(item.product.price)} × {item.quantity}
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-foreground whitespace-nowrap">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-3 space-y-2.5 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tạm tính</span>
                    <span className="text-foreground font-medium">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Phí giao hàng</span>
                    <span className="text-foreground font-medium">
                      {shippingFee === 0 ? (
                        <span className="text-green-600">Miễn phí</span>
                      ) : (
                        formatPrice(shippingFee)
                      )}
                    </span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className="font-bold text-foreground">
                      Tổng thanh toán
                    </span>
                    <span
                      className="font-extrabold text-base"
                      style={{ color: "hsl(var(--sale))" }}
                    >
                      {formatPrice(totalPayment)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex items-center gap-2 text-xs text-muted-foreground">
                  <Package className="h-4 w-4 text-primary" />
                  Đặt hàng xong bạn sẽ nhận cuộc gọi xác nhận.
                </div>

                <div className="mt-4 space-y-2.5">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-cta w-full py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                  </button>
                  <Link
                    to="/gio-hang"
                    className="btn-outline w-full py-2.5 text-sm flex items-center justify-center gap-1"
                  >
                    <ArrowLeft className="h-4 w-4" /> Quay lại giỏ hàng
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}

