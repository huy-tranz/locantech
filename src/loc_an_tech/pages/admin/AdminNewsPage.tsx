import { useState } from "react";
import { useAdminNews, useCreateNews, useUpdateNews, useDeleteNews } from "@/hooks/queries/cms.queries";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image?: string;
  author?: string;
  isPublished: boolean;
  publishedAt?: string | null;
  createdAt?: string;
}

export default function AdminNewsPage() {
  const { data, isLoading } = useAdminNews({ limit: 200 });
  const articles: NewsArticle[] = (data as any)?.articles || [];
  const createNews = useCreateNews();
  const updateNews = useUpdateNews();
  const deleteNews = useDeleteNews();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<NewsArticle | null>(null);

  const openCreate = () => {
    setEditing({
      id: "",
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      image: "",
      author: "",
      isPublished: true,
      publishedAt: new Date().toISOString(),
    });
    setDialogOpen(true);
  };

  const openEdit = (a: NewsArticle) => {
    setEditing({ ...a });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editing?.title || !editing.content) {
      toast({ title: "Nhập tiêu đề và nội dung", variant: "destructive" });
      return;
    }

    const slug = editing.slug || editing.title.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

    const payload = {
      title: editing.title,
      slug,
      excerpt: editing.excerpt || undefined,
      content: editing.content,
      image: editing.image || undefined,
      author: editing.author || undefined,
      isPublished: editing.isPublished,
      publishedAt: editing.isPublished ? (editing.publishedAt || new Date().toISOString()) : null,
    };

    try {
      if (editing.id) {
        await updateNews.mutateAsync({ id: editing.id, data: payload });
        toast({ title: "Đã cập nhật bài viết" });
      } else {
        await createNews.mutateAsync(payload);
        toast({ title: "Đã thêm bài viết" });
      }
      setDialogOpen(false);
    } catch {
      toast({ title: "Lỗi khi lưu bài viết", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa bài viết?")) return;
    try {
      await deleteNews.mutateAsync(id);
      toast({ title: "Đã xóa bài viết" });
    } catch {
      toast({ title: "Lỗi khi xóa", variant: "destructive" });
    }
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Đang tải...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Quản lý tin tức</h1>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-1" /> Thêm bài viết</Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Ảnh</TableHead>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Tác giả</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày đăng</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>{a.image ? <img src={a.image} alt="" className="w-12 h-8 object-cover rounded" /> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
                  <TableCell className="font-medium text-sm">{a.title}</TableCell>
                  <TableCell className="text-sm">{a.author || "—"}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.isPublished ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                      {a.isPublished ? "Đã đăng" : "Nháp"}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString("vi-VN") : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(a)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {articles.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Chưa có bài viết nào.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editing?.id ? "Sửa bài viết" : "Thêm bài viết"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-2"><Label>Tiêu đề</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
              <div className="space-y-2"><Label>Slug</Label><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} placeholder="Tự tạo" /></div>
              <div className="space-y-2"><Label>Mô tả ngắn</Label><Textarea value={editing.excerpt || ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} rows={2} /></div>
              <div className="space-y-2"><Label>Nội dung</Label><Textarea value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={8} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Tác giả</Label><Input value={editing.author || ""} onChange={(e) => setEditing({ ...editing, author: e.target.value })} /></div>
                <div className="space-y-2"><Label>Ngày đăng</Label><Input type="datetime-local" value={editing.publishedAt ? new Date(editing.publishedAt).toISOString().slice(0, 16) : ""} onChange={(e) => setEditing({ ...editing, publishedAt: e.target.value ? new Date(e.target.value).toISOString() : null })} /></div>
              </div>
              <div className="space-y-2">
                <Label>URL ảnh đại diện</Label>
                <Input value={editing.image || ""} onChange={(e) => setEditing({ ...editing, image: e.target.value })} />
                {editing.image && <img src={editing.image} alt="" className="w-full h-32 object-cover rounded border mt-1" />}
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={editing.isPublished} onCheckedChange={(v) => setEditing({ ...editing, isPublished: v })} />
                <Label>Xuất bản</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
                <Button onClick={handleSave} disabled={createNews.isPending || updateNews.isPending}>
                  {createNews.isPending || updateNews.isPending ? "Đang lưu..." : "Lưu bài viết"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
