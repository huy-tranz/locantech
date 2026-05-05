import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  BadgePercent,
  Cpu,
  Gift,
  Home,
  LogOut,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Truck,
  User,
  Wrench,
  X,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { getCurrentUser, logoutUser, subscribeAuthChange, type AuthSession } from "@/lib/auth";
import { useSiteSettings } from "@/hooks/queries/settings.queries";
import { cn } from "@/lib/utils";
import logoLocan from "@/assets/logo/logo_locan.png";

const menuItems = [
  { name: "Trang chủ", path: "/", icon: Home },
  { name: "Flash Sale", path: "/flash-sale", icon: BadgePercent },
  { name: "Build PC", path: "/build-pc", icon: Cpu },
  { name: "Sửa chữa máy tính", path: "/dich-vu/", icon: Wrench },
  { name: "Ưu đãi thành viên", path: "/uu-dai-thanh-vien", icon: Sparkles },
];

const promoStrip = [
  { icon: Gift, text: "Combo PC + màn hình giá tốt" },
  { icon: BadgeCheck, text: "Kiểm tra lỗi, báo giá trước" },
  { icon: Truck, text: "Lắp đặt tận nơi tại Hà Đông" },
  { icon: ShieldCheck, text: "Hỗ trợ sau bán rõ ràng" },
];

const defaultSiteSettings = {
  siteName: "Lộc An",
  hotline: "0989386219",
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<AuthSession | null>(null);
  const { totalItems } = useCart();
  const { data: siteSettings } = useSiteSettings();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const settings = { ...defaultSiteSettings, ...siteSettings };

  useEffect(() => {
    const syncUser = () => setCurrentUser(getCurrentUser());
    syncUser();
    return subscribeAuthChange(syncUser);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logoutUser();
    setMobileOpen(false);
  };

  const handleSearchSubmit = (event: FormEvent) => {
    event.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/tim-kiem?q=${encodeURIComponent(q)}`);
    setMobileOpen(false);
  };

  const searchForm = (
    <form className="relative" onSubmit={handleSearchSubmit}>
      <input
        type="text"
        name="q"
        placeholder="Tìm sản phẩm, linh kiện, dịch vụ..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        className="w-full rounded-full border border-white/40 bg-white/95 py-2.5 pl-5 pr-12 text-sm text-foreground shadow-[0_10px_30px_rgba(15,23,42,0.16)] focus:outline-none focus:ring-2 focus:ring-white/70"
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-sm transition-colors hover:bg-accent-hover"
        aria-label="Tìm kiếm"
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  );

  return (
    <header className={cn("sticky top-0 z-50 transition-shadow duration-300", isScrolled ? "shadow-header" : "shadow-none")}>
      <div className="border-b border-primary/10 bg-white/95 text-foreground backdrop-blur">
        <div className="section-container">
          <div className="grid grid-cols-2 divide-x divide-y divide-border/60 sm:grid-cols-4 sm:divide-y-0">
            {promoStrip.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.text} className="flex min-h-9 items-center justify-center gap-2 px-2 py-2 text-center sm:min-h-10">
                  <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="text-[11px] font-bold leading-4 text-foreground/85 md:text-xs">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="header-bg text-primary-foreground ring-1 ring-white/10">
        <div className="section-container flex h-[72px] items-center gap-3 py-2 md:h-20 md:gap-4">
          <button
            className="rounded-md p-2 hover:bg-primary-light/20 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Mở menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <Link to="/" className="flex-shrink-0">
            <img
              src={logoLocan}
              alt={settings.siteName}
              className="max-h-[62px] w-auto max-w-[130px] object-contain md:max-h-[76px] md:max-w-[170px]"
            />
          </Link>

          <div className="mx-2 hidden max-w-2xl flex-1 md:mx-6 md:block">{searchForm}</div>

          <a href={`tel:${settings.hotline}`} className="hidden flex-shrink-0 items-center gap-2 hover:opacity-90 md:flex">
            <Phone className="h-4 w-4" />
            <div>
              <div className="text-xs opacity-80">Hotline</div>
              <div className="text-sm font-bold">{settings.hotline}</div>
            </div>
          </a>

          <div className="ml-auto flex items-center gap-1 md:ml-0 md:gap-3">
            {currentUser ? (
              <Link
                to="/tai-khoan"
                className="flex flex-col items-center rounded-md p-1.5 hover:bg-primary-light/20"
                title={currentUser.fullName}
              >
                <User className="h-5 w-5 md:h-4 md:w-4" />
                <span className="hidden max-w-[84px] truncate text-[10px] md:block">{currentUser.fullName}</span>
              </Link>
            ) : (
              <Link to="/dang-nhap" className="flex flex-col items-center rounded-md p-1.5 hover:bg-primary-light/20">
                <User className="h-5 w-5 md:h-4 md:w-4" />
                <span className="hidden text-[10px] md:block">Tài khoản</span>
              </Link>
            )}

            <Link to="/gio-hang" className="relative flex flex-col items-center rounded-md p-1.5 hover:bg-primary-light/20">
              <ShoppingCart className="h-5 w-5 md:h-4 md:w-4" />
              <span className="hidden text-[10px] md:block">Giỏ hàng</span>
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                {totalItems}
              </span>
            </Link>
          </div>
        </div>

        <div className="section-container pb-3 md:hidden">{searchForm}</div>
      </div>

      <nav className="hidden border-b border-primary/10 bg-white/95 shadow-sm backdrop-blur lg:block">
        <div className="section-container">
          <ul className="flex w-full items-center justify-between">
            {menuItems.map((item) => (
              <li key={item.path} className="flex-1 text-center">
                <Link to={item.path} className="nav-link inline-flex items-center justify-center gap-2">
                  <item.icon className="h-4 w-4 text-primary" />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            className="absolute z-50 max-h-[80vh] w-full overflow-y-auto border-b bg-card shadow-lg lg:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="py-2">
              <a href={`tel:${settings.hotline}`} className="flex items-center gap-3 border-b px-4 py-3 font-bold text-sale">
                <Phone className="h-5 w-5" />
                Gọi ngay: {settings.hotline}
              </a>

              {menuItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.18, ease: "easeOut" }}
                >
                  <Link
                    to={item.path}
                    className="flex items-center gap-3 border-b border-border/50 px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
                    onClick={() => setMobileOpen(false)}
                  >
                    <item.icon className="h-4 w-4 text-primary" />
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              {currentUser ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 border-b border-border/50 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted"
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất ({currentUser.fullName})
                </button>
              ) : (
                <Link
                  to="/dang-nhap"
                  className="block border-b border-border/50 px-4 py-3 text-sm font-medium text-foreground hover:bg-muted"
                  onClick={() => setMobileOpen(false)}
                >
                  Tài khoản
                </Link>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
