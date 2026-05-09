import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "@/components/ScrollToTop";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index.tsx";

const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const LaptopPage = lazy(() => import("./pages/LaptopPage.tsx"));
const PCPage = lazy(() => import("./pages/PCPage.tsx"));
const PCGamingPage = lazy(() => import("./pages/PCGamingPage.tsx"));
const LinhKienPage = lazy(() => import("./pages/LinhKienPage.tsx"));
const ManHinhPage = lazy(() => import("./pages/ManHinhPage.tsx"));
const ThietBiMangPage = lazy(() => import("./pages/ThietBiMangPage.tsx"));
const CameraPage = lazy(() => import("./pages/CameraPage.tsx"));
const NgoaiViPage = lazy(() => import("./pages/NgoaiViPage.tsx"));
const FlashSalePage = lazy(() => import("./pages/FlashSalePage.tsx"));
const BuildPCPage = lazy(() => import("./pages/BuildPCPage.tsx"));
const UuDaiThanhVienPage = lazy(() => import("./pages/UuDaiThanhVienPage.tsx"));
const PolicyPage = lazy(() => import("./pages/PolicyPage.tsx"));
const DichVuPage = lazy(() => import("./pages/DichVuPage.tsx"));
const ServiceDetailPage = lazy(() => import("./pages/ServiceDetailPage.tsx"));
const ThuCuDoiMoiPage = lazy(() => import("./pages/ThuCuDoiMoiPage.tsx"));
const TinTucPage = lazy(() => import("./pages/TinTucPage.tsx"));
const LienHePage = lazy(() => import("./pages/LienHePage.tsx"));
const GioiThieuPage = lazy(() => import("./pages/GioiThieuPage.tsx"));
const SearchPage = lazy(() => import("./pages/SearchPage.tsx"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage.tsx"));
const CartPage = lazy(() => import("./pages/CartPage.tsx"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage.tsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.tsx"));
const RegisterPage = lazy(() => import("./pages/RegisterPage.tsx"));
const AccountPage = lazy(() => import("./pages/AccountPage.tsx"));

const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.tsx"));
const AdminLoginPage = lazy(() => import("./pages/admin/AdminLoginPage.tsx"));
const DashboardPage = lazy(() => import("./pages/admin/DashboardPage.tsx"));
const AdminProductsPage = lazy(() => import("./pages/admin/AdminProductsPage.tsx"));
const AdminCategoriesPage = lazy(() => import("./pages/admin/AdminCategoriesPage.tsx"));
const AdminOrdersPage = lazy(() => import("./pages/admin/AdminOrdersPage.tsx"));
const AdminServicesPage = lazy(() => import("./pages/admin/AdminServicesPage.tsx"));
const AdminCustomersPage = lazy(() => import("./pages/admin/AdminCustomersPage.tsx"));
const AdminUsersPage = lazy(() => import("./pages/admin/AdminUsersPage.tsx"));
const AdminBannersPage = lazy(() => import("./pages/admin/AdminBannersPage.tsx"));
const AdminNewsPage = lazy(() => import("./pages/admin/AdminNewsPage.tsx"));
const AdminSettingsPage = lazy(() => import("./pages/admin/AdminSettingsPage.tsx"));
const AdminPoliciesPage = lazy(() => import("./pages/admin/AdminPoliciesPage.tsx"));
const AdminMemberProgramPage = lazy(() => import("./pages/admin/AdminMemberProgramPage.tsx"));
const AdminFlashSalePage = lazy(() => import("./pages/admin/AdminFlashSalePage.tsx"));
const AdminBuildPCPage = lazy(() => import("./pages/admin/AdminBuildPCPage.tsx"));

function AppRoutes() {
  const location = useLocation();
  return (
    <motion.div
      key={location.pathname}
      className="min-h-screen bg-background"
      initial={{ opacity: 0.98, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.16, ease: "easeOut" }}
    >
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/laptop" element={<LaptopPage />} />
          <Route path="/pc" element={<PCPage />} />
          <Route path="/pc-gaming" element={<PCGamingPage />} />
          <Route path="/linh-kien" element={<LinhKienPage />} />
          <Route path="/man-hinh" element={<ManHinhPage />} />
          <Route path="/thiet-bi-mang" element={<ThietBiMangPage />} />
          <Route path="/camera" element={<CameraPage />} />
          <Route path="/ngoai-vi" element={<NgoaiViPage />} />
          <Route path="/flash-sale" element={<FlashSalePage />} />
          <Route path="/build-pc" element={<BuildPCPage />} />
          <Route path="/uu-dai-thanh-vien" element={<UuDaiThanhVienPage />} />
          <Route path="/chinh-sach/:slug" element={<PolicyPage />} />
          <Route path="/huong-dan-mua-hang" element={<PolicyPage />} />
          <Route path="/huong-dan-thanh-toan" element={<PolicyPage />} />
          <Route path="/dich-vu" element={<DichVuPage />} />
          <Route path="/dich-vu/thu-cu-doi-moi" element={<ThuCuDoiMoiPage />} />
          <Route path="/dich-vu/:slug" element={<ServiceDetailPage />} />
          <Route path="/san-pham/:slug" element={<ProductDetailPage />} />
          <Route path="/gio-hang" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/dang-nhap" element={<LoginPage />} />
          <Route path="/dang-ky" element={<RegisterPage />} />
          <Route path="/tai-khoan" element={<AccountPage />} />
          <Route path="/tin-tuc" element={<TinTucPage />} />
          <Route path="/lien-he" element={<LienHePage />} />
          <Route path="/gioi-thieu" element={<GioiThieuPage />} />
          <Route path="/tim-kiem" element={<SearchPage />} />

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="san-pham" element={<AdminProductsPage />} />
            <Route path="danh-muc" element={<AdminCategoriesPage />} />
            <Route path="don-hang" element={<AdminOrdersPage />} />
            <Route path="dich-vu" element={<AdminServicesPage />} />
            <Route path="khach-hang" element={<AdminCustomersPage />} />
            <Route path="nguoi-dung" element={<AdminUsersPage />} />
            <Route path="thanh-vien" element={<AdminMemberProgramPage />} />
            <Route path="build-pc" element={<AdminBuildPCPage />} />
            <Route path="flash-sale" element={<AdminFlashSalePage />} />
            <Route path="banner" element={<AdminBannersPage />} />
            <Route path="tin-tuc" element={<AdminNewsPage />} />
            <Route path="chinh-sach" element={<AdminPoliciesPage />} />
            <Route path="cai-dat" element={<AdminSettingsPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </motion.div>
  );
}

function ThemeSync() {
  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const storedTheme = window.localStorage.getItem("theme");
      const shouldUseDark = storedTheme === "dark" || (!storedTheme && media.matches);
      root.classList.toggle("dark", shouldUseDark);
      root.style.colorScheme = shouldUseDark ? "dark" : "light";
    };

    applyTheme();
    media.addEventListener("change", applyTheme);
    window.addEventListener("storage", applyTheme);

    return () => {
      media.removeEventListener("change", applyTheme);
      window.removeEventListener("storage", applyTheme);
    };
  }, []);

  return null;
}

const App = () => (
  <HelmetProvider>
    <TooltipProvider>
      <ThemeSync />
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </HelmetProvider>
);

export default App;
