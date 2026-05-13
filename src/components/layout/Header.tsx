import { useEffect, useState, type FormEvent, type MouseEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BadgeCheck,
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
  ShieldCheck,
  ShoppingCart,
  Truck,
  User,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { getCurrentUser, logoutUser, subscribeAuthChange, type AuthSession } from "@/lib/auth";
import { useSiteSettings } from "@/hooks/queries/settings.queries";
import { cn } from "@/lib/utils";
import logoLocan from "@/assets/logo/logo_locan.png";
import { categories } from "@/data/categories";

const LOGO_HOME_RELOAD_SCROLL_KEY = "locan:logo-home-reload-scroll-top";

const menuItems = [
  { name: "Flash Sale", path: "/flash-sale", icon: BadgePercent, tone: "text-sale", strong: true },
  { name: "Build PC miễn phí", path: "/build-pc", icon: Cpu, tone: "text-primary", strong: true },
  { name: "Sửa chữa tận nơi", path: "/dich-vu", icon: Wrench, tone: "text-primary" },
  { name: "Thu cũ đổi mới", path: "/dich-vu/thu-cu-doi-moi", icon: RefreshCw, tone: "text-trust" },
  { name: "Tra cứu bảo hành", path: "/chinh-sach/chinh-sach-bao-hanh", icon: ClipboardCheck, tone: "text-primary" },
];

const promoStrip = [
  { icon: Truck, text: "Giao nhanh nội thành Hà Nội", tone: "text-trust" },
  { icon: ShieldCheck, text: "Bảo hành rõ ràng, hỗ trợ kỹ thuật", tone: "text-primary" },
  { icon: Cpu, text: "Tư vấn build PC miễn phí", tone: "text-accent" },
  { icon: BadgeCheck, text: "Báo giá minh bạch trước khi làm", tone: "text-sale" },
];

const defaultSiteSettings = {
  siteName: "Lộc An",
  hotline: "0989386219",
};

const CATEGORY_DROPDOWN_PANEL_HEIGHT = "h-[min(70vh,32rem)]";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [hoveredDropdownCat, setHoveredDropdownCat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<AuthSession | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartBumpKey, setCartBumpKey] = useState(0);
  const { totalItems } = useCart();
  const { data: siteSettings } = useSiteSettings();
  const navigate = useNavigate();
  const location = useLocation();
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

  useEffect(() => {
    if (isScrolled) return;
    setCategoryOpen(false);
    setHoveredDropdownCat(null);
  }, [isScrolled]);

  useEffect(() => {
    if (location.pathname !== "/") return;
    if (window.sessionStorage.getItem(LOGO_HOME_RELOAD_SCROLL_KEY) !== "1") return;

    window.sessionStorage.removeItem(LOGO_HOME_RELOAD_SCROLL_KEY);
    window.history.scrollRestoration = "manual";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const timer = window.setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    const onBump = () => setCartBumpKey((prev) => prev + 1);
    window.addEventListener("cart:bump", onBump);
    return () => window.removeEventListener("cart:bump", onBump);
  }, []);

  const [plusOneVisible, setPlusOneVisible] = useState(false);
  useEffect(() => {
    if (cartBumpKey === 0) return;
    setPlusOneVisible(true);
    const timer = window.setTimeout(() => setPlusOneVisible(false), 750);
    return () => window.clearTimeout(timer);
  }, [cartBumpKey]);

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

  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    setMobileOpen(false);
    setCategoryOpen(false);
    setHoveredDropdownCat(null);

    if (location.pathname === "/") {
      event.preventDefault();
      window.sessionStorage.setItem(LOGO_HOME_RELOAD_SCROLL_KEY, "1");
      window.history.scrollRestoration = "manual";
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      window.location.assign("/");
    }
  };

  const searchForm = (
    <form className="relative" onSubmit={handleSearchSubmit}>
      <input
        type="text"
        name="q"
        placeholder="Tìm laptop, PC gaming, SSD, camera, dịch vụ sửa máy..."
        value={searchQuery}
        onChange={(event) => setSearchQuery(event.target.value)}
        className={cn(
          "w-full rounded-xl border border-white/70 bg-white pl-5 pr-14 text-sm font-medium text-foreground shadow-[0_12px_28px_rgba(15,23,42,0.2)] transition-all duration-300 placeholder:text-muted-foreground/75 focus:outline-none focus:ring-2 focus:ring-accent/50 dark:border-white/15 dark:bg-card/95 dark:text-foreground",
          isScrolled ? "py-2.5" : "py-3.5",
        )}
      />
      <button
        type="submit"
        className="absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg bg-accent text-white shadow-sm ring-1 ring-white/50 transition-colors hover:bg-accent-hover"
        aria-label="Tìm kiếm"
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  );

  const activeCatInDropdown = categories.find((c) => c.id === hoveredDropdownCat) ?? null;

  const categoryDropdown = (
    <div
      className="relative hidden shrink-0 lg:block"
      onMouseEnter={() => setCategoryOpen(true)}
      onMouseLeave={() => {
        setCategoryOpen(false);
        setHoveredDropdownCat(null);
      }}
    >
      <button
        type="button"
        aria-expanded={categoryOpen}
        onClick={() => setCategoryOpen((prev) => !prev)}
        className={cn(
          "inline-flex min-h-12 min-w-[230px] items-center justify-center gap-2 rounded-xl border border-white/25 px-4 text-sm font-semibold text-primary-foreground shadow-[0_14px_30px_rgba(0,0,0,0.2)] ring-1 ring-white/10 transition hover:translate-y-[-1px] hover:bg-white/24",
          "bg-white/16",
        )}
      >
        <Menu className="h-5 w-5" />
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
          <div
            className={cn(
              "flex w-[280px] flex-col overflow-hidden rounded-xl border border-border bg-card text-foreground shadow-panel",
              CATEGORY_DROPDOWN_PANEL_HEIGHT,
            )}
          >
            <div className="shrink-0 border-b bg-gradient-to-r from-primary to-primary-light px-4 py-3 text-sm font-semibold text-primary-foreground">
              Danh mục sản phẩm
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto py-1">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = hoveredDropdownCat === cat.id;
                return (
                  <Link
                    key={cat.id}
                    to={`/${cat.slug}`}
                    onMouseEnter={() => setHoveredDropdownCat(cat.id)}
                    onClick={() => {
                      setCategoryOpen(false);
                      setHoveredDropdownCat(null);
                    }}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors",
                      isActive ? "bg-primary/5 text-primary" : "hover:bg-primary/5 hover:text-primary",
                    )}
                  >
                    {Icon && <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />}
                    <span className="min-w-0 flex-1 truncate">{cat.name}</span>
                    {cat.children && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/70" />}
                  </Link>
                );
              })}
            </div>
          </div>

          {activeCatInDropdown?.children && (
            <div
              className={cn(
                "ml-1 w-[560px] self-start overflow-y-auto rounded-xl border bg-card p-5 shadow-2xl",
                CATEGORY_DROPDOWN_PANEL_HEIGHT,
              )}
            >
              <div className="mb-4 border-b border-border/70 pb-3">
                <p className="text-[15px] font-semibold text-foreground">{activeCatInDropdown.name}</p>
              </div>
              <div className="grid grid-cols-3 gap-x-6 gap-y-5 text-sm">
                {activeCatInDropdown.children.map((group) => (
                  <div
                    key={group.id}
                    className={cn("min-w-0", (group.children?.length ?? 0) >= 5 ? "col-span-2" : "")}
                  >
                    <p className="mb-2 text-[15px] font-semibold text-sale">{group.name}</p>
                    {group.children?.length ? (
                      <div className="space-y-1.5">
                        {group.children.map((child) => (
                          <Link
                            key={child.id}
                            to={`/${activeCatInDropdown.slug}?subcategory=${encodeURIComponent(child.slug)}`}
                            onClick={() => {
                              setCategoryOpen(false);
                              setHoveredDropdownCat(null);
                            }}
                            className="block break-words leading-6 text-foreground/90 transition-colors hover:text-primary"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Link
                        to={`/${activeCatInDropdown.slug}?subcategory=${encodeURIComponent(group.slug)}`}
                        onClick={() => {
                          setCategoryOpen(false);
                          setHoveredDropdownCat(null);
                        }}
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
  );

  return (
    <>
      <div className="hidden bg-primary text-white md:block">
        <div className="section-container flex h-6 items-center justify-between gap-3 text-[11px] leading-none">
          <Link to="/lien-he" className="flex items-center gap-1.5 transition-colors hover:text-accent">
            <MapPin className="h-3.5 w-3.5" />
            <span>Hệ thống cửa hàng tại Hà Nội</span>
          </Link>

          <div className="flex items-center gap-5">
            {promoStrip.slice(0, 3).map((item) => {
              const Icon = item.icon;
              return (
                <span key={item.text} className="inline-flex items-center gap-1.5 font-medium">
                  <Icon className="h-3.5 w-3.5 text-accent" />
                  {item.text}
                </span>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/tai-khoan" className="flex items-center gap-1.5 transition-colors hover:text-accent">
              <Truck className="h-3.5 w-3.5" />
              <span>Tra cứu đơn hàng</span>
            </Link>
          </div>
        </div>
      </div>

      <header className={cn("sticky top-0 z-50 transition-shadow duration-300", isScrolled ? "shadow-header" : "shadow-none")}>
        <div className="header-bg text-primary-foreground ring-1 ring-white/10">
          <div
            className={cn(
              "section-container flex items-center gap-3 py-2 transition-all duration-300 md:gap-4",
              isScrolled ? "min-h-14 md:min-h-[60px]" : "min-h-[64px] md:min-h-[76px]",
            )}
          >
            <button
              className="rounded-lg border border-white/15 bg-white/10 p-2 hover:bg-white/20 lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Mở menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <Link
              to="/"
              className="shrink-0 rounded-xl px-1.5 py-1 transition-colors hover:bg-white/10"
              onClick={handleLogoClick}
            >
              <img
                src={logoLocan}
                alt={settings.siteName}
                className={cn(
                  "w-auto object-contain transition-all duration-300",
                  isScrolled
                    ? "max-h-[44px] max-w-[130px] md:max-h-[52px] md:max-w-[150px]"
                    : "max-h-[52px] max-w-[140px] md:max-h-[64px] md:max-w-[170px]"

                )}
              />
            </Link>

            {isScrolled && categoryDropdown}

            <div className="mx-1 hidden min-w-[20rem] flex-1 md:block">{searchForm}</div>

            <a
              href={`tel:${settings.hotline}`}
              className="hidden shrink-0 items-center gap-2 rounded-xl border border-white/20 bg-white/12 px-3 py-2 shadow-sm transition-colors hover:bg-white/22 md:flex"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-white">
                <Phone className="h-4 w-4" />
              </span>
              <div>
                <div className="text-[11px] font-semibold opacity-80">Tư vấn mua hàng</div>
                <div className="text-base font-semibold leading-5">{hotlineDisplay}</div>
              </div>
            </a>

            <Link
              to="/build-pc"
              className="hidden shrink-0 items-center gap-2 rounded-xl bg-accent px-3 py-2 text-white shadow-sm transition-colors hover:bg-accent-hover xl:flex"
            >
              <Cpu className="h-5 w-5" />
              <div>
                <div className="text-[11px] font-semibold opacity-90">Miễn phí</div>
                <div className="text-sm font-semibold leading-4">Build PC</div>
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
                  <span className="hidden max-w-[84px] truncate text-[10px] md:block">{currentUser.fullName}</span>
                </Link>
              ) : (
                <Link
                  to="/dang-nhap"
                  className="flex min-w-12 flex-col items-center rounded-xl border border-transparent p-1.5 transition-colors hover:border-white/15 hover:bg-white/10"
                >
                  <User className="h-5 w-5 md:h-[18px] md:w-[18px]" />
                  <span className="hidden text-[10px] md:block">Tài khoản</span>
                </Link>
              )}

              <Link
                to="/gio-hang"
                data-cart-icon
                className="relative flex min-w-12 flex-col items-center rounded-xl border border-transparent p-1.5 transition-colors hover:border-white/15 hover:bg-white/10"
              >
                <motion.span
                  key={`cart-icon-${cartBumpKey}`}
                  animate={cartBumpKey > 0 ? { rotate: [0, -14, 12, -8, 0], scale: [1, 1.18, 0.96, 1.06, 1] } : { rotate: 0, scale: 1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="inline-flex"
                >
                  <ShoppingCart className="h-5 w-5 md:h-[18px] md:w-[18px]" />
                </motion.span>
                <span className="hidden text-[10px] md:block">Giỏ hàng</span>
                <motion.span
                  key={`cart-badge-${cartBumpKey}`}
                  animate={cartBumpKey > 0 ? { scale: [1, 1.55, 0.85, 1.2, 1] } : { scale: 1 }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-service text-[10px] font-bold text-service-foreground shadow-sm"
                >
                  {totalItems}
                </motion.span>
                <AnimatePresence>
                  {plusOneVisible && (
                    <motion.span
                      key={`cart-plus-${cartBumpKey}`}
                      initial={{ opacity: 0, y: 4, scale: 0.6 }}
                      animate={{ opacity: 1, y: -18, scale: 1.15 }}
                      exit={{ opacity: 0, y: -28, scale: 0.9 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="pointer-events-none absolute -top-1 right-1 select-none rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-md"
                    >
                      +1
                    </motion.span>
                  )}
                </AnimatePresence>
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
                  Gọi ngay: {hotlineDisplay}
                </a>

                <div className="grid grid-cols-2 gap-2 border-b border-border/50 p-3">
                  {promoStrip.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.text} className="flex items-center gap-2 rounded-lg bg-muted px-2.5 py-2 text-xs font-medium text-foreground">
                        <Icon className={cn("h-4 w-4 shrink-0", item.tone)} />
                        {item.text}
                      </div>
                    );
                  })}
                </div>

                <div className="border-b border-border/50 py-2">
                  <div className="px-4 pb-2 text-xs font-medium text-muted-foreground">
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
      </header>

      <nav className="hidden overflow-visible border-b border-border bg-card/95 shadow-sm backdrop-blur lg:block">
        <div className="section-container">
          <ul className="flex min-h-10 w-full items-center justify-between gap-2 py-1">
            {menuItems.map((item) => (
              <li key={item.path} className="flex-1 text-center">
                <Link
                  to={item.path}
                  className={cn(
                    "nav-link inline-flex items-center justify-center gap-2 px-3",
                    item.strong && "font-semibold",
                  )}
                >
                  <item.icon className={cn("h-4 w-4", item.tone)} />
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
            <li className="hidden flex-1 text-center xl:block">
              <a href={`tel:${settings.hotline}`} className="nav-link inline-flex items-center justify-center gap-2 px-3 font-semibold text-sale">
                <Zap className="h-4 w-4" />
                <span>Tư vấn nhanh {hotlineDisplay}</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
