import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { toast } from "@/hooks/use-toast";
import { isAuthenticated } from "@/lib/auth";
import authApi from "@/api/auth.api";
import { User, Phone, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [showPw, setShowPw] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Validation phía frontend
  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast({ title: "Vui lòng nhập họ và tên.", variant: "destructive" });
      return false;
    }
    const phoneRegex = /^(0[0-9]{9,10})$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ""))) {
      toast({ title: "Số điện thoại không hợp lệ. Vui lòng nhập 10-11 chữ số bắt đầu bằng 0.", variant: "destructive" });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({ title: "Email không hợp lệ.", variant: "destructive" });
      return false;
    }
    if (formData.password.length < 6) {
      toast({ title: "Mật khẩu phải có ít nhất 6 ký tự.", variant: "destructive" });
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Mật khẩu chưa khớp.", description: "Vui lòng kiểm tra lại phần xác nhận mật khẩu.", variant: "destructive" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await authApi.register({
        name: formData.fullName.trim(),
        phone: formData.phone.replace(/\s/g, "") || undefined,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      toast({
        title: "Đăng ký thành công",
        description: "Bạn hãy đăng nhập bằng tài khoản vừa tạo.",
      });

      navigate("/dang-nhap", {
        replace: true,
        state: { registeredEmail: formData.email.trim().toLowerCase() },
      });
    } catch (err: any) {
      // Backend trả { error, details: [{ message }] } khi validation fail
      const details = err?.response?.data?.details;
      const detailMsg = Array.isArray(details) && details[0]?.message
        ? details[0].message
        : err?.response?.data?.error || err?.response?.data?.message || "Vui lòng thử lại.";
      toast({
        title: "Đăng ký không thành công",
        description: detailMsg,
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
            <h1 className="text-xl font-bold text-foreground text-center mb-1">Tạo tài khoản</h1>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Đăng ký để mua hàng và theo dõi đơn tại Lộc An
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Họ và tên</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Nhập họ và tên"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Số điện thoại</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="tel"
                    placeholder="Nhập số điện thoại"
                    required
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    placeholder="Nhập email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
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
                    placeholder="Tối thiểu 6 ký tự"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
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

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Nhập lại mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    required
                    minLength={6}
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground"
                  />
                </div>
              </div>

              <button type="submit" className="btn-cta w-full py-3 text-base">Đăng ký</button>
            </form>

            <p className="text-sm text-muted-foreground text-center mt-6">
              Đã có tài khoản?{" "}
              <Link to="/dang-nhap" className="text-primary font-semibold hover:underline">Đăng nhập</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
