import { Link } from "react-router-dom";
import { Phone, MapPin, Clock, Mail, Facebook, MessageCircle } from "lucide-react";
import { useSiteSettings } from "@/hooks/queries/settings.queries";

const footerLinks = {
  "Sản phẩm": [
    { name: "Laptop", path: "/laptop" },
    { name: "PC văn phòng", path: "/pc" },
    { name: "PC Gaming", path: "/pc-gaming" },
    { name: "Linh kiện máy tính", path: "/linh-kien" },
    { name: "Thiết bị mạng", path: "/thiet-bi-mang" },
    { name: "Camera giám sát", path: "/camera" },
  ],
  "Dịch vụ": [
    { name: "Sửa chữa laptop", path: "/dich-vu/sua-laptop" },
    { name: "Sửa chữa PC", path: "/dich-vu/sua-pc" },
    { name: "Vệ sinh máy tính", path: "/dich-vu/ve-sinh-may-tinh" },
    { name: "Cài Windows", path: "/dich-vu/cai-windows" },
    { name: "Lắp đặt camera", path: "/dich-vu/lap-dat-camera" },
    { name: "Thi công mạng", path: "/dich-vu/thi-cong-mang" },
  ],
  "Chính sách": [
    { name: "Chính sách bảo hành", path: "/chinh-sach/bao-hanh" },
    { name: "Chính sách đổi trả", path: "/chinh-sach/doi-tra" },
    { name: "Chính sách vận chuyển", path: "/chinh-sach/van-chuyen" },
    { name: "Chính sách bảo mật", path: "/chinh-sach/bao-mat" },
    { name: "Hướng dẫn mua hàng", path: "/huong-dan-mua-hang" },
    { name: "Hướng dẫn thanh toán", path: "/huong-dan-thanh-toan" },
  ],
};

export default function Footer() {
  const { data: siteSettings } = useSiteSettings();
  const settings = {
    siteName: "Lộc An",
    hotline: "0989386219",
    email: "locan@locan.vn",
    address: "7 La Dương, Dương Nội, Hà Đông, Hà Nội",
    workingHours: "8:00 - 20:00 (T2 - CN)",
    facebook: "https://facebook.com/locantech",
    zalo: "0989386219",
    footerText: "© 2026 Designed by LocAn.",
    ...siteSettings,
  };
  const zaloHref = settings.zalo?.startsWith("http") ? settings.zalo : `https://zalo.me/${settings.zalo}`;

  return (
    <footer className="bg-primary-dark text-primary-foreground">
      <div className="section-container py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand info */}
          <div>
            <h3 className="text-xl font-extrabold mb-4">{settings.siteName}</h3>
            <p className="text-sm opacity-80 mb-4">
              Máy tính, laptop, sửa chữa và giải pháp công nghệ cho gia đình, game thủ và văn phòng.
            </p>
            <div className="space-y-2.5 text-sm">
              <a href={`tel:${settings.hotline}`} className="flex items-center gap-2 hover:opacity-90">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="font-semibold">{settings.hotline}</span>
              </a>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 flex-shrink-0" />
                <span>{settings.workingHours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>{settings.email}</span>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3 mt-4">
              <a
                href={settings.facebook || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary-light/20 hover:bg-primary-light/40 transition-colors"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href={zaloHref}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-primary-light/20 hover:bg-primary-light/40 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-sm opacity-80 hover:opacity-100 hover:underline transition-opacity">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-8 pt-6 border-t border-primary-light/20">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm">Đăng ký nhận tin khuyến mãi</h4>
              <p className="text-xs opacity-70">Nhận thông tin ưu đãi mới nhất từ Lộc An</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Email của bạn..."
                className="flex-1 rounded-lg border border-border bg-card px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent md:w-64"
              />
              <button className="btn-cta whitespace-nowrap">Đăng ký</button>
            </div>
          </div>
        </div>

        {/* Map + Copyright */}
        <div className="mt-8 pt-6 border-t border-primary-light/20">
          <div className="rounded-lg overflow-hidden mb-6 h-48">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.9884851704173!2d105.73365147599795!3d20.99309868900102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xac226154ac663e95%3A0x5a30dc76f0a58a74!2zTcOheSBUw61uaCBM4buZYyBBbg!5e0!3m2!1svi!2s!4v1778470777001!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lộc An - Bản đồ"
            />
          </div>
          <p className="text-center text-xs opacity-60">
            {settings.footerText || "© 2026 Designed by LocAn."}
          </p>
        </div>
      </div>
    </footer>
  );
}
