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
import NotFound from "./pages/NotFound.tsx";
import LaptopPage from "./pages/LaptopPage.tsx";
import PCPage from "./pages/PCPage.tsx";
import PCGamingPage from "./pages/PCGamingPage.tsx";
import LinhKienPage from "./pages/LinhKienPage.tsx";
import ManHinhPage from "./pages/ManHinhPage.tsx";
import ThietBiMangPage from "./pages/ThietBiMangPage.tsx";
import CameraPage from "./pages/CameraPage.tsx";
import NgoaiViPage from "./pages/NgoaiViPage.tsx";
import FlashSalePage from "./pages/FlashSalePage.tsx";
import BuildPCPage from "./pages/BuildPCPage.tsx";
import UuDaiThanhVienPage from "./pages/UuDaiThanhVienPage.tsx";
import PolicyPage from "./pages/PolicyPage.tsx";
import DichVuPage from "./pages/DichVuPage.tsx";
import ServiceDetailPage from "./pages/ServiceDetailPage.tsx";
import ThuCuDoiMoiPage from "./pages/ThuCuDoiMoiPage.tsx";
import TinTucPage from "./pages/TinTucPage.tsx";
import LienHePage from "./pages/LienHePage.tsx";
import GioiThieuPage from "./pages/GioiThieuPage.tsx";
import SearchPage from "./pages/SearchPage.tsx";
import ProductDetailPage from "./pages/ProductDetailPage.tsx";
import CartPage from "./pages/CartPage.tsx";
import CheckoutPage from "./pages/CheckoutPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import AccountPage from "./pages/AccountPage.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminLoginPage from "./pages/admin/AdminLoginPage.tsx";
import DashboardPage from "./pages/admin/DashboardPage.tsx";
import AdminProductsPage from "./pages/admin/AdminProductsPage.tsx";
import AdminCategoriesPage from "./pages/admin/AdminCategoriesPage.tsx";
import AdminOrdersPage from "./pages/admin/AdminOrdersPage.tsx";
import AdminServicesPage from "./pages/admin/AdminServicesPage.tsx";
import AdminCustomersPage from "./pages/admin/AdminCustomersPage.tsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.tsx";
import AdminBannersPage from "./pages/admin/AdminBannersPage.tsx";
import AdminNewsPage from "./pages/admin/AdminNewsPage.tsx";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage.tsx";
import AdminPoliciesPage from "./pages/admin/AdminPoliciesPage.tsx";
import AdminMemberProgramPage from "./pages/admin/AdminMemberProgramPage.tsx";
import AdminFlashSalePage from "./pages/admin/AdminFlashSalePage.tsx";
import AdminBuildPCPage from "./pages/admin/AdminBuildPCPage.tsx";

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
    </motion.div>
  );
}

const App = () => (
  <HelmetProvider>
    <TooltipProvider>
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
