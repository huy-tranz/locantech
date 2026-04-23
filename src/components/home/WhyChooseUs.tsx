import {
  DollarSign, Headphones, Wrench, ShieldCheck, Truck, Heart, Camera, Wifi
} from "lucide-react";

const reasons = [
  { icon: DollarSign, title: "Giá rõ ràng, dễ mua", desc: "Niêm yết giá công khai, không phát sinh chi phí" },
  { icon: Headphones, title: "Hỗ trợ kỹ thuật nhanh", desc: "Đội ngũ kỹ thuật có mặt trong 60 phút tại Hà Đông" },
  { icon: Wrench, title: "Sửa chữa minh bạch", desc: "Báo giá trước khi sửa, khách đồng ý mới thực hiện" },
  { icon: ShieldCheck, title: "Bảo hành rõ ràng", desc: "Bảo hành chính hãng + bảo hành tại cửa hàng Lộc An" },
  { icon: Truck, title: "Giao hàng toàn quốc", desc: "Đóng gói cẩn thận, giao hàng nhanh chóng" },
  { icon: Heart, title: "Tư vấn đúng nhu cầu", desc: "Không ép mua, tư vấn cấu hình phù hợp ngân sách" },
  { icon: Camera, title: "Lắp camera tận nơi", desc: "Thi công camera giám sát cho nhà và văn phòng" },
  { icon: Wifi, title: "Giải pháp mạng chuyên nghiệp", desc: "Thiết kế WiFi, LAN cho văn phòng, quán cafe" },
];

export default function WhyChooseUs() {
  return (
    <section className="py-8">
      <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-6">
        Vì sao chọn <span className="text-primary">Lộc An</span>?
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {reasons.map((r, i) => (
          <div key={i} className="bg-card rounded-lg border p-4 text-center hover:shadow-md transition-shadow">
            <div className="h-10 w-10 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-3">
              <r.icon className="h-5 w-5 text-accent" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">{r.title}</h3>
            <p className="text-xs text-muted-foreground">{r.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
