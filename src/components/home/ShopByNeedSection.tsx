import { useState } from "react";
import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Camera,
  Gamepad2,
  GraduationCap,
  MonitorCog,
  PencilRuler,
  RadioTower,
  Sparkles,
} from "lucide-react";

type NeedTabKey = "gaming" | "work" | "laptop";

interface NeedItem {
  title: string;
  description: string;
  price: string;
  href: string;
  icon: LucideIcon;
  tone: string;
}

interface NeedGroup {
  key: NeedTabKey;
  label: string;
  eyebrow: string;
  title: string;
  description: string;
  items: NeedItem[];
}

const needGroups: NeedGroup[] = [
  {
    key: "gaming",
    label: "PC Gaming",
    eyebrow: "Theo ngân sách",
    title: "Chọn PC gaming theo mức tiền dễ quyết",
    description: "Đi nhanh từ ngân sách tới nhóm cấu hình phù hợp, sau đó shop tư vấn lại linh kiện chi tiết.",
    items: [
      {
        title: "PC gaming dưới 10 triệu",
        description: "Ưu tiên game eSports, học tập, nâng cấp dần.",
        price: "Dưới 10 triệu",
        href: "/pc-gaming?subcategory=pc-gaming-pho-thong",
        icon: Gamepad2,
        tone: "text-gaming bg-gaming/10 border-gaming/20",
      },
      {
        title: "PC gaming dưới 15 triệu",
        description: "Chơi mượt Full HD, cân bằng CPU và VGA.",
        price: "Dưới 15 triệu",
        href: "/pc-gaming?subcategory=pc-gaming-pho-thong",
        icon: MonitorCog,
        tone: "text-primary bg-primary/10 border-primary/20",
      },
      {
        title: "PC gaming dưới 20 triệu",
        description: "Hợp game AAA Full HD, stream nhẹ, dễ nâng RAM/SSD.",
        price: "Dưới 20 triệu",
        href: "/pc-gaming?subcategory=pc-gaming-tam-trung",
        icon: Sparkles,
        tone: "text-accent bg-accent/10 border-accent/20",
      },
      {
        title: "PC gaming dưới 30 triệu",
        description: "Cấu hình mạnh hơn cho màn 2K, đồ họa và livestream.",
        price: "Dưới 30 triệu",
        href: "/pc-gaming?subcategory=pc-gaming-cao-cap",
        icon: BadgeCheck,
        tone: "text-sale bg-sale/10 border-sale/20",
      },
    ],
  },
  {
    key: "work",
    label: "PC Công việc",
    eyebrow: "Theo mục đích",
    title: "Chọn PC theo việc cần làm mỗi ngày",
    description: "Tập trung vào độ ổn định, khả năng nâng cấp và chi phí hợp lý cho từng môi trường làm việc.",
    items: [
      {
        title: "PC văn phòng",
        description: "Kế toán, bán hàng, học online, dùng bền và dễ bảo trì.",
        price: "Từ 5 triệu",
        href: "/pc?subcategory=pc-van-phong",
        icon: BriefcaseBusiness,
        tone: "text-trust bg-trust/10 border-trust/20",
      },
      {
        title: "PC đồ họa",
        description: "Thiết kế, dựng hình, Adobe, cần CPU/RAM/VGA ổn định.",
        price: "Từ 15 triệu",
        href: "/pc?subcategory=pc-do-hoa",
        icon: PencilRuler,
        tone: "text-primary bg-primary/10 border-primary/20",
      },
      {
        title: "PC livestream",
        description: "Vừa chơi vừa stream, ưu tiên CPU khỏe và card hình phù hợp.",
        price: "Từ 20 triệu",
        href: "/pc-gaming?subcategory=pc-livestream",
        icon: RadioTower,
        tone: "text-sale bg-sale/10 border-sale/20",
      },
      {
        title: "PC camera",
        description: "Máy trực camera, lưu trữ nhiều, chạy ổn định cả ngày.",
        price: "Tư vấn theo số mắt",
        href: "/camera?subcategory=combo-camera",
        icon: Camera,
        tone: "text-service bg-service/10 border-service/20",
      },
    ],
  },
  {
    key: "laptop",
    label: "Laptop",
    eyebrow: "Theo người dùng",
    title: "Chọn laptop theo người dùng thực tế",
    description: "Gợi ý theo kiểu sử dụng để tránh mua thừa cấu hình hoặc thiếu hiệu năng sau vài tháng.",
    items: [
      {
        title: "Laptop sinh viên",
        description: "Gọn nhẹ, pin ổn, học tập và làm bài thuyết trình.",
        price: "Từ 9 triệu",
        href: "/laptop?subcategory=laptop-hoc-tap",
        icon: GraduationCap,
        tone: "text-trust bg-trust/10 border-trust/20",
      },
      {
        title: "Laptop văn phòng",
        description: "Màn dễ nhìn, bàn phím tốt, bảo hành rõ cho công việc hằng ngày.",
        price: "Từ 12 triệu",
        href: "/laptop?subcategory=laptop-van-phong",
        icon: BriefcaseBusiness,
        tone: "text-primary bg-primary/10 border-primary/20",
      },
      {
        title: "Laptop gaming",
        description: "CPU hiệu năng cao, GPU rời, tản nhiệt tốt cho game và đồ họa.",
        price: "Từ 18 triệu",
        href: "/laptop?subcategory=laptop-gaming",
        icon: Gamepad2,
        tone: "text-gaming bg-gaming/10 border-gaming/20",
      },
    ],
  },
];

export default function ShopByNeedSection() {
  const [activeTab, setActiveTab] = useState<NeedTabKey>("gaming");
  const activeGroup = needGroups.find((group) => group.key === activeTab) ?? needGroups[0];

  return (
    <section className="py-8">
      <div className="section-heading">
        <div>
          <p className="section-label text-primary">Mua theo nhu cầu</p>
          <h2 className="section-heading-title">Chọn nhanh theo ngân sách và mục đích sử dụng</h2>
        </div>
        <Link to="/build-pc" className="section-link">
          Tư vấn cấu hình <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

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
              className={`inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border px-4 text-sm font-extrabold transition ${
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

      <div className="mb-4 grid gap-3 lg:grid-cols-[0.7fr_1.3fr] lg:items-stretch">
        <div className="rounded-xl border border-primary/10 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-4">
          <span className="inline-flex rounded-full bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest text-primary shadow-sm">
            {activeGroup.eyebrow}
          </span>
          <h3 className="mt-3 text-xl font-extrabold leading-tight text-foreground md:text-2xl">{activeGroup.title}</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{activeGroup.description}</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              { value: activeGroup.items.length, label: "gợi ý" },
              { value: "1 chạm", label: "vào nhóm" },
              { value: "Rõ giá", label: "dễ so" },
            ].map((metric) => (
              <div key={metric.label} className="rounded-lg border border-white/80 bg-white/75 px-2 py-2">
                <p className="text-sm font-black text-foreground">{metric.value}</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {activeGroup.items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.href}
                className="group flex min-h-[160px] flex-col rounded-xl border border-border bg-card p-4 shadow-card transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-product"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${item.tone}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-extrabold text-foreground">
                    {item.price}
                  </span>
                </div>
                <h4 className="text-base font-extrabold text-foreground group-hover:text-primary">{item.title}</h4>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-extrabold text-primary">
                  Xem gợi ý <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
