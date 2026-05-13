import { useMemo, useState, type ChangeEvent } from "react";
import uploadApi from "@/api/upload.api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  useProducts as useProductsQuery,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/queries/product.queries";
import { useCategoriesFlat } from "@/hooks/queries/category.queries";
import { ArrowDown, ArrowUp, Plus, Search, Pencil, Trash2, Save, Upload } from "lucide-react";

const formatPrice = (p: number) => p.toLocaleString("vi-VN") + "đ";

type UiStatus = "in_stock" | "coming_soon" | "out_of_stock";

const statusMap: Record<UiStatus, { label: string; class: string }> = {
  in_stock: { label: "Còn hàng", class: "bg-green-100 text-green-700" },
  out_of_stock: { label: "Hết hàng", class: "bg-red-100 text-red-700" },
  coming_soon: { label: "Sắp về", class: "bg-yellow-100 text-yellow-700" },
};

interface ProductForm {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  brand: string;
  price: number;
  originalPrice?: number;
  stock: number;
  status: UiStatus;
  images: string[];
  shortDesc: string;
  tags: string[];
  featured: boolean;
  bestSeller: boolean;
  specs: Record<string, string>;
}

interface UiProduct extends ProductForm {
  id: string;
  categoryName: string;
}

const emptyProduct: ProductForm = {
  name: "",
  slug: "",
  sku: "",
  categoryId: "",
  brand: "",
  price: 0,
  originalPrice: undefined,
  stock: 0,
  status: "in_stock",
  images: [],
  shortDesc: "",
  tags: [],
  featured: false,
  bestSeller: false,
  specs: {},
};

const normalizeSlug = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

const toApiStatus = (status: UiStatus) => (status === "coming_soon" ? "DRAFT" : "PUBLISHED");

const fromApiStatus = (status?: string, quantity = 0): UiStatus => {
  if (status === "DRAFT") return "coming_soon";
  if (quantity <= 0) return "out_of_stock";
  return "in_stock";
};

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ProductForm | null>(null);
  const [specKey, setSpecKey] = useState("");
  const [specVal, setSpecVal] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { data: productRes, isLoading } = useProductsQuery({ status: "all", limit: 200 });
  const { data: flatCategories = [] } = useCategoriesFlat();

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const deleteMutation = useDeleteProduct();

  const categoryNameById = useMemo(() => {
    const map = new Map<string, string>();
    (flatCategories as any[]).forEach((c) => map.set(c.id, c.name));
    return map;
  }, [flatCategories]);

  const items = useMemo<UiProduct[]>(() => {
    const products = (productRes?.products || []) as any[];
    return products.map((p) => {
      const images = Array.from(new Set([p.thumbnail, ...(p.images || [])].filter(Boolean))) as string[];
      return {
        id: p.id,
        name: p.name || "",
        slug: p.slug || "",
        sku: p.sku || "",
        categoryId: p.categoryId || p.category?.id || "",
        categoryName: p.category?.name || categoryNameById.get(p.categoryId || "") || "",
        brand: p.brand || "",
        price: Number(p.price || 0),
        originalPrice: p.comparePrice != null ? Number(p.comparePrice) : undefined,
        stock: Number(p.quantity || 0),
        status: fromApiStatus(p.status, Number(p.quantity || 0)),
        images,
        shortDesc: p.shortDesc || "",
        tags: Array.isArray(p.tags) ? p.tags : [],
        featured: !!p.isFeatured,
        bestSeller: !!p.isBestSeller,
        specs: (p.specifications as Record<string, string>) || {},
      };
    });
  }, [categoryNameById, productRes]);

  const filtered = useMemo(() => {
    return items.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCat = filterCat === "all" || p.categoryId === filterCat;
      return matchSearch && matchCat;
    });
  }, [items, search, filterCat]);

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const openCreate = () => {
    setEditing({ ...emptyProduct });
    setImageUrl("");
    setDialogOpen(true);
  };

  const openEdit = (p: UiProduct) => {
    setEditing({ ...p });
    setImageUrl("");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editing?.name.trim()) {
      toast({ title: "Vui lòng nhập tên sản phẩm", variant: "destructive" });
      return;
    }

    if (!editing.sku.trim()) {
      toast({ title: "Vui lòng nhập mã SP", variant: "destructive" });
      return;
    }

    const slug = editing.slug?.trim() || normalizeSlug(editing.name);
    const images = Array.from(new Set((editing.images || []).map((img) => img.trim()).filter(Boolean)));
    const payload = {
      name: editing.name.trim(),
      slug,
      sku: editing.sku.trim(),
      categoryId: editing.categoryId || null,
      brand: editing.brand?.trim() || null,
      price: Number(editing.price || 0),
      comparePrice: editing.originalPrice ? Number(editing.originalPrice) : null,
      quantity: Math.max(0, Number(editing.stock || 0)),
      shortDesc: editing.shortDesc?.trim() || null,
      tags: editing.tags || [],
      isFeatured: !!editing.featured,
      isBestSeller: !!editing.bestSeller,
      specifications: editing.specs || {},
      images,
      thumbnail: images[0] || null,
      status: toApiStatus(editing.status),
    };

    try {
      if (editing.id) {
        await updateMutation.mutateAsync({ id: editing.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setDialogOpen(false);
      toast({ title: "Đã lưu sản phẩm thành công" });
    } catch (err: any) {
      toast({ title: "Lưu sản phẩm thất bại", description: err?.response?.data?.error || "Có lỗi xảy ra", variant: "destructive" });
    }
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length || !editing) return;

    try {
      setIsUploading(true);
      const uploaded = await Promise.all(files.map((file) => uploadApi.image("products", file)));
      const nextImages = [...editing.images, ...uploaded.map((item) => item.url)];
      setEditing({ ...editing, images: Array.from(new Set(nextImages)) });
      toast({ title: `Da tai ${uploaded.length} anh san pham len` });
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

  const addImageUrl = () => {
    if (!editing) return;
    const urls = imageUrl
      .split(/\r?\n|,/)
      .map((url) => url.trim())
      .filter(Boolean);
    if (!urls.length) return;
    setEditing({ ...editing, images: Array.from(new Set([...editing.images, ...urls])) });
    setImageUrl("");
  };

  const removeImage = (index: number) => {
    if (!editing) return;
    setEditing({ ...editing, images: editing.images.filter((_, i) => i !== index) });
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    if (!editing) return;
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= editing.images.length) return;
    const images = [...editing.images];
    [images[index], images[nextIndex]] = [images[nextIndex], images[index]];
    setEditing({ ...editing, images });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: "Đã xóa sản phẩm" });
    } catch (err: any) {
      toast({ title: "Xóa sản phẩm thất bại", description: err?.response?.data?.error || "Có lỗi xảy ra", variant: "destructive" });
    }
  };

  const addSpec = () => {
    if (!specKey || !specVal || !editing) return;
    setEditing({ ...editing, specs: { ...editing.specs, [specKey]: specVal } });
    setSpecKey("");
    setSpecVal("");
  };

  const removeSpec = (key: string) => {
    if (!editing) return;
    const specs = { ...editing.specs };
    delete specs[key];
    setEditing({ ...editing, specs });
  };

  const toggleTag = (tag: string) => {
    if (!editing) return;
    const tags = editing.tags || [];
    setEditing({
      ...editing,
      tags: tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-foreground">Quản lý sản phẩm</h1>
        <Button onClick={openCreate} className="shrink-0">
          <Plus className="w-4 h-4 mr-1" /> Thêm sản phẩm
        </Button>
      </div>

      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên, mã SP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterCat} onValueChange={setFilterCat}>
            <SelectTrigger className="w-full sm:w-56">
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {(flatCategories as any[]).map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Ảnh</TableHead>
                  <TableHead>Tên sản phẩm</TableHead>
                  <TableHead className="text-right">Giá</TableHead>
                  <TableHead className="text-right">Giá KM</TableHead>
                  <TableHead className="text-center">Tồn</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!isLoading && filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <img src={p.images[0] || "/placeholder.svg"} alt={p.name} className="w-12 h-12 object-contain rounded border bg-white" />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground text-sm line-clamp-1">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.sku}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-sm">{formatPrice(p.price)}</TableCell>
                    <TableCell className="text-right text-sm">
                      {p.originalPrice ? (
                        <div>
                          <span className="line-through text-muted-foreground">{formatPrice(p.originalPrice)}</span>
                          {p.originalPrice > p.price && (
                            <Badge variant="destructive" className="ml-1 text-xs">
                              -{Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%
                            </Badge>
                          )}
                        </div>
                      ) : "—"}
                    </TableCell>
                    <TableCell className="text-center">{p.stock}</TableCell>
                    <TableCell className="text-sm">{p.categoryName || "—"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusMap[p.status].class}`}>
                        {statusMap[p.status].label}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} disabled={deleteMutation.isPending}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Đang tải sản phẩm...</TableCell>
                  </TableRow>
                )}
                {!isLoading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Không tìm thấy sản phẩm</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">Hiển thị {filtered.length} / {items.length} sản phẩm</p>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tên sản phẩm *</Label>
                  <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Mã SP *</Label>
                  <Input value={editing.sku} onChange={(e) => setEditing({ ...editing, sku: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Danh mục</Label>
                  <Select value={editing.categoryId} onValueChange={(v) => setEditing({ ...editing, categoryId: v })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn" />
                    </SelectTrigger>
                    <SelectContent>
                      {(flatCategories as any[]).map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Thương hiệu</Label>
                  <Input value={editing.brand} onChange={(e) => setEditing({ ...editing, brand: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <Select value={editing.status} onValueChange={(v: UiStatus) => setEditing({ ...editing, status: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_stock">Còn hàng</SelectItem>
                      <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                      <SelectItem value="coming_soon">Sắp về</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Giá bán *</Label>
                  <Input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: +e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Giá gốc</Label>
                  <Input
                    type="number"
                    value={editing.originalPrice || ""}
                    onChange={(e) => setEditing({ ...editing, originalPrice: +e.target.value || undefined })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tồn kho</Label>
                  <Input type="number" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: +e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mô tả ngắn</Label>
                <Textarea value={editing.shortDesc} onChange={(e) => setEditing({ ...editing, shortDesc: e.target.value })} rows={2} />
              </div>

              <div className="space-y-2">
                <Label>Ảnh sản phẩm</Label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Dán URL ảnh, nhiều URL cách nhau bằng dấu phẩy"
                  />
                  <Button type="button" variant="outline" onClick={addImageUrl} className="shrink-0">
                    <Plus className="w-4 h-4 mr-1" />
                    Thêm URL
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Input id="product-image-upload" type="file" accept="image/*" multiple onChange={handleImageUpload} disabled={isUploading} className="hidden" />
                  <Button type="button" variant="outline" className="shrink-0" asChild>
                    <label htmlFor="product-image-upload" className={isUploading ? "pointer-events-none" : "cursor-pointer"}>
                      <Upload className="w-4 h-4 mr-1" />
                      {isUploading ? "Dang tai..." : "Upload nhiều ảnh"}
                    </label>
                  </Button>
                </div>
                {editing.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {editing.images.map((img, index) => (
                      <div key={`${img}-${index}`} className="rounded border bg-white p-2">
                        <div className="relative aspect-square">
                          <img src={img} alt="" className="h-full w-full object-contain" />
                          {index === 0 && (
                            <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                              Ảnh chính
                            </span>
                          )}
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-1">
                          <Button type="button" variant="outline" size="icon" onClick={() => moveImage(index, -1)} disabled={index === 0}>
                            <ArrowUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button type="button" variant="outline" size="icon" onClick={() => moveImage(index, 1)} disabled={index === editing.images.length - 1}>
                            <ArrowDown className="h-3.5 w-3.5" />
                          </Button>
                          <Button type="button" variant="outline" size="icon" onClick={() => removeImage(index)}>
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Thông số kỹ thuật</Label>
                <div className="flex gap-2">
                  <Input placeholder="Tên (VD: CPU)" value={specKey} onChange={(e) => setSpecKey(e.target.value)} className="flex-1" />
                  <Input placeholder="Giá trị" value={specVal} onChange={(e) => setSpecVal(e.target.value)} className="flex-1" />
                  <Button type="button" variant="outline" onClick={addSpec}>Thêm</Button>
                </div>
                {editing.specs && Object.entries(editing.specs).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2 text-sm bg-muted px-3 py-1.5 rounded">
                    <span className="font-medium">{k}:</span> <span>{v}</span>
                    <button onClick={() => removeSpec(k)} className="ml-auto text-destructive text-xs">Xóa</button>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {["bán chạy", "mới", "giảm giá"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                        editing.tags?.includes(tag)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isSaving}>Hủy</Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-1" /> Lưu sản phẩm
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
