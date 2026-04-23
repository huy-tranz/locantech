import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { toast } from "@/hooks/use-toast";
import { isAuthenticated } from "@/lib/auth";
import authApi from "@/api/auth.api";
import { Phone, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/", { replace: true });
      return;
    }

    const state = location.state as { registeredEmail?: string } | null;
    if (state?.registeredEmail) {
      setIdentifier(state.registeredEmail);
    }
  }, [location.state, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const data = await authApi.login(identifier, password);

      // Backend trả { id, email, role, name } → map sang AuthSession shape
      const sessionUser = {
        id: data.user.id,
        fullName: data.user.name,
        phone: data.user.phone ?? "",
        email: data.user.email,
        avatar: data.user.avatar,
      };

      localStorage.setItem('locan_access_token', data.accessToken);
      localStorage.setItem('locan_refresh_token', data.refreshToken);
      localStorage.setItem('locan_auth_user', JSON.stringify(sessionUser));
      window.dispatchEvent(new Event('locan-auth-changed'));

      toast({
        title: "Đăng nhập thành công",
        description: `Xin chào ${sessionUser.fullName}.`,
      });
      navigate("/", { replace: true });
    } catch (err: any) {
      toast({
        title: "Đăng nhập thất bại",
        description: err?.response?.data?.error || "Vui lòng kiểm tra lại thông tin.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="section-container py-8 md:py-12 flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-xl border p-6 md:p-8 shadow-sm">
            <h1 className="text-xl font-bold text-foreground text-center mb-1">Đăng nhập</h1>
            <p className="text-sm text-muted-foreground text-center mb-6">Chào mừng bạn đến với Lộc An</p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">SĐT hoặc Email</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Nhập SĐT hoặc email"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="rounded border-border"
                  />
                  Ghi nhớ
                </label>
                <span className="text-muted-foreground">Đăng nhập bằng tài khoản đã đăng ký</span>
              </div>

              <button type="submit" className="btn-cta w-full py-3 text-base">Đăng nhập</button>
            </form>

            <p className="text-sm text-muted-foreground text-center mt-6">
              Chưa có tài khoản?{" "}
              <Link to="/dang-ky" className="text-primary font-semibold hover:underline">Đăng ký ngay</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
