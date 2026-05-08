import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  BadgePercent,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Cpu,
  LogOut,
  MapPin,
  Menu,
  Phone,
  RefreshCw,
  Search,
  ShoppingCart,
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
import { categories } from "@/data/categories";

const menuItems = [
  { name: "Flash Sale", path: "/flash-sale", icon: BadgePercent, tone: "text-sale" },
  { name: "Build PC", path: "/build-pc", icon: Cpu, tone: "text-primary" },
  { name: "Sửa chữa", path: "/dich-vu", icon: Wrench, tone: "text-primary" },
  { name: "Thu cũ đổi mới", path: "/dich-vu/thu-cu-doi-moi", icon: RefreshCw, tone: "text-trust" },
  { name: "Tra cứu bảo hành", path: "/chinh-sach/chinh-sach-bao-hanh", icon: ClipboardCheck, tone: "text-primary" },
];

const promoStrip = [
  // { icon: Gift, text: "Combo PC + màn hình giá tốt", tone: "text-service" },
  // { icon: BadgeCheck, text: "Kiểm tra lỗi, báo giá trước", tone: "text-trust" },
  // { icon: Truck, text: "Lắp đặt tận nơi tại Hà Nội", tone: "text-accent" },
  // { icon: ShieldCheck, text: "Hỗ trợ sau bán rõ ràng", tone: "text-primary" },
];

const defaultSiteSettings = {
  siteName: "Lộc An",
  hotline: "0989386219",
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [hoveredDropdownCat, setHoveredDropdownCat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<AuthSession | null>(null);
  const { totalItems } = useCart();
  const { data: siteSettings } = useSiteSettings();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const settings = { ...defaultSiteSettings, ...siteSettings };
  const hotlineDisplay = settings.hotline.replace(/^(\d{4})(\d{3})(\d{3,4})$/, "$1.$2.$3");

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
        placeholder="Tìm laptop Dell, PC gaming, SSD, sửa máy tính..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        className={cn(
          "w-full rounded-xl border border-white/60 bg-white pl-5 pr-14 text-sm font-medium text-foreground shadow-[0_12px_28px_rgba(15,23,42,0.18)] transition-all duration-300 placeholder:text-muted-foreground/75 focus:outline-none focus:ring-2 focus:ring-accent/45",
          isScrolled ? "py-2.5" : "py-3",
        )}
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg bg-accent text-white shadow-sm ring-1 ring-white/50 transition-colors hover:bg-accent-hover"
        aria-label="Tìm kiếm"
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  );

  const activeCatInDropdown = categories.find((c) => c.id === hoveredDropdownCat) ?? null;

  return (
    <header>
      {/* Tier 1 — Top Bar: 32px, navy background, white 12px — scrolls away */}
      <div className="hidden bg-primary text-white md:block">
        <div className="section-container flex h-8 items-center justify-between gap-4 text-[12px] leading-none">
          <Link
            to="/lien-he"
            className="flex items-center gap-1.5 transition-colors hover:text-accent"
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>Hệ thống cửa hàng</span>
          </Link>

          <a
            href={`tel:${settings.hotline}`}
            className="flex items-center gap-1.5 font-semibold transition-colors hover:text-accent"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>Hotline: {hotlineDisplay}</span>
          </a>

          <div className="flex items-center gap-4">
            <Link
              to="/tai-khoan"
              className="flex items-center gap-1.5 transition-colors hover:text-accent"
            >
              <Truck className="h-3.5 w-3.5" />
              <span>Tra cứu đơn hàng</span>
            </Link>
            <span className="h-3 w-px bg-white/25" aria-hidden />
            {currentUser ? (
              <Link
                to="/tai-khoan"
                className="flex items-center gap-1.5 transition-colors hover:text-accent"
                title={currentUser.fullName}
              >
                <User className="h-3.5 w-3.5" />
                <span className="max-w-[140px] truncate">{currentUser.fullName}</span>
              </Link>
            ) : (
              <Link
                to="/dang-nhap"
                className="flex items-center gap-1.5 transition-colors hover:text-accent"
              >
                <User className="h-3.5 w-3.5" />
                <span>Đăng nhập / Đăng ký</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {promoStrip.length > 0 && (
        <div
          className={cn(
            "hidden overflow-hidden border-b border-primary/10 bg-white/90 text-foreground backdrop-blur transition-all duration-300 md:block",
            isScrolled ? "max-h-0 opacity-0" : "max-h-24 opacity-100",
          )}
        >
          <div className="section-container">
            <div className="grid grid-cols-2 gap-2 py-2 sm:grid-cols-4">
              {promoStrip.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.text}
                    className="flex min-h-9 items-center justify-center gap-2 rounded-lg border border-primary/10 bg-white/60 px-2.5 py-2 text-center shadow-[0_4px_14px_rgba(15,23,42,0.04)] sm:min-h-10"
                  >
                    <Icon className={cn("h-3.5 w-3.5 shrink-0", item.tone)} />
                    <span className="text-[11px] font-bold leading-4 text-foreground/78 md:text-xs">{item.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* === STICKY WRAPPER: chỉ phần logo + search dính khi cuộn === */}
      <div className={cn("sticky top-0 z-50 transition-shadow duration-300", isScrolled ? "shadow-header" : "shadow-none")}>
      <div className="header-bg text-primary-foreground ring-1 ring-white/10">
        <div
          className={cn(
            "section-container flex items-center gap-3 py-3 transition-all duration-300 md:gap-4",
            isScrolled ? "min-h-14 md:min-h-[68px]" : "min-h-[76px] md:min-h-[96px]",
          )}
        >
          <button
            className="rounded-lg border border-white/15 bg-white/10 p-2 hover:bg-white/20 lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Mở menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          <a
            href="/"
            className="flex h-full flex-shrink-0 items-center rounded-xl px-1.5 transition-colors hover:bg-white/10"
          >
            <img
              src={logoLocan}
              alt={settings.siteName}
              className={cn(
                "w-auto object-contain transition-all duration-300",
                isScrolled
                  ? "max-h-10 max-w-[104px] md:max-h-12 md:max-w-[132px]"
                  : "max-h-[58px] max-w-[126px] md:max-h-[70px] md:max-w-[158px]",
              )}
            />
          </a>

          {isScrolled && (
            <div
              className="relative hidden shrink-0 lg:block"
              onMouseEnter={() => setCategoryOpen(true)}
              onMouseLeave={() => { setCategoryOpen(false); setHoveredDropdownCat(null); }}
            >
              <button
                type="button"
                aria-expanded={categoryOpen}
                onClick={() => setCategoryOpen((prev) => !prev)}
                className="inline-flex min-h-10 min-w-[210px] items-center justify-center gap-2 rounded-xl bg-white/15 px-4 text-sm font-extrabold text-primary-foreground shadow-sm transition hover:bg-white/25"
              >
                <Menu className="h-4 w-4" />
                <span>Danh mục sản phẩm</span>
                <ChevronDown className={cn("h-4 w-4 transition-transform", categoryOpen && "rotate-180")} />
              </button>

              <div
                className={cn(
                  "absolute left-0 top-full z-50 pt-2 transition-all duration-150",
                  categoryOpen ? "visible translate-y-0 opacity-100" : "invisible translate-y-2 opacity-0",
                )}
              >
                <div className="flex items-start">
                  <div className="w-[280px] overflow-hidden rounded-xl border border-border bg-card text-foreground shadow-panel">
                    <div className="border-b bg-gradient-to-r from-primary to-primary-light px-4 py-3 text-sm font-extrabold text-primary-foreground">
                      Danh mục sản phẩm
                    </div>
                    <div className="max-h-[min(70vh,32rem)] overflow-y-auto py-1">
                      {categories.map((cat) => {
                        const Icon = cat.icon;
                        const isActive = hoveredDropdownCat === cat.id;
                        return (
                          <Link
                            key={cat.id}
                            to={`/${cat.slug}`}
                            onMouseEnter={() => setHoveredDropdownCat(cat.id)}
                            onClick={() => { setCategoryOpen(false); setHoveredDropdownCat(null); }}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors",
                              isActive ? "bg-primary/5 text-primary" : "hover:bg-primary/5 hover:text-primary",
                            )}
                          >
                            {Icon && <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />}
                            <span className="min-w-0 flex-1 truncate">{cat.name}</span>
                            {cat.children ? (
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/70" />
                            ) : (
                              <ChevronDown className="-rotate-90 h-3.5 w-3.5 text-muted-foreground/70" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {activeCatInDropdown?.children && (
                    <div className="ml-1 w-[520px] self-start rounded-xl border bg-card p-5 shadow-2xl">
                      <div className="mb-4 border-b border-border/70 pb-3">
                        <p className="text-[15px] font-bold text-foreground">{activeCatInDropdown.name}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-x-6 gap-y-5 text-sm">
                        {activeCatInDropdown.children.map((group) => (
                          <div
                            key={group.id}
                            className={cn("min-w-0", (group.children?.length ?? 0) >= 5 ? "col-span-2" : "")}
                          >
                            <p className="mb-2 text-[15px] font-bold text-sale">{group.name}</p>
                            {group.children?.length ? (
                              <div className="space-y-1.5">
                                {group.children.map((child) => (
                                  <Link
                                    key={child.id}
                                    to={`/${activeCatInDropdown.slug}?subcategory=${encodeURIComponent(child.slug)}`}
                                    onClick={() => { setCategoryOpen(false); setHoveredDropdownCat(null); }}
                                    className="block break-words leading-6 text-foreground/90 transition-colors hover:text-primary"
                                  >
                                    {child.name}
                                  </Link>
                                ))}
                              </div>
                            ) : (
                              <Link
                                to={`/${activeCatInDropdown.slug}?subcategory=${encodeURIComponent(group.slug)}`}
                                onClick={() => { setCategoryOpen(false); setHoveredDropdownCat(null); }}
                                className="block leading-6 text-foreground/90 transition-colors hover:text-primary"
                              >
                                {group.name}
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className={cn("mx-1 hidden min-w-[20rem] flex-1 md:block", isScrolled ? "max-w-4xl" : "max-w-3xl xl:max-w-4xl")}>
            {searchForm}
          </div>

          <a
            href={`tel:${settings.hotline}`}
            className="hidden flex-shrink-0 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 shadow-sm transition-colors hover:bg-white/20 md:flex"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
              <Phone className="h-4 w-4" />
            </span>
            <div>
              <div className="text-[11px] font-semibold opacity-75">Tư vấn mua hàng</div>
              <div className="text-sm font-extrabold leading-4">{settings.hotline}</div>
            </div>
          </a>

          <Link
            to="/lien-he"
            className={cn(
              "hidden flex-shrink-0 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-left shadow-sm transition-colors hover:bg-white/20 lg:flex",
              isScrolled && "xl:hidden",
            )}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
              <MapPin className="h-4 w-4" />
            </span>
            <div>
              <div className="text-[11px] font-semibold opacity-75">Cửa hàng</div>
              <div className="text-sm font-extrabold leading-4">Hà Đông</div>
            </div>
          </Link>

          <div className="ml-auto flex items-center gap-1 md:ml-0 md:gap-2">
            {currentUser ? (
              <Link
                to="/tai-khoan"
                className="flex min-w-12 flex-col items-center rounded-xl border border-transparent p-1.5 transition-colors hover:border-white/15 hover:bg-white/10"
                title={currentUser.fullName}
              >
                <User className="h-5 w-5 md:h-[18px] md:w-[18px]" />
                <span className={cn("hidden max-w-[84px] truncate text-[10px] md:block", isScrolled && "lg:hidden")}>
                  {currentUser.fullName}
                </span>
              </Link>
            ) : (
              <Link
                to="/dang-nhap"
                className="flex min-w-12 flex-col items-center rounded-xl border border-transparent p-1.5 transition-colors hover:border-white/15 hover:bg-white/10"
              >
                <User className="h-5 w-5 md:h-[18px] md:w-[18px]" />
                <span className={cn("hidden text-[10px] md:block", isScrolled && "lg:hidden")}>Tài khoản</span>
              </Link>
            )}

            <Link
              to="/gio-hang"
              className="relative flex min-w-12 flex-col items-center rounded-xl border border-transparent p-1.5 transition-colors hover:border-white/15 hover:bg-white/10"
            >
              <ShoppingCart className="h-5 w-5 md:h-[18px] md:w-[18px]" />
              <span className={cn("hidden text-[10px] md:block", isScrolled && "lg:hidden")}>Giỏ hàng</span>
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-service text-[10px] font-bold text-service-foreground shadow-sm">
                {totalItems}
              </span>
            </Link>
          </div>
        </div>

        <div
          className={cn(
            "section-container overflow-hidden transition-all duration-300 md:hidden",
            isScrolled ? "max-h-0 pb-0 opacity-0" : "max-h-20 pb-3 opacity-100",
          )}
        >
          {searchForm}
        </div>
      </div>

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

              <div className="border-b border-border/50 py-2">
                <div className="px-4 pb-2 text-xs font-extrabold uppercase tracking-widest text-muted-foreground">
                  Danh mục sản phẩm
                </div>
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.id}
                      to={`/${cat.slug}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-primary"
                      onClick={() => setMobileOpen(false)}
                    >
                      {Icon && <Icon className="h-4 w-4 text-primary" />}
                      {cat.name}
                    </Link>
                  );
                })}
              </div>

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
      </div>
      {/* === END STICKY WRAPPER === */}

      {/* Nav bar — scrolls away, không sticky */}
      <nav className="hidden overflow-visible border-b border-primary/10 bg-white/95 shadow-sm backdrop-blur lg:block">
        <div className="section-container">
          <ul className="flex min-h-14 w-full items-center justify-between gap-2 py-1.5">
            {menuItems.map((item) => (
              <li key={item.path} className="flex-1 text-center">
                <Link to={item.path} className="nav-link inline-flex items-center justify-center gap-2 px-3">
                  <item.icon className={cn("h-4 w-4", item.tone)} />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
