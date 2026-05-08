import { DollarSign, Headphones, ShieldCheck, Truck } from "lucide-react";

const commitments = [
  {
    icon: DollarSign,
    title: "Giá rõ ràng",
    desc: "Niêm yết công khai, không phát sinh",
  },
  {
    icon: ShieldCheck,
    title: "Bảo hành rõ ràng",
    desc: "Chính hãng + bảo hành tại Lộc An",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ 60 phút",
    desc: "Kỹ thuật có mặt nội thành Hà Đông",
  },
  {
    icon: Truck,
    title: "Giao toàn quốc",
    desc: "Đóng gói cẩn thận, giao hàng nhanh",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="my-4 md:my-5">
      <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-card p-4 shadow-card md:grid-cols-4 md:gap-4">
        {commitments.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">{item.title}</p>
                <p className="truncate text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
