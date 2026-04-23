import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, logout } = useAuth();
  const from = (location.state as any)?.from?.pathname || "/admin";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const loggedUser = await login(email, password);

      if (!["ADMIN", "SUPERADMIN"].includes(loggedUser.role)) {
        logout();
        toast({ title: "Tài khoản không có quyền quản trị", variant: "destructive" });
        return;
      }

      navigate(from, { replace: true });
      toast({ title: "Đăng nhập thành công", description: "Chào mừng bạn đến với Lộc An Admin" });
    } catch (err: any) {
      toast({
        title: "Sai thông tin đăng nhập",
        description: err?.response?.data?.error || "Vui lòng kiểm tra email/mật khẩu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="w-12 h-12 rounded-xl bg-primary mx-auto mb-2 flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">LA</span>
          </div>
          <CardTitle className="text-xl">Đăng nhập Admin</CardTitle>
          <p className="text-sm text-muted-foreground">Lộc An - Quản trị hệ thống</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@locan.vn" />
            </div>
            <div className="space-y-2">
              <Label>Mật khẩu</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
