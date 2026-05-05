import { useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { useAdminBanners, useCreateBanner, useUpdateBanner, useDeleteBanner } from "@/hooks/queries/cms.queries";
import uploadApi from "@/api/upload.api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Eye, EyeOff, Upload } from "lucide-react";

interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  position?: string;
  isActive: boolean;
  sortOrder?: number;
  startDate?: string | null;
  endDate?: string | null;
}

export default function AdminBannersPage() {
  const { data: banners = [], isLoading } = useAdminBanners();
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const openCreate = () => {
    setEditing({
      id: "",
      title: "",
      subtitle: "",
      image: "",
      link: "/",
      position: "HERO",
      isActive: true,
      sortOrder: 0,
      startDate: null,
      endDate: null,
    });
    setDialogOpen(true);
  };

  const openEdit = (b: Banner) => {
    setEditing({ ...b });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editing?.title || !editing.image) {
      toast({ title: "Nhập tiêu đề và ảnh", variant: "destructive" });
      return;
    }

    const payload = {
      title: editing.title,
      subtitle: editing.subtitle || undefined,
      image: editing.image,
      link: editing.link || undefined,
      position: editing.position || "HERO",
      isActive: editing.isActive,
      sortOrder: Number(editing.sortOrder || 0),
      startDate: editing.startDate || null,
      endDate: editing.endDate || null,
    };

    try {
      if (editing.id) {
        await updateBanner.mutateAsync({ id: editing.id, data: payload });
        toast({ title: "Đã cập nhật banner" });
      } else {
        await createBanner.mutateAsync(payload);
        toast({ title: "Đã thêm banner" });
      }
      setDialogOpen(false);
    } catch {
      toast({ title: "Lỗi khi lưu banner", variant: "destructive" });
    }
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !editing) return;

    try {
      setIsUploading(true);
      const uploaded = await uploadApi.image("banners", file);
      setEditing({ ...editing, image: uploaded.url });
      toast({ title: "Da tai anh banner len" });
    } catch (err: any) {
      toast({
        title: "Tai anh that bai",
        description: err?.response?.data?.error || "Vui long chon file anh duoi 5MB",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const toggleActive = async (b: Banner) => {
    try {
      await updateBanner.mutateAsync({ id: b.id, data: { isActive: !b.isActive } });
      toast({ title: b.isActive ? "Đã ẩn banner" : "Đã hiển thị banner" });
    } catch {
      toast({ title: "Lỗi khi cập nhật", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa banner?")) return;
    try {
      await deleteBanner.mutateAsync(id);
      toast({ title: "Đã xóa banner" });
    } catch {
      toast({ title: "Lỗi khi xóa", variant: "destructive" });
    }
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Đang tải...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Quản lý Banner</h1>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-1" /> Thêm banner</Button>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col gap-3 p-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            Có thể dùng vị trí <span className="font-medium text-foreground">FLASH_SALE</span> cho banner chiến dịch sale.
            Phần danh sách sản phẩm và thời gian đếm ngược được quản lý riêng tại trang Flash Sale admin.
          </p>
          <Button variant="outline" asChild>
            <Link to="/admin/flash-sale">Mở Flash Sale admin</Link>
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {banners.map((b: Banner) => (
          <Card key={b.id} className={!b.isActive ? "opacity-50" : ""}>
            <CardContent className="p-3 flex items-center gap-4">
              <img src={b.image} alt={b.title} className="w-24 h-14 object-cover rounded border shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate">{b.title}</p>
                <p className="text-xs text-muted-foreground truncate">{b.subtitle}</p>
                <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                  <span>{b.position || "HERO"}</span>
                  <span>•</span>
                  <span>{b.link || "—"}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => toggleActive(b)}>
                  {b.isActive ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => openEdit(b)}><Pencil className="w-4 h-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(b.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {banners.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Chưa có banner nào.</p>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing?.id ? "Sửa banner" : "Thêm banner"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-2"><Label>Tiêu đề</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
              <div className="space-y-2"><Label>Subtitle</Label><Input value={editing.subtitle || ""} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} /></div>
              <div className="space-y-2"><Label>Link</Label><Input value={editing.link || ""} onChange={(e) => setEditing({ ...editing, link: e.target.value })} /></div>
              <div className="space-y-2">
                <Label>URL ảnh</Label>
                <Input value={editing.image} onChange={(e) => setEditing({ ...editing, image: e.target.value })} />
                <div className="flex items-center gap-2">
                  <Input id="banner-image-upload" type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} className="hidden" />
                  <Button type="button" variant="outline" className="shrink-0" asChild>
                    <label htmlFor="banner-image-upload" className={isUploading ? "pointer-events-none" : "cursor-pointer"}>
                      <Upload className="w-4 h-4 mr-1" />
                      {isUploading ? "Dang tai..." : "Upload"}
                    </label>
                  </Button>
                </div>
                {editing.image && <img src={editing.image} alt="" className="w-full h-32 object-cover rounded border mt-1" />}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Vị trí</Label>
                  <Select value={editing.position || "HERO"} onValueChange={(v) => setEditing({ ...editing, position: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HERO">HERO</SelectItem>
                      <SelectItem value="HOME_TOP">HOME_TOP</SelectItem>
                      <SelectItem value="FLASH_SALE">FLASH_SALE</SelectItem>
                      <SelectItem value="SIDEBAR">SIDEBAR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Thứ tự</Label>
                  <Input type="number" value={editing.sortOrder ?? 0} onChange={(e) => setEditing({ ...editing, sortOrder: Number(e.target.value || 0) })} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={editing.isActive} onCheckedChange={(v) => setEditing({ ...editing, isActive: v })} />
                <Label>Hiển thị</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
                <Button onClick={handleSave} disabled={createBanner.isPending || updateBanner.isPending}>
                  {createBanner.isPending || updateBanner.isPending ? "Đang lưu..." : "Lưu"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
