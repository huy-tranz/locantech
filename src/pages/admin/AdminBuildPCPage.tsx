import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { formatPrice, getAllProducts } from "@/data/products";
import {
  type BuildPCConfig,
  type BuildPreset,
  type BuildSelections,
  type BuildStepKey,
  getBuildPCConfig,
  saveBuildPCConfig,
} from "@/data/buildPC";

const stepKeyOptions: Array<{ value: BuildStepKey; label: string }> = [
  { value: "cpu", label: "CPU" },
  { value: "mainboard", label: "Mainboard" },
  { value: "gpu", label: "Card màn hình" },
  { value: "ram", label: "RAM" },
  { value: "ssd", label: "Ổ cứng SSD" },
  { value: "hdd", label: "Ổ cứng HDD" },
  { value: "case", label: "Case máy tính" },
  { value: "psu", label: "Nguồn máy tính" },
  { value: "cooler", label: "Tản nhiệt CPU" },
  { value: "monitor", label: "Màn hình" },
  { value: "mouse", label: "Chuột" },
  { value: "keyboard", label: "Bàn phím" },
  { value: "headset", label: "Tai nghe" },
];

function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

export default function AdminBuildPCPage() {
  const [config, setConfig] = useState<BuildPCConfig>(() => getBuildPCConfig());
  const allProducts = useMemo(() => getAllProducts(), []);
  const productMap = useMemo(() => new Map(allProducts.map((product) => [product.id, product])), [allProducts]);

  const productsByStep = useMemo(() => {
    return config.steps.reduce((acc, step) => {
      acc[step.key] = allProducts.filter((product) => {
        if (step.category && product.category !== step.category) return false;
        if (!step.subcategories?.length) return true;
        return step.subcategories.includes(product.subcategory);
      });
      return acc;
    }, {} as Record<BuildStepKey, ReturnType<typeof getAllProducts>>);
  }, [allProducts, config.steps]);

  const updateConfigField = (field: keyof BuildPCConfig, value: string) => {
    setConfig((current) => ({ ...current, [field]: value }));
  };

  const updateStepField = (index: number, field: "label" | "icon" | "category", value: string) => {
    setConfig((current) => ({
      ...current,
      steps: current.steps.map((step, stepIndex) => (stepIndex === index ? { ...step, [field]: value } : step)),
    }));
  };

  const updateStepSubcategories = (index: number, value: string) => {
    const subcategories = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    setConfig((current) => ({
      ...current,
      steps: current.steps.map((step, stepIndex) =>
        stepIndex === index ? { ...step, subcategories: subcategories.length > 0 ? subcategories : undefined } : step,
      ),
    }));
  };

  const updatePresetField = (presetId: string, field: "name" | "description" | "priceLabel", value: string) => {
    setConfig((current) => ({
      ...current,
      presets: current.presets.map((preset) => (preset.id === presetId ? { ...preset, [field]: value } : preset)),
    }));
  };

  const updatePresetSelection = (presetId: string, stepKey: BuildStepKey, productId: string) => {
    setConfig((current) => ({
      ...current,
      presets: current.presets.map((preset) => {
        if (preset.id !== presetId) return preset;

        const nextSelections: Partial<BuildSelections> = { ...preset.selections };
        if (productId === "__none__") {
          delete nextSelections[stepKey];
        } else {
          nextSelections[stepKey] = productId;
        }

        return { ...preset, selections: nextSelections };
      }),
    }));
  };

  const handleSave = () => {
    saveBuildPCConfig(config);
    toast({ title: "Đã lưu cấu hình Build PC" });
  };

  const handleAddPreset = () => {
    const nextPreset: BuildPreset = {
      id: crypto.randomUUID(),
      name: "Preset mới",
      description: "Nhập mô tả preset",
      priceLabel: "Khoảng ...",
      selections: {},
    };

    setConfig((current) => ({
      ...current,
      presets: [...current.presets, nextPreset],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Build PC</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý nội dung trang Build PC, thứ tự các bước chọn linh kiện và preset cấu hình mẫu.
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Lưu cấu hình
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">Nội dung</TabsTrigger>
          <TabsTrigger value="steps">Bước build</TabsTrigger>
          <TabsTrigger value="presets">Preset</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Hero</CardTitle>
                <CardDescription>Nhóm nội dung phần đầu trang Build PC.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Badge</Label>
                  <Input value={config.heroBadge} onChange={(event) => updateConfigField("heroBadge", event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Tiêu đề trang</Label>
                  <Input value={config.pageTitle} onChange={(event) => updateConfigField("pageTitle", event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Mô tả trang</Label>
                  <Input value={config.pageDescription} onChange={(event) => updateConfigField("pageDescription", event.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Section nội dung</CardTitle>
                <CardDescription>Tiêu đề và mô tả cho preset, bước chọn và cột summary.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tiêu đề preset</Label>
                  <Input value={config.presetTitle} onChange={(event) => updateConfigField("presetTitle", event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Mô tả preset</Label>
                  <Input value={config.presetDescription} onChange={(event) => updateConfigField("presetDescription", event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Tiêu đề bước build</Label>
                  <Input value={config.stepsTitle} onChange={(event) => updateConfigField("stepsTitle", event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Mô tả bước build</Label>
                  <Input value={config.stepsDescription} onChange={(event) => updateConfigField("stepsDescription", event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Tiêu đề summary</Label>
                  <Input value={config.summaryTitle} onChange={(event) => updateConfigField("summaryTitle", event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Mô tả summary</Label>
                  <Input value={config.summaryDescription} onChange={(event) => updateConfigField("summaryDescription", event.target.value)} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="steps">
          <div className="space-y-4">
            {config.steps.map((step, index) => (
              <Card key={step.key}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <CardTitle className="text-base">
                        {index + 1}. {step.label}
                      </CardTitle>
                      <CardDescription>Key cố định: {step.key}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          index > 0 &&
                          setConfig((current) => ({
                            ...current,
                            steps: moveItem(current.steps, index, index - 1),
                          }))
                        }
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          index < config.steps.length - 1 &&
                          setConfig((current) => ({
                            ...current,
                            steps: moveItem(current.steps, index, index + 1),
                          }))
                        }
                        disabled={index === config.steps.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="space-y-2">
                    <Label>Icon / emoji</Label>
                    <Input value={step.icon} onChange={(event) => updateStepField(index, "icon", event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tên hiển thị</Label>
                    <Input value={step.label} onChange={(event) => updateStepField(index, "label", event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Input value={step.category ?? ""} onChange={(event) => updateStepField(index, "category", event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Subcategory</Label>
                    <Input
                      value={step.subcategories?.join(", ") ?? ""}
                      onChange={(event) => updateStepSubcategories(index, event.target.value)}
                      placeholder="cpu, ram, ssd..."
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="presets">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Preset cấu hình mẫu</h2>
              <p className="text-sm text-muted-foreground">Chọn sẵn sản phẩm theo từng bước để khách có thể áp dụng nhanh.</p>
            </div>
            <Button variant="outline" onClick={handleAddPreset}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm preset
            </Button>
          </div>

          <div className="space-y-4">
            {config.presets.map((preset) => (
              <Card key={preset.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">{preset.name}</CardTitle>
                      <CardDescription>{preset.priceLabel}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setConfig((current) => ({
                          ...current,
                          presets: current.presets.filter((item) => item.id !== preset.id),
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Tên preset</Label>
                      <Input value={preset.name} onChange={(event) => updatePresetField(preset.id, "name", event.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Mức giá hiển thị</Label>
                      <Input
                        value={preset.priceLabel}
                        onChange={(event) => updatePresetField(preset.id, "priceLabel", event.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <Label>Mô tả ngắn</Label>
                      <Input
                        value={preset.description}
                        onChange={(event) => updatePresetField(preset.id, "description", event.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-xl bg-muted/40 p-3">
                      <p className="text-xs text-muted-foreground">Linh kiện đã gán</p>
                      <p className="mt-1 text-lg font-semibold text-foreground">
                        {Object.values(preset.selections).filter(Boolean).length} / {config.steps.length}
                      </p>
                    </div>
                    <div className="rounded-xl bg-muted/40 p-3">
                      <p className="text-xs text-muted-foreground">Tổng tiền ước tính</p>
                      <p className="mt-1 text-lg font-semibold text-primary">
                        {formatPrice(
                          Object.values(preset.selections).reduce((sum, productId) => {
                            if (!productId) return sum;
                            return sum + (productMap.get(productId)?.price ?? 0);
                          }, 0),
                        )}
                      </p>
                    </div>
                    <div className="rounded-xl bg-muted/40 p-3">
                      <p className="text-xs text-muted-foreground">Preview nhanh</p>
                      <p className="mt-1 line-clamp-2 text-sm text-foreground">
                        {config.steps
                          .map((step) => {
                            const productId = preset.selections[step.key];
                            if (!productId) return null;
                            return productMap.get(productId)?.name ?? null;
                          })
                          .filter(Boolean)
                          .slice(0, 2)
                          .join(" • ") || "Chưa chọn sẵn linh kiện"}
                      </p>
                    </div>
                  </div>

                  <ScrollArea className="h-[380px] rounded-lg border">
                    <div className="space-y-3 p-4">
                      {config.steps.map((step) => (
                        <div key={step.key} className="grid gap-3 rounded-xl border p-3 md:grid-cols-[200px_1fr] md:items-center">
                          <div>
                            <p className="font-medium text-foreground">{step.label}</p>
                            <p className="text-xs text-muted-foreground">{step.key}</p>
                          </div>
                          <Select
                            value={preset.selections[step.key] ?? "__none__"}
                            onValueChange={(value) => updatePresetSelection(preset.id, step.key, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`Chọn ${step.label}`} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="__none__">Không chọn sẵn</SelectItem>
                              {productsByStep[step.key]?.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name} - {formatPrice(product.price)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
