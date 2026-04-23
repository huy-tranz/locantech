import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Printer, RotateCcw, Search, Share2, ShoppingCart, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getAllProducts, type Product, formatPrice } from "@/data/products";
import {
  BUILD_PC_STORAGE_KEY,
  type BuildSelections,
  type BuildStepKey,
  createEmptyBuildSelections,
  getBuildPCConfig,
} from "@/data/buildPC";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";

function BuildPCPage() {
  const { addItem } = useCart();
  const [searchParams] = useSearchParams();
  const [config, setConfig] = useState(() => getBuildPCConfig());
  const [selections, setSelections] = useState<BuildSelections>(() => createEmptyBuildSelections());
  const [activeStepKey, setActiveStepKey] = useState<BuildStepKey | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const allProducts = useMemo(() => getAllProducts(), []);
  const productMap = useMemo(() => new Map(allProducts.map((product) => [product.id, product])), [allProducts]);

  useEffect(() => {
    const syncConfig = () => setConfig(getBuildPCConfig());

    syncConfig();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === BUILD_PC_STORAGE_KEY) {
        syncConfig();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const productsByStep = useMemo(() => {
    return config.steps.reduce((acc, step) => {
      if (!step.category) {
        acc[step.key] = [];
        return acc;
      }

      acc[step.key] = allProducts.filter((product) => {
        if (product.category !== step.category) return false;
        if (!step.subcategories || step.subcategories.length === 0) return true;
        return step.subcategories.includes(product.subcategory);
      });

      return acc;
    }, {} as Record<BuildStepKey, Product[]>);
  }, [allProducts, config.steps]);

  const selectedProducts = useMemo(() => {
    return config.steps.reduce((acc, step) => {
      const productId = selections[step.key];
      acc[step.key] = productId ? productMap.get(productId) ?? null : null;
      return acc;
    }, {} as Record<BuildStepKey, Product | null>);
  }, [config.steps, productMap, selections]);

  const selectedCount = config.steps.filter((step) => selectedProducts[step.key]).length;
  const totalPrice = config.steps.reduce((sum, step) => sum + (selectedProducts[step.key]?.price ?? 0), 0);
  const hasSelections = selectedCount > 0;

  const activeStep = activeStepKey ? config.steps.find((step) => step.key === activeStepKey) ?? null : null;
  const activeProducts = activeStep ? productsByStep[activeStep.key] : [];

  const filteredActiveProducts = useMemo(() => {
    if (!activeStep) return [];

    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return activeProducts;

    return activeProducts.filter((product) => {
      const haystack = [product.name, product.brand, product.shortDesc, product.sku].join(" ").toLowerCase();
      return haystack.includes(keyword);
    });
  }, [activeProducts, activeStep, searchTerm]);

  useEffect(() => {
    const sharedConfig = searchParams.get("build");
    if (!sharedConfig) return;

    const nextSelections = createEmptyBuildSelections();

    sharedConfig.split(",").forEach((entry) => {
      const [key, productId] = entry.split(":");
      if (!key || !productId) return;
      if (!(key in nextSelections)) return;
      if (!productMap.has(productId)) return;
      nextSelections[key as BuildStepKey] = productId;
    });

    setSelections(nextSelections);
  }, [productMap, searchParams]);

  const handleOpenPicker = (stepKey: BuildStepKey) => {
    setActiveStepKey(stepKey);
    setSearchTerm("");
  };

  const handleSelectProduct = (stepKey: BuildStepKey, productId: string) => {
    setSelections((prev) => ({
      ...prev,
      [stepKey]: productId,
    }));
    setActiveStepKey(null);
    setSearchTerm("");
  };

  const handleReset = () => {
    if (!hasSelections) return;
    const confirmed = window.confirm("Bạn có chắc muốn xóa toàn bộ cấu hình và chọn lại từ đầu?");
    if (!confirmed) return;

    setSelections(createEmptyBuildSelections());
    toast({
      title: "Đã reset cấu hình",
      description: "Bạn có thể bắt đầu chọn lại từ đầu.",
    });
  };

  const applyPreset = (presetSelections: Partial<BuildSelections>, presetName: string) => {
    const nextSelections = createEmptyBuildSelections();

    Object.entries(presetSelections).forEach(([key, productId]) => {
      if (!productId) return;
      if (!(key in nextSelections)) return;
      if (!productMap.has(productId)) return;
      nextSelections[key as BuildStepKey] = productId;
    });

    setSelections(nextSelections);
    toast({
      title: `Đã áp dụng preset ${presetName}`,
      description: "Bạn vẫn có thể đổi từng linh kiện ngay bên dưới.",
    });
  };

  const handleAddAllToCart = () => {
    const items = config.steps
      .map((step) => selectedProducts[step.key])
      .filter((product): product is Product => Boolean(product));

    if (items.length === 0) return;

    items.forEach((product) => addItem(product));

    toast({
      title: "Đã thêm cấu hình vào giỏ hàng",
      description: `${items.length} sản phẩm đã được thêm vào giỏ.`,
    });
  };

  const buildSummaryText = () => {
    const lines = config.steps.map((step) => {
      const product = selectedProducts[step.key];
      return `${step.label}: ${product ? `${product.name} - ${formatPrice(product.price)}` : "Chưa chọn"}`;
    });

    return [...lines, "", `Tổng tiền: ${formatPrice(totalPrice)}`].join("\n");
  };

  const handleShare = async () => {
    const url = new URL(window.location.href);
    const buildValue = config.steps
      .map((step) => {
        const productId = selections[step.key];
        return productId ? `${step.key}:${productId}` : null;
      })
      .filter(Boolean)
      .join(",");

    if (buildValue) {
      url.searchParams.set("build", buildValue);
    } else {
      url.searchParams.delete("build");
    }

    const payload = `${url.toString()}\n\n${buildSummaryText()}`;

    try {
      await navigator.clipboard.writeText(payload);
      toast({
        title: "Đã sao chép cấu hình",
        description: "Link và chi tiết cấu hình đã được lưu vào clipboard.",
      });
    } catch {
      toast({
        title: "Không thể sao chép cấu hình",
        description: "Trình duyệt chưa cấp quyền clipboard.",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: "Đang mở chế độ in",
      description: "Bạn có thể in hoặc lưu thành PDF từ trình duyệt.",
    });
  };

  return (
    <div className="bg-background">
      <Header />

      <main className="section-container py-4 pb-28 md:py-6 md:pb-32 lg:pb-6">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Trang chủ</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Build PC</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              {config.heroBadge}
            </div>
            <h1 className="text-2xl font-bold text-foreground md:text-3xl">{config.pageTitle}</h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground md:text-base">{config.pageDescription}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
              Chia sẻ cấu hình
            </Button>
            <Button type="button" variant="outline" onClick={handlePrint}>
              <Printer className="h-4 w-4" />
              In / Xuất PDF
            </Button>
            <Button type="button" variant="outline" onClick={handleReset} disabled={!hasSelections}>
              <RotateCcw className="h-4 w-4" />
              Chọn lại từ đầu
            </Button>
          </div>
        </div>

        <section className="mb-6">
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-foreground">{config.presetTitle}</h2>
            <p className="text-sm text-muted-foreground">{config.presetDescription}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {config.presets.map((preset) => (
              <Card key={preset.id} className="border-border/70">
                <CardHeader className="space-y-3 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg">{preset.name}</CardTitle>
                      <CardDescription className="mt-2">{preset.description}</CardDescription>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{preset.priceLabel}</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button type="button" className="w-full" onClick={() => applyPreset(preset.selections, preset.name)}>
                    Dùng cấu hình này
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-5 lg:items-start">
          <section className="lg:col-span-3">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">{config.stepsTitle}</CardTitle>
                <CardDescription>{config.stepsDescription}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {config.steps.map((step) => {
                  const selectedProduct = selectedProducts[step.key];
                  const hasProduct = Boolean(selectedProduct);

                  return (
                    <div
                      key={step.key}
                      className={`rounded-2xl border p-4 transition-colors ${
                        hasProduct ? "border-emerald-200 bg-emerald-50/80" : "border-border bg-card"
                      }`}
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-muted text-xl">
                            <span aria-hidden="true">{step.icon}</span>
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-[15px] font-semibold leading-6 text-foreground md:text-base">{step.label}</h3>
                              {hasProduct && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                            </div>

                            {!hasProduct ? (
                              <p className="mt-1 text-sm text-muted-foreground">Chưa chọn</p>
                            ) : (
                              <div className="mt-1 min-w-0">
                                <p className="line-clamp-2 text-sm font-medium text-foreground">{selectedProduct?.name}</p>
                                <p className="mt-1 text-sm font-semibold text-primary">{formatPrice(selectedProduct.price)}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-shrink-0 items-center gap-2">
                          <Button type="button" variant={hasProduct ? "outline" : "default"} onClick={() => handleOpenPicker(step.key)}>
                            {hasProduct ? "Đổi" : "Chọn"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </section>

          <aside className="lg:col-span-2">
            <div className="lg:sticky lg:top-28">
              <Card className="border-primary/10 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">{config.summaryTitle}</CardTitle>
                  <CardDescription>
                    {config.summaryDescription} {selectedCount} / {config.steps.length} linh kiện đã được chọn
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
                    {config.steps.map((step) => {
                      const product = selectedProducts[step.key];

                      return (
                        <div key={step.key} className="flex items-start justify-between gap-3 rounded-xl border border-border/70 px-3 py-2.5">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground">{step.label}</p>
                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                              {product ? product.name : "Chưa chọn"}
                            </p>
                          </div>
                          <p className="flex-shrink-0 text-sm font-semibold text-foreground">
                            {product ? formatPrice(product.price) : "--"}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="rounded-2xl bg-muted/60 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tổng tiền</span>
                      <span className="text-2xl font-bold text-primary">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  <Button type="button" className="btn-cta w-full" onClick={handleAddAllToCart} disabled={!hasSelections}>
                    <ShoppingCart className="h-4 w-4" />
                    Thêm tất cả vào giỏ hàng
                  </Button>

                  <Button type="button" variant="outline" className="w-full" onClick={handleReset} disabled={!hasSelections}>
                    Chọn lại từ đầu
                  </Button>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>

        <section className="mt-6 lg:hidden">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Tóm tắt nhanh</CardTitle>
              <CardDescription>Summary đầy đủ hiển thị ở cuối trang trên mobile để bạn dễ kiểm tra trước khi thêm giỏ.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {config.steps.filter((step) => selectedProducts[step.key]).length === 0 ? (
                <p className="text-sm text-muted-foreground">Bạn chưa chọn linh kiện nào.</p>
              ) : (
                config.steps
                  .filter((step) => selectedProducts[step.key])
                  .map((step) => (
                    <div key={step.key} className="flex items-start justify-between gap-3 rounded-xl border px-3 py-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{step.label}</p>
                        <p className="line-clamp-2 text-xs text-muted-foreground">{selectedProducts[step.key]?.name}</p>
                      </div>
                      <p className="text-sm font-semibold text-foreground">{formatPrice(selectedProducts[step.key]!.price)}</p>
                    </div>
                  ))
              )}
            </CardContent>
          </Card>
        </section>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur lg:hidden">
        <div className="section-container flex items-center justify-between gap-3 py-3">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{selectedCount} linh kiện đã chọn</p>
            <p className="truncate text-base font-bold text-foreground">{formatPrice(totalPrice)}</p>
          </div>
          <Button type="button" className="btn-cta flex-shrink-0" onClick={handleAddAllToCart} disabled={!hasSelections}>
            <ShoppingCart className="h-4 w-4" />
            Thêm vào giỏ
          </Button>
        </div>
      </div>

      <Dialog open={Boolean(activeStep)} onOpenChange={(open) => !open && setActiveStepKey(null)}>
        <DialogContent className="max-w-4xl rounded-3xl p-0">
          <DialogHeader className="border-b px-6 py-5">
            <DialogTitle>{activeStep ? `Chọn ${activeStep.label}` : "Chọn linh kiện"}</DialogTitle>
            <DialogDescription>
              Chọn sản phẩm phù hợp từ danh sách có sẵn của Lộc An Tech. Bạn có thể tìm nhanh theo tên hoặc thương hiệu.
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 pb-6 pt-4">
            <div className="relative mb-4">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Tìm theo tên, thương hiệu hoặc SKU..."
                className="pl-10"
              />
            </div>

            {filteredActiveProducts.length === 0 ? (
              <div className="rounded-2xl border border-dashed px-6 py-12 text-center">
                <p className="text-base font-medium text-foreground">Không có sản phẩm phù hợp</p>
                <p className="mt-2 text-sm text-muted-foreground">Thử đổi từ khóa tìm kiếm hoặc chọn linh kiện khác trước.</p>
              </div>
            ) : (
              <div className="grid max-h-[60vh] gap-3 overflow-y-auto pr-1 md:grid-cols-2">
                {filteredActiveProducts.map((product) => {
                  const isSelected = activeStep ? selections[activeStep.key] === product.id : false;

                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => activeStep && handleSelectProduct(activeStep.key, product.id)}
                      className={`rounded-2xl border p-4 text-left transition-colors ${
                        isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex gap-4">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                          <img src={product.image} alt={product.name} className="h-full w-full object-contain p-2" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="line-clamp-2 font-semibold text-foreground">{product.name}</p>
                              <p className="mt-1 text-xs text-muted-foreground">{product.brand}</p>
                            </div>
                            {isSelected && <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />}
                          </div>

                          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.shortDesc}</p>

                          <div className="mt-3 flex items-center justify-between gap-3">
                            <span className="text-base font-bold text-primary">{formatPrice(product.price)}</span>
                            <span className="text-xs font-medium text-emerald-600">
                              {product.status === "in_stock" ? "Còn hàng" : "Sắp về"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
      <FloatingActions />
    </div>
  );
}

export default BuildPCPage;
