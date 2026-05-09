import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Camera,
  CheckCircle,
  ChevronRight,
  Cpu,
  Laptop,
  MapPin,
  Monitor,
  Phone,
  RefreshCw,
  Shield,
  Zap,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const pricingData = [
  {
    category: "Laptop văn phòng",
    Icon: Laptop,
    items: [
      { name: "Core i3 thế hệ 7–10, RAM 4–8GB", price: "1.500.000 – 3.500.000đ" },
      { name: "Core i5 thế hệ 7–10, RAM 8GB+", price: "2.500.000 – 5.000.000đ" },
      { name: "Core i5/i7 thế hệ 11–13, RAM 8–16GB", price: "4.000.000 – 8.000.000đ" },
    ],
  },
  {
    category: "Laptop gaming & MacBook",
    Icon: Zap,
    items: [
      { name: "Card GTX 1650 / RTX 3050", price: "3.500.000 – 7.000.000đ" },
      { name: "Card RTX 3060 / RTX 4060", price: "6.000.000 – 12.000.000đ" },
      { name: "MacBook Air / Pro M1 / M2", price: "8.000.000 – 16.000.000đ" },
    ],
  },
  {
    category: "PC Desktop",
    Icon: Monitor,
    items: [
      { name: "PC văn phòng (Core i3–i5)", price: "1.000.000 – 3.500.000đ" },
      { name: "PC gaming (Core i5–i7 + GPU rời)", price: "3.000.000 – 9.000.000đ" },
      { name: "Workstation (Xeon / Threadripper)", price: "Thương lượng trực tiếp" },
    ],
  },
  {
    category: "Linh kiện & phụ kiện",
    Icon: Cpu,
    items: [
      { name: "RAM DDR4 8GB / 16GB", price: "200.000 – 600.000đ" },
      { name: "SSD 256GB – 1TB", price: "300.000 – 1.200.000đ" },
      { name: "Màn hình 24\" FHD / 27\" QHD", price: "500.000 – 2.500.000đ" },
      { name: "GPU tầm trung (GTX 1060 – RTX 3060)", price: "800.000 – 5.000.000đ" },
    ],
  },
];

const grades = [
  {
    grade: "A",
    label: "Như mới",
    colorClass: "text-green-700 bg-green-50 border-green-200",
    desc: "Máy mới mua, ít dùng, không trầy xước, pin trên 90%, đủ phụ kiện",
    bonus: "+15–20% so với giá chuẩn",
  },
  {
    grade: "B",
    label: "Tốt",
    colorClass: "text-blue-700 bg-blue-50 border-blue-200",
    desc: "Máy còn tốt, trầy xước nhẹ, hoạt động ổn định, pin 70–90%",
    bonus: "Giá chuẩn theo bảng",
  },
  {
    grade: "C",
    label: "Trung bình",
    colorClass: "text-orange-700 bg-orange-50 border-orange-200",
    desc: "Vỏ trầy nhiều, pin 50–70%, một số lỗi nhỏ (bàn phím, loa...)",
    bonus: "Giảm 20–35% so với giá chuẩn",
  },
  {
    grade: "D",
    label: "Hỏng / cần sửa",
    colorClass: "text-red-700 bg-red-50 border-red-200",
    desc: "Máy hỏng nguồn, màn hình, mainboard hoặc hư hỏng nặng",
    bonus: "Thương lượng theo tình trạng",
  },
];

const steps = [
  {
    Icon: Camera,
    title: "Gửi ảnh hoặc mang máy đến",
    desc: "Chụp ảnh 4 góc + thông số máy (CPU, RAM, SSD) gửi qua Zalo 0989.386.219, hoặc mang trực tiếp đến cửa hàng tại Hà Nội.",
  },
  {
    Icon: CheckCircle,
    title: "Kiểm tra miễn phí",
    desc: "Kỹ thuật viên kiểm tra toàn diện: màn hình, bàn phím, pin, ổ cứng, card đồ họa, cổng kết nối. Không mất phí dù không bán.",
  },
  {
    Icon: Banknote,
    title: "Nhận báo giá ngay",
    desc: "Báo giá rõ ràng trong vòng 15 phút. Không ép buộc, không trả giá lòng vòng. Bạn có toàn quyền từ chối.",
  },
  {
    Icon: RefreshCw,
    title: "Nhận tiền mặt hoặc đổi máy mới",
    desc: "Đồng ý giá → nhận tiền mặt ngay tại chỗ. Hoặc dùng số tiền đó để mua máy mới tại Lộc An và được giảm thêm 200.000–500.000đ.",
  },
];

const faqs = [
  {
    q: "Máy không có hộp, phụ kiện có thu không?",
    a: "Vẫn thu được. Hộp và phụ kiện đầy đủ sẽ được cộng thêm giá trị, nhưng không phải điều kiện bắt buộc.",
  },
  {
    q: "Máy đã cài lại Windows, xóa dữ liệu rồi có sao không?",
    a: "Không sao. Bạn nên xóa sạch dữ liệu cá nhân trước khi mang đến. Lộc An cũng hỗ trợ cài lại Windows miễn phí trước khi giao cho chủ mới.",
  },
  {
    q: "Có thể định giá online qua ảnh không?",
    a: "Có. Gửi ảnh 4 góc + thông số máy qua Zalo 0989.386.219. Chúng tôi báo giá sơ bộ trong 30 phút.",
  },
  {
    q: "Thu mua tận nơi không?",
    a: "Hỗ trợ thu tận nơi trong khu vực Hà Nội với đơn từ 5 triệu trở lên. Liên hệ trước để đặt lịch.",
  },
  {
    q: "Nếu mua máy mới tại Lộc An có ưu đãi thêm không?",
    a: "Có. Khách thu cũ đổi mới tại Lộc An được giảm thêm 200.000–500.000đ trên giá máy mới, tùy sản phẩm.",
  },
];

const relatedLinks = [
  { label: "Nâng cấp SSD, RAM", href: "/dich-vu/nang-cap-ssd-ram" },
  { label: "Sửa chữa laptop", href: "/dich-vu/sua-laptop" },
  { label: "Mua laptop mới", href: "/laptop" },
  { label: "Mua PC mới", href: "/pc" },
];

type FormState = { name: string; phone: string; device: string; note: string };

export default function ThuCuDoiMoiPage() {
  const [form, setForm] = useState<FormState>({ name: "", phone: "", device: "", note: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Đã nhận yêu cầu định giá!", description: "Lộc An sẽ liên hệ trong vòng 30 phút." });
    setForm({ name: "", phone: "", device: "", note: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="section-container py-4 md:py-6">

        {/* Breadcrumb */}
        <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/dich-vu" className="hover:text-primary">Dịch vụ</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">Thu cũ đổi mới</span>
        </nav>

        {/* Hero */}
        <div className="relative mb-8 overflow-hidden rounded-2xl p-6 text-white md:p-10 header-bg">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-accent/20 blur-2xl" />
          <div className="relative z-10 flex flex-col items-center gap-6 md:flex-row">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <RefreshCw className="h-10 w-10 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <p className="mb-1 text-xs font-extrabold uppercase tracking-widest text-white/70">Dịch vụ Lộc An</p>
              <h1 className="text-2xl font-black tracking-tight md:text-3xl lg:text-4xl">Thu cũ · Đổi mới</h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/85 md:text-base">
                Định giá minh bạch — Nhận tiền mặt ngay tại chỗ — Đổi máy mới ưu đãi hơn.
                Không ép buộc, không trả giá lòng vòng.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-3 md:justify-start">
                <a href="tel:0989386219" className="btn-cta flex items-center gap-2">
                  <Phone className="h-4 w-4" /> Gọi định giá ngay
                </a>
                <a
                  href="https://zalo.me/0989386219"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
                >
                  Gửi ảnh qua Zalo
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              Icon: Banknote,
              title: "Thanh toán tiền mặt ngay",
              desc: "Không chờ đợi, không chuyển khoản treo. Nhận tiền ngay khi đồng ý giá.",
            },
            {
              Icon: BadgeCheck,
              title: "Định giá minh bạch",
              desc: "Báo giá rõ từng hạng mục. Bạn có toàn quyền từ chối, không mất phí kiểm tra.",
            },
            {
              Icon: Shield,
              title: "Ưu đãi khi mua máy mới",
              desc: "Giảm thêm 200.000–500.000đ khi đổi lên máy mới tại Lộc An.",
            },
          ].map((item) => (
            <div key={item.title} className="brand-section flex items-start gap-4 p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <item.Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-extrabold text-foreground">{item.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">

            {/* Pricing table */}
            <section className="rounded-xl border bg-card p-5">
              <h2 className="mb-1 text-lg font-extrabold text-foreground">💰 Khung giá thu mua tham khảo</h2>
              <p className="mb-4 text-xs text-muted-foreground">Áp dụng cho máy tình trạng tốt (Grade B). Điều chỉnh theo thực tế.</p>
              <div className="space-y-5">
                {pricingData.map((group) => (
                  <div key={group.category}>
                    <div className="mb-2 flex items-center gap-2">
                      <group.Icon className="h-4 w-4 text-primary" />
                      <span className="text-sm font-extrabold text-foreground">{group.category}</span>
                    </div>
                    <div className="overflow-hidden rounded-lg border">
                      <table className="w-full text-sm">
                        <tbody>
                          {group.items.map((item, i) => (
                            <tr key={i} className="border-b last:border-0 even:bg-muted/40">
                              <td className="px-4 py-2.5 text-muted-foreground">{item.name}</td>
                              <td className="whitespace-nowrap px-4 py-2.5 text-right font-bold" style={{ color: "hsl(var(--sale))" }}>
                                {item.price}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">* Giá biến động theo thị trường. Liên hệ để được báo giá chính xác nhất.</p>
            </section>

            {/* Condition grades */}
            <section className="rounded-xl border bg-card p-5">
              <h2 className="mb-4 text-lg font-extrabold text-foreground">📋 Tiêu chí đánh giá tình trạng máy</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {grades.map((g) => (
                  <div key={g.grade} className={`rounded-xl border p-4 ${g.colorClass}`}>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-current/10 text-sm font-black">
                        {g.grade}
                      </span>
                      <span className="font-extrabold">{g.label}</span>
                    </div>
                    <p className="mb-1.5 text-xs leading-relaxed opacity-80">{g.desc}</p>
                    <p className="text-xs font-bold">{g.bonus}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Process */}
            <section className="rounded-xl border bg-card p-5">
              <h2 className="mb-5 text-lg font-extrabold text-foreground">🔄 Quy trình thu mua</h2>
              <div className="space-y-1">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground">
                        {i + 1}
                      </span>
                      {i < steps.length - 1 && <div className="my-1 w-0.5 flex-1 bg-border" />}
                    </div>
                    <div className="pb-5">
                      <div className="flex items-center gap-2 font-extrabold text-foreground">
                        <step.Icon className="h-4 w-4 text-primary" />
                        {step.title}
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section className="rounded-xl border bg-card p-5">
              <h2 className="mb-4 text-lg font-extrabold text-foreground">❓ Câu hỏi thường gặp</h2>
              <div className="space-y-4">
                {faqs.map((f, i) => (
                  <div key={i}>
                    <p className="text-sm font-extrabold text-foreground">{f.q}</p>
                    <p className="mt-1 border-l-2 border-primary/30 pl-4 text-sm leading-relaxed text-muted-foreground">
                      {f.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-4">

              {/* Quote form */}
              <div className="rounded-xl border bg-card p-5">
                <h3 className="mb-1 text-center text-base font-extrabold text-foreground">Định giá máy online</h3>
                <p className="mb-4 text-center text-xs text-muted-foreground">Gửi thông tin — nhận báo giá trong 30 phút</p>
                <form className="space-y-3" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Họ và tên *"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="tel"
                    placeholder="Số điện thoại / Zalo *"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    placeholder="Tên máy (VD: Laptop Dell i5 gen 10)"
                    value={form.device}
                    onChange={(e) => setForm({ ...form, device: e.target.value })}
                    className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <textarea
                    placeholder="Mô tả thêm: RAM, SSD, tình trạng pin, trầy xước..."
                    rows={3}
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button type="submit" className="btn-cta w-full py-3 text-sm">
                    Gửi yêu cầu định giá
                  </button>
                </form>
                <div className="mt-4 border-t pt-4 text-center">
                  <p className="mb-2 text-xs text-muted-foreground">Hoặc gọi / nhắn Zalo trực tiếp</p>
                  <a href="tel:0989386219" className="flex items-center justify-center gap-2 text-lg font-black text-primary">
                    <Phone className="h-5 w-5" /> 0989.386.219
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="rounded-xl border bg-card p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-extrabold text-foreground">Lộc An — Hà Đông, Hà Nội</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      Mang máy đến trực tiếp để được định giá và nhận tiền ngay trong ngày.
                    </p>
                    <Link to="/lien-he" className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-accent">
                      Xem bản đồ <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Related services */}
              <div className="rounded-xl border bg-card p-4">
                <p className="mb-3 text-sm font-extrabold text-foreground">Dịch vụ liên quan</p>
                <div className="space-y-2">
                  {relatedLinks.map((s) => (
                    <Link
                      key={s.href}
                      to={s.href}
                      className="flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"
                    >
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-primary/50" />
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
