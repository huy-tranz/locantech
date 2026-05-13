import { useState } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BriefcaseBusiness,
  Camera,
  Cpu,
  Gamepad2,
  Gift,
  GraduationCap,
  HardDrive,
  Monitor,
  MonitorCog,
  PencilRuler,
  RadioTower,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

type NeedTabKey = "gaming" | "work" | "laptop";

interface NeedItem {
  title: string;
  specs: string[];
  price: string;
  priceNote?: string;
  gift?: string;
  badge?: string;
  href: string;
  icon: LucideIcon;
  cardGradient: string;   // gradient on the top visual area
  iconRing: string;       // icon wrapper bg/border
  priceStyle: string;     // price pill classes
  ctaStyle: string;       // CTA button classes
}

interface NeedGroup {
  key: NeedTabKey;
  label: string;
  tagline: string;
  trust: string[];
  items: NeedItem[];
}

const needGroups: NeedGroup[] = [
  {
    key: "gaming",
    label: "PC Gaming",
    tagline: "Chọn cấu hình gaming theo ngân sách — shop lắp ráp, bảo hành tại chỗ",
    trust: ["Lắp ráp miễn phí", "Bảo hành 24 tháng", "Test burn-in trước giao"],
    items: [
      {
        title: "PC Gaming dưới 10 triệu",
        specs: ["Intel Core i5 Gen 12", "VGA GTX 1660 Super", "RAM 16GB · SSD 512GB"],
        price: "Từ 8.9 triệu",
        priceNote: "Trả góp 0%",
        gift: "Tặng bàn phím + chuột gaming",
        badge: "Bán chạy",
        href: "/pc-gaming?subcategory=pc-gaming-duoi-15-trieu",
        icon: Gamepad2,
        cardGradient: "from-slate-800 via-slate-700 to-slate-900",
        iconRing: "bg-white/10 border-white/20",
        priceStyle: "bg-gaming text-white",
        ctaStyle: "bg-gaming hover:bg-gaming/90 text-white",
      },
      {
        title: "PC Gaming dưới 15 triệu",
        specs: ["Core i5-13400F", "RTX 4060 8GB VRAM", "RAM 16GB · SSD 1TB NVMe"],
        price: "Từ 13.5 triệu",
        priceNote: "Trả góp 0%",
        gift: "Tặng tai nghe gaming 7.1",
        href: "/pc-gaming?subcategory=pc-gaming-15-25-trieu",
        icon: MonitorCog,
        cardGradient: "from-violet-900 via-violet-800 to-indigo-900",
        iconRing: "bg-white/10 border-white/20",
        priceStyle: "bg-violet-600 text-white",
        ctaStyle: "bg-violet-600 hover:bg-violet-500 text-white",
      },
      {
        title: "PC Gaming dưới 20 triệu",
        specs: ["Core i7-13700F / Ryzen 7", "RTX 4060 Ti 8GB", "RAM 32GB · SSD 1TB NVMe"],
        price: "Từ 17.9 triệu",
        priceNote: "Miễn ship toàn quốc",
        gift: "Tặng màn hình 24\" 144Hz",
        badge: "Hot",
        href: "/pc-gaming?subcategory=pc-gaming-15-25-trieu",
        icon: Sparkles,
        cardGradient: "from-rose-800 via-orange-700 to-rose-900",
        iconRing: "bg-white/10 border-white/20",
        priceStyle: "bg-sale text-white",
        ctaStyle: "bg-sale hover:bg-sale/90 text-white",
      },
      {
        title: "PC Gaming dưới 30 triệu",
        specs: ["Core i7-14700K / Ryzen 9", "RTX 4070 12GB", "RAM 32GB DDR5 · SSD 2TB"],
        price: "Từ 25 triệu",
        priceNote: "Tư vấn cấu hình 1-1",
        gift: "Build tự chọn theo ý thích",
        href: "/pc-gaming?subcategory=pc-gaming-25-40-trieu",
        icon: Zap,
        cardGradient: "from-amber-700 via-orange-600 to-amber-800",
        iconRing: "bg-white/10 border-white/20",
        priceStyle: "bg-amber-500 text-white",
        ctaStyle: "bg-amber-500 hover:bg-amber-400 text-white",
      },
    ],
  },
  {
    key: "work",
    label: "PC Công việc",
    tagline: "PC ổn định, dễ nâng cấp — đúng việc, đúng ngân sách, đúng môi trường",
    trust: ["Bảo hành 12–24 tháng", "Hỗ trợ cài phần mềm", "Giao & lắp tận nơi"],
    items: [
      {
        title: "PC Văn phòng / Kế toán",
        specs: ["Intel Core i3/i5", "RAM 8–16GB", "SSD 256–512GB · Office sẵn"],
        price: "Từ 5.9 triệu",
        priceNote: "Trả góp không lãi",
        gift: "Cài Windows + Office bản quyền",
        badge: "Phổ thông",
        href: "/pc?subcategory=pc-van-phong",
        icon: BriefcaseBusiness,
        cardGradient: "from-sky-700 via-sky-600 to-blue-800",
        iconRing: "bg-white/10 border-white/20",
        priceStyle: "bg-sky-600 text-white",
        ctaStyle: "bg-sky-600 hover:bg-sky-500 text-white",
      },
      {
        title: "PC Đồ họa / Sáng tạo",
        specs: ["Core i7 / Ryzen 7", "RAM 32GB · VGA RTX 3060+", "SSD 1TB + HDD lưu trữ"],
        price: "Từ 15 triệu",
        priceNote: "Tối ưu Adobe / 3D",
        gift: "Calibrate màn hình + tư vấn workflow",
        href: "/pc?subcategory=pc-do-hoa",
        icon: PencilRuler,
        cardGradient: "from-indigo-800 via-purple-700 to-indigo-900",
        iconRing: "bg-white/10 border-white/20",
        priceStyle: "bg-indigo-600 text-white",
        ctaStyle: "bg-indigo-600 hover:bg-indigo-500 text-white",
      },
      {
        title: "PC Livestream / Streamer",
        specs: ["Core i7 / Ryzen 7 đa nhân", "RTX 4060 + Elgato/OBS", "RAM 32GB · SSD 1TB"],
        price: "Từ 20 triệu",
        priceNote: "Tư vấn setup stream",
        gift: "Tặng micro thu âm cơ bản",
        badge: "Mới",
        href: "/pc-gaming?subcategory=pc-streaming",
        icon: RadioTower,
        cardGradient: "from-rose-700 via-pink-600 to-rose-800",
        iconRing: "bg-white/10 border-white/20",
        priceStyle: "bg-rose-600 text-white",
        ctaStyle: "bg-rose-600 hover:bg-rose-500 text-white",
      },
      {
        title: "PC Camera / Trực quan",
        specs: ["CPU ổn định 24/7", "RAM 8–16GB · HDD 2–4TB", "Tương thích NVR/DVR"],
        price: "Tư vấn theo số mắt",
        priceNote: "Lắp đặt tận nơi",
        gift: "Khảo sát điểm đặt camera miễn phí",
        href: "/camera?subcategory=he-thong-camera",
        icon: Camera,
        cardGradient: "from-teal-700 via-teal-600 to-emerald-800",
        iconRing: "bg-white/10 border-white/20",
        priceStyle: "bg-teal-600 text-white",
        ctaStyle: "bg-teal-600 hover:bg-teal-500 text-white",
      },
    ],
  },
  {
    key: "laptop",
    label: "Laptop",
    tagline: "Gợi ý laptop theo cách dùng thực tế — tránh mua thừa hay thiếu cấu hình",
    trust: ["Máy chính hãng", "Bảo hành theo hãng", "Đổi trả 7 ngày"],
    items: [
      {
        title: "Laptop sinh viên",
        specs: ["Core i5 / Ryzen 5", "Pin 8–12 giờ · Dưới 1.8kg", "RAM 8GB · SSD 512GB"],
        price: "Từ 9 triệu",
        priceNote: "Trả góp sinh viên",
        gift: "Tặng túi chống sốc + chuột",
        badge: "Bán chạy",
        href: "/laptop?subcategory=laptop-sinh-vien",
        icon: GraduationCap,
        cardGradient: "from-teal-600 via-teal-500 to-cyan-700",
        iconRing: "bg-white/10 border-white/20",
        priceStyle: "bg-teal-600 text-white",
        ctaStyle: "bg-teal-600 hover:bg-teal-500 text-white",
      },
      {
        title: "Laptop văn phòng",
        specs: ["Core i5/i7 · màn IPS", "Bàn phím backlit · bền", "Office sẵn · bảo hành rõ"],
        price: "Từ 12 triệu",
        priceNote: "Trả góp 0% lãi",
        gift: "Cài Windows + Office bản quyền",
        href: "/laptop?subcategory=laptop-van-phong",
        icon: BriefcaseBusiness,
        cardGradient: "from-blue-700 via-blue-600 to-sky-800",
        iconRing: "bg-white/10 border-white/20",
        priceStyle: "bg-blue-600 text-white",
        ctaStyle: "bg-blue-600 hover:bg-blue-500 text-white",
      },
      {
        title: "Laptop gaming",
        specs: ["RTX 4060/4070 · 144Hz+", "Core i7/i9 · tản nhiệt tốt", "RAM 16GB · SSD NVMe"],
        price: "Từ 18 triệu",
        priceNote: "Tư vấn 1-1 theo game",
        gift: "Tặng balo + chuột gaming",
        badge: "Hot",
        href: "/laptop?subcategory=laptop-gaming",
        icon: Gamepad2,
        cardGradient: "from-orange-700 via-rose-600 to-red-800",
        iconRing: "bg-white/10 border-white/20",
        priceStyle: "bg-sale text-white",
        ctaStyle: "bg-sale hover:bg-sale/90 text-white",
      },
      {
        title: "Laptop đồ họa / MacBook",
        specs: ["Apple M3 / Core Ultra 7", "Màn IPS P3 · chuẩn màu", "RAM 16–32GB unified"],
        price: "Từ 22 triệu",
        priceNote: "Apple Premium Reseller",
        gift: "AppleCare tư vấn miễn phí",
        href: "/laptop?subcategory=laptop-do-hoa",
        icon: Monitor,
        cardGradient: "from-slate-700 via-slate-600 to-zinc-800",
        iconRing: "bg-white/10 border-white/20",
        priceStyle: "bg-slate-600 text-white",
        ctaStyle: "bg-slate-600 hover:bg-slate-500 text-white",
      },
    ],
  },
];

const BADGE_STYLE: Record<string, string> = {
  "Bán chạy": "bg-sale text-white",
  "Hot": "bg-orange-500 text-white",
  "Mới": "bg-primary text-primary-foreground",
  "Phổ thông": "bg-sky-600 text-white",
};

export default function ShopByNeedSection() {
  const [activeTab, setActiveTab] = useState<NeedTabKey>("gaming");
  const activeGroup = needGroups.find((group) => group.key === activeTab) ?? needGroups[0];

  return (
    <section className="py-5">
      {/* Heading */}
      <div className="section-heading mb-4">
        <div>
          <p className="section-label text-primary">Mua theo nhu cầu</p>
          <h2 className="section-heading-title">Chọn nhanh theo ngân sách & mục đích</h2>
        </div>
        <Link to="/build-pc" className="section-link">
          Tư vấn cấu hình <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Tab bar */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Nhóm nhu cầu mua hàng">
        {needGroups.map((group) => {
          const isActive = group.key === activeTab;
          return (
            <button
              key={group.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(group.key)}
              className={`inline-flex min-h-9 shrink-0 items-center justify-center rounded-full border px-4 text-sm font-medium transition ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground shadow-card"
                  : "border-border bg-card text-foreground hover:border-primary/40 hover:text-primary"
              }`}
            >
              {group.label}
            </button>
          );
        })}
      </div>

      {/* Context strip */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3">
        <p className="text-sm font-medium text-foreground">{activeGroup.tagline}</p>
        <div className="flex flex-wrap gap-2">
          {activeGroup.trust.map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium text-foreground">
              <Shield className="h-3 w-3 text-primary" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-4">
        {activeGroup.items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              to={item.href}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-product"
            >
              {/* Visual top area */}
              <div className={`relative flex flex-col items-center justify-center bg-gradient-to-br ${item.cardGradient} px-4 pb-4 pt-5`}>
                {item.badge && (
                  <span className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10px] font-semibold ${BADGE_STYLE[item.badge] ?? "bg-muted"}`}>
                    {item.badge}
                  </span>
                )}
                <span className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${item.iconRing} backdrop-blur`}>
                  <Icon className="h-7 w-7 text-white" />
                </span>
                <h4 className="mt-3 text-center text-sm font-semibold leading-tight text-white md:text-[15px]">
                  {item.title}
                </h4>
              </div>

              {/* Info bottom area */}
              <div className="flex flex-1 flex-col p-3">
                {/* Specs chips */}
                <div className="mb-3 flex flex-col gap-1">
                  {item.specs.map((spec) => (
                    <span key={spec} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Cpu className="h-3 w-3 shrink-0 text-primary/60" />
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Gift */}
                {item.gift && (
                  <div className="mb-3 flex items-start gap-1.5 rounded-lg border border-dashed border-sale/30 bg-sale/5 px-2 py-1.5">
                    <Gift className="mt-0.5 h-3 w-3 shrink-0 text-sale" />
                    <span className="text-[10px] font-medium leading-4 text-sale">{item.gift}</span>
                  </div>
                )}

                {/* Price + CTA */}
                <div className="mt-auto space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.priceStyle}`}>
                      {item.price}
                    </span>
                    {item.priceNote && (
                      <span className="text-[10px] font-semibold text-muted-foreground">{item.priceNote}</span>
                    )}
                  </div>
                  <span className={`flex w-full items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition ${item.ctaStyle}`}>
                    Chọn ngay
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom quick links */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-semibold text-muted-foreground">Cần tư vấn thêm?</span>
        {[
          { label: "Nâng cấp RAM / SSD", href: "/linh-kien?subcategory=ram" },
          { label: "Camera trọn gói", href: "/camera?subcategory=lap-dat-camera-tron-goi" },
          { label: "Sửa chữa tận nơi", href: "/dich-vu?subcategory=sua-chua-bao-tri" },
          { label: "Build PC theo yêu cầu", href: "/dich-vu?subcategory=lap-rap-pc" },
        ].map((link) => (
          <Link
            key={link.label}
            to={link.href}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary/40 hover:text-primary"
          >
            {link.label}
            <ArrowRight className="h-3 w-3" />
          </Link>
        ))}
      </div>
    </section>
  );
}
