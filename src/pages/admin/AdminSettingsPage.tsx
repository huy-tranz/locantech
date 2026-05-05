import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Save } from "lucide-react";
import { useSiteSettings, useUpdateSettings } from "@/hooks/queries/settings.queries";

const defaultSettings = {
  siteName: "Lộc An - Máy tính & Dịch vụ IT",
  hotline: "0989386219",
  email: "info@locan.vn",
  address: "7 La Dương, Hà Đông, Hà Nội",
  workingHours: "8:00 - 21:00 (Thứ 2 - Chủ nhật)",
  facebook: "https://facebook.com/locantech",
  zalo: "0989386219",
  footerText: "© 2025 Lộc An. Chuyên máy tính, linh kiện, dịch vụ sửa chữa tại Hà Đông.",
  seoTitle: "Lộc An - Máy tính, Linh kiện, Sửa chữa tại Hà Đông",
  seoDescription:
    "Lộc An cung cấp laptop, PC, linh kiện máy tính chính hãng và dịch vụ sửa chữa uy tín tại Hà Đông, Hà Nội.",
};

export default function AdminSettingsPage() {
  const { data: remote, isLoading } = useSiteSettings();
  const updateSettings = useUpdateSettings();

  // Local form state – initialised from server or defaults
  const [form, setForm] = useState(defaultSettings);

  // Sync form when server data arrives
  useEffect(() => {
    if (remote) setForm({ ...defaultSettings, ...remote });
  }, [remote]);

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    try {
      await updateSettings.mutateAsync(form);
      toast({ title: "Đã lưu cài đặt thành công" });
    } catch {
      toast({ title: "Lỗi khi lưu cài đặt", variant: "destructive" });
    }
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Đang tải...</div>;

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">Cài đặt hệ thống</h1>

      <Card>
        <CardHeader><CardTitle className="text-base">Thông tin cửa hàng</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Tên website</Label><Input value={form.siteName} onChange={(e) => update("siteName", e.target.value)} /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Hotline</Label><Input value={form.hotline} onChange={(e) => update("hotline", e.target.value)} /></div>
            <div className="space-y-2"><Label>Email</Label><Input value={form.email} onChange={(e) => update("email", e.target.value)} /></div>
          </div>
          <div className="space-y-2"><Label>Địa chỉ</Label><Input value={form.address} onChange={(e) => update("address", e.target.value)} /></div>
          <div className="space-y-2"><Label>Giờ làm việc</Label><Input value={form.workingHours} onChange={(e) => update("workingHours", e.target.value)} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Mạng xã hội</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Facebook</Label><Input value={form.facebook || ""} onChange={(e) => update("facebook", e.target.value)} /></div>
          <div className="space-y-2"><Label>Zalo</Label><Input value={form.zalo || ""} onChange={(e) => update("zalo", e.target.value)} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">SEO & Footer</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>SEO Title</Label><Input value={form.seoTitle || ""} onChange={(e) => update("seoTitle", e.target.value)} /></div>
          <div className="space-y-2"><Label>SEO Description</Label><Textarea value={form.seoDescription || ""} onChange={(e) => update("seoDescription", e.target.value)} rows={2} /></div>
          <div className="space-y-2"><Label>Footer text</Label><Input value={form.footerText || ""} onChange={(e) => update("footerText", e.target.value)} /></div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={updateSettings.isPending} className="w-full sm:w-auto">
        <Save className="w-4 h-4 mr-1" />
        {updateSettings.isPending ? "Đang lưu..." : "Lưu cài đặt"}
      </Button>
    </div>
  );
}
