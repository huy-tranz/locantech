import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import { ChevronRight, Phone, ShieldCheck, Heart, Wrench, Users, MapPin } from "lucide-react";

export default function GioiThieuPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="section-container py-4 md:py-6">
        <nav className="flex items-center text-sm text-muted-foreground mb-4 gap-1.5">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">Giới thiệu</span>
        </nav>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">Giới thiệu về Lộc An</h1>
          <p className="text-center text-muted-foreground mb-8">Máy tính, laptop, sửa chữa và giải pháp công nghệ cho gia đình, game thủ và văn phòng</p>

          <div className="prose prose-sm max-w-none text-foreground space-y-4">
            <p className="text-sm leading-relaxed">
              <strong>Lộc An</strong> là cửa hàng chuyên bán và sửa chữa máy tính, laptop, linh kiện, thiết bị mạng và camera giám sát tại <strong>7 La Dương, Dương Nội, Hà Đông, Hà Nội</strong>. Với đội ngũ kỹ thuật viên giàu kinh nghiệm, chúng tôi cam kết mang đến cho khách hàng những sản phẩm chất lượng và dịch vụ tận tâm nhất.
            </p>
            <p className="text-sm leading-relaxed">
              Chúng tôi hiểu rằng mỗi khách hàng có nhu cầu khác nhau – từ sinh viên cần laptop học tập giá rẻ, dân văn phòng cần máy tính ổn định, game thủ cần PC mạnh mẽ, đến doanh nghiệp nhỏ cần giải pháp mạng và camera toàn diện. Vì vậy, Lộc An luôn <strong>tư vấn đúng nhu cầu, báo giá rõ ràng và không ép mua</strong>.
            </p>
            <p className="text-sm leading-relaxed">
              Ngoài bán hàng, Lộc An còn cung cấp dịch vụ sửa chữa máy tính, cài đặt phần mềm, vệ sinh máy, nâng cấp linh kiện, thi công mạng nội bộ và lắp đặt camera giám sát. Bán hàng đi kèm dịch vụ kỹ thuật thực tế – đó là điều làm nên sự khác biệt của Lộc An.
            </p>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            {[
              { icon: Heart, title: "Tận tâm", desc: "Lắng nghe nhu cầu, tư vấn chân thành, phục vụ hết lòng" },
              { icon: ShieldCheck, title: "Uy tín", desc: "Sản phẩm chính hãng, bảo hành rõ ràng, giá minh bạch" },
              { icon: Wrench, title: "Chuyên nghiệp", desc: "Kỹ thuật viên tay nghề cao, xử lý nhanh, đúng hẹn" },
              { icon: Users, title: "Thân thiện", desc: "Gần gũi như người nhà, sẵn sàng hỗ trợ bất cứ lúc nào" },
            ].map((v, i) => (
              <div key={i} className="bg-card rounded-lg border p-5 flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <v.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-0.5">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-8 py-8 bg-primary rounded-xl">
            <h2 className="text-lg font-bold text-primary-foreground mb-2">Bạn cần tư vấn?</h2>
            <p className="text-sm text-primary-foreground/80 mb-4">Gọi ngay cho Lộc An để được hỗ trợ nhanh nhất</p>
            <a href="tel:0989386219" className="btn-cta text-base inline-flex items-center gap-2">
              <Phone className="h-5 w-5" /> 0989.386.219
            </a>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
