import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import { getAllServices, getServiceIcon } from "@/data/services";
import { ChevronRight, Phone, ArrowRight } from "lucide-react";

export default function DichVuPage() {
  const services = getAllServices();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="section-container py-4 md:py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-muted-foreground mb-4 gap-1.5">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">Dịch vụ sửa chữa</span>
        </nav>

        <h1 className="text-xl md:text-2xl font-bold text-foreground mb-2">Dịch vụ sửa chữa & CNTT</h1>
        <p className="text-sm text-muted-foreground mb-6">Lộc An cung cấp dịch vụ sửa chữa, bảo trì máy tính, lắp đặt camera và mạng tại Hà Đông, Hà Nội. Hotline: 0989.386.219</p>

        {/* CTA */}
        <div className="bg-primary rounded-xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-primary-foreground">Cần sửa chữa gấp?</h2>
            <p className="text-sm text-primary-foreground/80">Gọi ngay hotline, kỹ thuật viên có mặt trong 60 phút tại Hà Đông</p>
          </div>
          <a href="tel:0989386219" className="btn-cta text-base flex items-center gap-2 whitespace-nowrap">
            <Phone className="h-5 w-5" />
            0989.386.219
          </a>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {services.map(service => {
            const Icon = getServiceIcon(service.iconKey);
            return (
              <div key={service.id} className="bg-card rounded-lg border p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-foreground mb-1">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{service.shortDesc}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3">
                      <span>💰 {service.priceRange}</span>
                      <span>⏱ {service.duration}</span>
                    </div>
                    <div className="flex gap-2">
                      <a href="tel:0989386219" className="btn-cta text-xs py-1.5 px-3">
                        <Phone className="h-3.5 w-3.5 mr-1" /> Gọi ngay
                      </a>
                      <Link to={`/dich-vu/${service.slug}`} className="btn-primary text-xs py-1.5 px-3">
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Service request form */}
        <div className="bg-card rounded-lg border p-6 max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-foreground mb-4 text-center">Gửi yêu cầu sửa chữa</h2>
          <form className="space-y-3" onSubmit={e => { e.preventDefault(); alert("Cảm ơn bạn! Lộc An sẽ liên hệ lại trong thời gian sớm nhất."); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" placeholder="Họ và tên *" required className="px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background" />
              <input type="tel" placeholder="Số điện thoại *" required className="px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background" />
            </div>
            <select className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
              <option value="">-- Chọn dịch vụ --</option>
              {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <textarea placeholder="Mô tả tình trạng máy hoặc yêu cầu..." rows={3} className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background" />
            <button type="submit" className="btn-cta w-full text-base">Gửi yêu cầu</button>
          </form>
        </div>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
