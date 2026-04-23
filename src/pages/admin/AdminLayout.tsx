import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  MonitorCog,
  FolderTree,
  ShoppingCart,
  Wrench,
  Users,
  UserCog,
  Image,
  FileText,
  Settings,
  Gem,
  Flame,
  LogOut,
  Menu,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Sản phẩm", icon: Package, path: "/admin/san-pham" },
  { label: "Danh mục", icon: FolderTree, path: "/admin/danh-muc" },
  { label: "Đơn hàng", icon: ShoppingCart, path: "/admin/don-hang" },
  { label: "Dịch vụ sửa chữa", icon: Wrench, path: "/admin/dich-vu" },
  { label: "Khách hàng", icon: Users, path: "/admin/khach-hang" },
  { label: "Người dùng", icon: UserCog, path: "/admin/nguoi-dung" },
  { label: "Thành viên", icon: Gem, path: "/admin/thanh-vien" },
  { label: "Build PC", icon: MonitorCog, path: "/admin/build-pc" },
  { label: "Flash Sale", icon: Flame, path: "/admin/flash-sale" },
  { label: "Banner / Slider", icon: Image, path: "/admin/banner" },
  { label: "Tin tức", icon: FileText, path: "/admin/tin-tuc" },
  { label: "Chính sách", icon: FileText, path: "/admin/chinh-sach" },
  { label: "Cài đặt", icon: Settings, path: "/admin/cai-dat" },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">LA</span>
          </div>
          {sidebarOpen && <span className="font-bold text-foreground">Lộc An Admin</span>}
        </Link>
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              isActive(item.path)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-2 border-t border-border">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ChevronDown className="w-5 h-5 shrink-0 rotate-90" />
          {sidebarOpen && <span>Về trang chủ</span>}
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {sidebarOpen && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-border bg-card transition-all duration-200 shrink-0",
          sidebarOpen ? "w-60" : "w-16"
        )}
      >
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-60 bg-card shadow-xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-3 shrink-0">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden lg:flex" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">{user?.name?.charAt(0)?.toUpperCase() || "A"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium hidden sm:block">{user?.name || "Admin"}</span>
              <span className="text-xs text-muted-foreground hidden sm:block capitalize">{(user?.role || "admin").toLowerCase()}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
