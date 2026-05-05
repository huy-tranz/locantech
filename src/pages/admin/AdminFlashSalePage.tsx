import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { formatPrice, type Product } from "@/data/products";
import { getFlashSaleConfig, saveFlashSaleConfig } from "@/data/flashSale";
import { useProducts } from "@/hooks/queries/product.queries";
import { getProductsFromResponse } from "@/lib/productAdapter";
import { Plus, Save, Trash2 } from "lucide-react";

function toDatetimeLocal(value: string) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

function fromDatetimeLocal(value: string) {
  if (!value) return "";
  return new Date(value).toISOString();
}

export default function AdminFlashSalePage() {
  const { data: productRes } = useProducts({ status: "all", limit: 100 });
  const allProducts = useMemo(() => getProductsFromResponse(productRes), [productRes]);
  const [config, setConfig] = useState(() => getFlashSaleConfig());
  const [search, setSearch] = useState("");

  const selectedProducts = useMemo(
    () =>
      config.selectedProductIds
        .map((id) => allProducts.find((product) => product.id === id))
        .filter(Boolean) as Product[],
    [allProducts, config.selectedProductIds],
  );

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return allProducts.filter((product) => {
      if (config.selectedProductIds.includes(product.id)) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      return (
        product.name.toLowerCase().includes(keyword) ||
        product.category.toLowerCase().includes(keyword) ||
        product.brand.toLowerCase().includes(keyword)
      );
    });
  }, [allProducts, config.selectedProductIds, search]);

  const totalOriginal = selectedProducts.reduce((sum, product) => sum + (product.originalPrice ?? product.price), 0);
  const totalSale = selectedProducts.reduce((sum, product) => sum + product.price, 0);

  const handleSave = () => {
    saveFlashSaleConfig(config);
    toast({ title: "Đã lưu chiến dịch Flash Sale" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Flash Sale</h1>
          <p className="text-sm text-muted-foreground">
            Chọn sản phẩm sale, cấu hình thời gian chiến dịch và banner hiển thị cho landing page.
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Lưu chiến dịch
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Thông tin chiến dịch</CardTitle>
            <CardDescription>Những nội dung này sẽ hiển thị ở phần đầu trang Flash Sale.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tiêu đề</Label>
              <Input value={config.title} onChange={(event) => setConfig((current) => ({ ...current, title: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Mô tả ngắn</Label>
              <Input
                value={config.subtitle}
                onChange={(event) => setConfig((current) => ({ ...current, subtitle: event.target.value }))}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Badge nổi bật</Label>
                <Input
                  value={config.badge}
                  onChange={(event) => setConfig((current) => ({ ...current, badge: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Thời gian kết thúc</Label>
                <Input
                  type="datetime-local"
                  value={toDatetimeLocal(config.endAt)}
                  onChange={(event) => setConfig((current) => ({ ...current, endAt: fromDatetimeLocal(event.target.value) }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Ảnh banner chiến dịch</Label>
              <Input
                placeholder="https://..."
                value={config.bannerImage}
                onChange={(event) => setConfig((current) => ({ ...current, bannerImage: event.target.value }))}
              />
              {config.bannerImage ? (
                <img src={config.bannerImage} alt="Banner flash sale" className="h-40 w-full rounded-lg object-cover border" />
              ) : (
                <div className="flex h-40 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
                  Chưa có ảnh banner. Bạn vẫn có thể chạy Flash Sale chỉ với nền gradient mặc định.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Tóm tắt chọn sản phẩm</CardTitle>
            <CardDescription>Danh sách này sẽ render trực tiếp ngoài trang Flash Sale.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Sản phẩm đã chọn</span>
              <Badge variant="secondary">{selectedProducts.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tổng giá niêm yết</span>
              <span className="font-medium">{formatPrice(totalOriginal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tổng giá Flash Sale</span>
              <span className="font-medium text-sale">{formatPrice(totalSale)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Tổng tiết kiệm</span>
              <span className="font-semibold text-sale">{formatPrice(Math.max(totalOriginal - totalSale, 0))}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Sản phẩm đã chọn</CardTitle>
            <CardDescription>Kéo chọn danh sách sản phẩm muốn đưa vào chiến dịch sale.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedProducts.length === 0 ? (
              <div className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
                Chưa có sản phẩm nào trong Flash Sale.
              </div>
            ) : (
              <div className="space-y-3">
                {selectedProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-3 rounded-lg border p-3">
                    <img src={product.image} alt={product.name} className="h-14 w-14 rounded-md border object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">{product.name}</p>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span>{product.brand}</span>
                        <span>•</span>
                        <span>{product.category}</span>
                        <span>•</span>
                        <span>{formatPrice(product.price)}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setConfig((current) => ({
                          ...current,
                          selectedProductIds: current.selectedProductIds.filter((id) => id !== product.id),
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Kho sản phẩm</CardTitle>
            <CardDescription>Tìm kiếm theo tên, thương hiệu hoặc danh mục để thêm vào Flash Sale.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Tìm sản phẩm..." value={search} onChange={(event) => setSearch(event.target.value)} />
            <ScrollArea className="h-[520px] rounded-lg border">
              <div className="space-y-2 p-3">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-3 rounded-lg border p-3">
                    <img src={product.image} alt={product.name} className="h-14 w-14 rounded-md border object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">{product.name}</p>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span>{product.brand}</span>
                        <span>•</span>
                        <span>{product.category}</span>
                        <span>•</span>
                        <span>{formatPrice(product.price)}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setConfig((current) => ({
                          ...current,
                          selectedProductIds: [...current.selectedProductIds, product.id],
                        }))
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Thêm
                    </Button>
                  </div>
                ))}

                {filteredProducts.length === 0 && (
                  <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                    Không còn sản phẩm phù hợp để thêm.
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
