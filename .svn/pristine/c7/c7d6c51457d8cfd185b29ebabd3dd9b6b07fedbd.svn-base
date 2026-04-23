import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import { ChevronRight, Phone, MapPin, Clock, Mail, MessageCircle } from "lucide-react";

export default function LienHePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="section-container py-4 md:py-6">
        <nav className="flex items-center text-sm text-muted-foreground mb-4 gap-1.5">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">Liên hệ</span>
        </nav>

        <h1 className="text-xl md:text-2xl font-bold text-foreground mb-6">Liên hệ Lộc An</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Info */}
          <div>
            <div className="bg-card rounded-lg border p-6 mb-4">
              <h2 className="text-lg font-bold text-foreground mb-4">Thông tin liên hệ</h2>
              <div className="space-y-4">
                <a href="tel:0989386219" className="flex items-center gap-3 text-foreground hover:text-primary">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Hotline</div>
                    <div className="font-bold text-lg text-sale">0989.386.219</div>
                  </div>
                </a>
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Địa chỉ</div>
                    <div className="text-sm font-medium">7 La Dương, Dương Nội, Hà Đông, Hà Nội</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Giờ làm việc</div>
                    <div className="text-sm font-medium">8:00 – 20:00 (Thứ 2 – Chủ nhật)</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Email</div>
                    <div className="text-sm font-medium">locan@locan.vn</div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <a href="tel:0989386219" className="btn-cta flex-1 text-center">
                  <Phone className="h-4 w-4 mr-1 inline" /> Gọi ngay
                </a>
                <a href="https://zalo.me/0989386219" target="_blank" rel="noopener noreferrer" className="btn-primary flex-1 text-center">
                  <MessageCircle className="h-4 w-4 mr-1 inline" /> Chat Zalo
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="rounded-lg overflow-hidden border h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3725.4!2d105.7!3d20.97!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDU4JzEyLjAiTiAxMDXCsDQyJzAwLjAiRQ!5e0!3m2!1svi!2s!4v1"
                width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                title="Lộc An bản đồ"
              />
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Gửi tin nhắn cho chúng tôi</h2>
            <form className="space-y-3" onSubmit={e => { e.preventDefault(); alert("Cảm ơn bạn đã liên hệ! Lộc An sẽ phản hồi trong thời gian sớm nhất."); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Họ và tên *</label>
                  <input type="text" required placeholder="Nguyễn Văn A" className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background" />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Số điện thoại *</label>
                  <input type="tel" required placeholder="0912 345 678" className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Email</label>
                <input type="email" placeholder="email@gmail.com" className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Chủ đề</label>
                <select className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
                  <option value="">-- Chọn chủ đề --</option>
                  <option>Tư vấn mua hàng</option>
                  <option>Yêu cầu sửa chữa</option>
                  <option>Tư vấn build PC</option>
                  <option>Lắp đặt camera</option>
                  <option>Khảo sát mạng / WiFi</option>
                  <option>Bảo hành sản phẩm</option>
                  <option>Khiếu nại / góp ý</option>
                  <option>Khác</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Nội dung *</label>
                <textarea required rows={4} placeholder="Mô tả yêu cầu của bạn..." className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background" />
              </div>
              <button type="submit" className="btn-cta w-full text-base">Gửi liên hệ</button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
