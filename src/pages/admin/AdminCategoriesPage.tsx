import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import {
  useCategories,
  useCategoriesFlat,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/queries/category.queries";
import { Plus, Pencil, Trash2, ChevronRight, FolderTree } from "lucide-react";

interface CategoryForm {
  id?: string;
  name: string;
  parentId: string;
}

interface FlatCategory {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
}

const normalizeSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

export default function AdminCategoriesPage() {
  const { data: nestedCategories = [] } = useCategories();
  const { data: flatCategories = [] } = useCategoriesFlat();

  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryForm>({ name: "", parentId: "none" });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const flatById = useMemo(() => {
    const map = new Map<string, FlatCategory>();
    (flatCategories as any[]).forEach((c) => map.set(c.id, c as FlatCategory));
    return map;
  }, [flatCategories]);

  const rootCategories = useMemo(
    () => (flatCategories as FlatCategory[]).filter((c) => !c.parentId),
    [flatCategories]
  );

  const openCreate = (parentId = "none") => {
    setEditing({ name: "", parentId });
    setDialogOpen(true);
  };

  const openEdit = (cat: { id: string; name: string; parentId?: string | null }) => {
    setEditing({ id: cat.id, name: cat.name, parentId: cat.parentId || "none" });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editing.name.trim()) {
      toast({ title: "Vui lòng nhập tên danh mục", variant: "destructive" });
      return;
    }

    const payload = {
      name: editing.name.trim(),
      parentId: editing.parentId !== "none" ? editing.parentId : undefined,
      slug: normalizeSlug(editing.name),
    };

    try {
      if (editing.id) {
        await updateMutation.mutateAsync({ id: editing.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setDialogOpen(false);
      toast({ title: "Đã lưu danh mục" });
    } catch (err: any) {
      toast({ title: "Lưu danh mục thất bại", description: err?.response?.data?.error || "Có lỗi xảy ra", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa danh mục này?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: "Đã xóa danh mục" });
    } catch (err: any) {
      toast({ title: "Xóa danh mục thất bại", description: err?.response?.data?.error || "Có lỗi xảy ra", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Quản lý danh mục</h1>
        <Button onClick={() => openCreate()}>
          <Plus className="w-4 h-4 mr-1" /> Thêm danh mục
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 space-y-1">
          {(nestedCategories as any[]).map((cat) => (
            <div key={cat.id}>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted group">
                <FolderTree className="w-5 h-5 text-primary shrink-0" />
                <span className="font-medium text-foreground flex-1">{cat.name}</span>
                <span className="text-xs text-muted-foreground">{cat.children?.length || 0} danh mục con</span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openCreate(cat.id)}>
                    <Plus className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(cat)}>
                    <Pencil className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(cat.id)}>
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </Button>
                </div>
              </div>

              {cat.children?.map((child: any) => (
                <div key={child.id} className="flex items-center gap-3 pl-10 pr-3 py-2 rounded-lg hover:bg-muted/50 group">
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground flex-1">{child.name}</span>
                  <span className="text-xs text-muted-foreground">/{child.slug}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(child)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDelete(child.id)}>
                      <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing.id ? "Sửa danh mục" : "Thêm danh mục"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tên danh mục</Label>
              <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Danh mục cha</Label>
              <Select
                value={editing.parentId}
                onValueChange={(v) => setEditing({ ...editing, parentId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục cha" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không có (danh mục gốc)</SelectItem>
                  {rootCategories
                    .filter((c) => c.id !== editing.id)
                    .map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {editing.id && editing.parentId !== "none" && (
                <p className="text-xs text-muted-foreground">
                  Danh mục cha hiện tại: {flatById.get(editing.parentId)?.name || "Không xác định"}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isSaving}>Hủy</Button>
              <Button onClick={handleSave} disabled={isSaving}>Lưu</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
