import {
  Camera, DollarSign, Headphones, Heart, ShieldCheck, Truck, Wifi, Wrench
} from "lucide-react";

const reasons = [
  { icon: DollarSign, title: "Giá rõ ràng, dễ mua", desc: "Niêm yết giá công khai, không phát sinh chi phí" },
  { icon: Headphones, title: "Hỗ trợ kỹ thuật nhanh", desc: "Đội ngũ kỹ thuật có mặt trong 60 phút tại Hà Đông" },
  { icon: Wrench, title: "Sửa chữa minh bạch", desc: "Báo giá trước khi sửa, khách đồng ý mới thực hiện" },
  { icon: ShieldCheck, title: "Bảo hành rõ ràng", desc: "Bảo hành chính hãng và bảo hành tại cửa hàng Lộc An" },
  { icon: Truck, title: "Giao hàng toàn quốc", desc: "Đóng gói cẩn thận, giao hàng nhanh chóng" },
  { icon: Heart, title: "Tư vấn đúng nhu cầu", desc: "Không ép mua, tư vấn cấu hình phù hợp ngân sách" },
  { icon: Camera, title: "Lắp camera tận nơi", desc: "Thi công camera giám sát cho nhà và văn phòng" },
  { icon: Wifi, title: "Giải pháp mạng chuyên nghiệp", desc: "Thiết kế WiFi, LAN cho văn phòng, quán cafe" },
];

export default function WhyChooseUs() {
  return (
    <section className="py-8">
      <div className="mb-6 text-center">
        <p className="section-label text-trust">Trust</p>
        <h2 className="text-xl font-extrabold text-foreground md:text-2xl">
          Vì sao chọn <span className="text-primary">Lộc An</span>?
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {reasons.map((reason) => (
          <div
            key={reason.title}
            className="rounded-xl border border-white/70 bg-card p-4 text-center shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-trust/30"
          >
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-trust/10">
              <reason.icon className="h-5 w-5 text-trust" />
            </div>
            <h3 className="mb-1 text-sm font-bold text-foreground">{reason.title}</h3>
            <p className="text-xs leading-5 text-muted-foreground">{reason.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
