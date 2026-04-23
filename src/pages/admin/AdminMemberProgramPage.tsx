import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  type MemberBenefitRow,
  type MemberPointRule,
  type MemberPromotion,
  type MemberTierId,
  getMemberProgramData,
  saveMemberProgramData,
} from "@/data/memberProgram";

const tierIds: MemberTierId[] = ["bronze", "silver", "gold", "diamond"];

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

export default function AdminMemberProgramPage() {
  const [program, setProgram] = useState(() => getMemberProgramData());

  const tierMap = useMemo(
    () =>
      Object.fromEntries(program.tiers.map((tier) => [tier.id, tier])) as Record<
        MemberTierId,
        (typeof program.tiers)[number]
      >,
    [program.tiers],
  );

  const updateTier = (tierId: MemberTierId, field: "icon" | "name" | "condition", value: string) => {
    setProgram((current) => ({
      ...current,
      tiers: current.tiers.map((tier) => (tier.id === tierId ? { ...tier, [field]: value } : tier)),
    }));
  };

  const updateBenefit = (benefitId: string, field: keyof MemberBenefitRow, value: string) => {
    setProgram((current) => ({
      ...current,
      benefits: current.benefits.map((benefit) => (benefit.id === benefitId ? { ...benefit, [field]: value } : benefit)),
    }));
  };

  const updatePointRule = (pointId: string, field: keyof MemberPointRule, value: string) => {
    setProgram((current) => ({
      ...current,
      pointRules: current.pointRules.map((rule) => (rule.id === pointId ? { ...rule, [field]: value } : rule)),
    }));
  };

  const updatePromotion = (promotionId: string, field: keyof MemberPromotion, value: string) => {
    setProgram((current) => ({
      ...current,
      promotions: current.promotions.map((promotion) =>
        promotion.id === promotionId ? { ...promotion, [field]: value } : promotion,
      ),
    }));
  };

  const handleSave = () => {
    saveMemberProgramData(program);
    toast({ title: "Đã lưu cấu hình ưu đãi thành viên" });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ưu đãi thành viên</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý hạng thành viên, bảng quyền lợi, cách tích điểm và các ưu đãi đang chạy ngoài trang công khai.
          </p>
        </div>
        <Button onClick={handleSave}>
          <Save className="mr-2 h-4 w-4" />
          Lưu thay đổi
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Hạng mặc định khi đăng nhập</CardTitle>
            <CardDescription>Dùng cho UI demo khi chưa có hệ thống điểm thật.</CardDescription>
          </CardHeader>
          <CardContent>
            <Select
              value={program.defaultLoggedInTier}
              onValueChange={(value) =>
                setProgram((current) => ({ ...current, defaultLoggedInTier: value as MemberTierId }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {program.tiers.map((tier) => (
                  <SelectItem key={tier.id} value={tier.id}>
                    {tier.icon} {tier.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Điểm thưởng khi đăng ký</CardTitle>
            <CardDescription>Hiển thị ở CTA cuối trang thành viên.</CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              min={0}
              value={program.signupBonusPoints}
              onChange={(event) =>
                setProgram((current) => ({
                  ...current,
                  signupBonusPoints: Number(event.target.value || 0),
                }))
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Tóm tắt nhanh</CardTitle>
            <CardDescription>Cấu hình hiện tại của trang thành viên.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Số hạng thành viên</span>
              <Badge variant="secondary">{program.tiers.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Dòng quyền lợi</span>
              <Badge variant="secondary">{program.benefits.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Cách tích điểm</span>
              <Badge variant="secondary">{program.pointRules.length}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Ưu đãi đang hiển thị</span>
              <Badge variant="secondary">{program.promotions.length}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tiers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tiers">Hạng thành viên</TabsTrigger>
          <TabsTrigger value="benefits">Quyền lợi</TabsTrigger>
          <TabsTrigger value="points">Tích điểm</TabsTrigger>
          <TabsTrigger value="promotions">Ưu đãi tháng</TabsTrigger>
        </TabsList>

        <TabsContent value="tiers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {tierIds.map((tierId) => {
              const tier = tierMap[tierId];

              return (
                <Card key={tierId}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <span className="text-2xl">{tier.icon}</span>
                      {tier.name}
                    </CardTitle>
                    <CardDescription>{tier.condition}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <Label>Icon / emoji</Label>
                      <Input value={tier.icon} onChange={(event) => updateTier(tierId, "icon", event.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Tên hạng</Label>
                      <Input value={tier.name} onChange={(event) => updateTier(tierId, "name", event.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Điều kiện</Label>
                      <Input
                        value={tier.condition}
                        onChange={(event) => updateTier(tierId, "condition", event.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Bảng quyền lợi</CardTitle>
              <CardDescription>Chỉnh từng dòng trong bảng so sánh quyền lợi.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[220px]">Quyền lợi</TableHead>
                    <TableHead>{tierMap.bronze.name}</TableHead>
                    <TableHead>{tierMap.silver.name}</TableHead>
                    <TableHead>{tierMap.gold.name}</TableHead>
                    <TableHead>{tierMap.diamond.name}</TableHead>
                    <TableHead className="w-16 text-right">Xóa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {program.benefits.map((benefit) => (
                    <TableRow key={benefit.id}>
                      <TableCell>
                        <Input value={benefit.label} onChange={(event) => updateBenefit(benefit.id, "label", event.target.value)} />
                      </TableCell>
                      {tierIds.map((tierId) => (
                        <TableCell key={tierId}>
                          <Input
                            value={benefit[tierId]}
                            onChange={(event) => updateBenefit(benefit.id, tierId, event.target.value)}
                          />
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setProgram((current) => ({
                              ...current,
                              benefits: current.benefits.filter((item) => item.id !== benefit.id),
                            }))
                          }
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Button
                variant="outline"
                className="mt-4"
                onClick={() =>
                  setProgram((current) => ({
                    ...current,
                    benefits: [
                      ...current.benefits,
                      {
                        id: crypto.randomUUID(),
                        label: "Quyền lợi mới",
                        bronze: "",
                        silver: "",
                        gold: "",
                        diamond: "",
                      },
                    ],
                  }))
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Thêm dòng quyền lợi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="points" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {program.pointRules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-base">Cách tích điểm</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setProgram((current) => ({
                          ...current,
                          pointRules: current.pointRules.filter((item) => item.id !== rule.id),
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label>Icon / emoji</Label>
                    <Input value={rule.icon} onChange={(event) => updatePointRule(rule.id, "icon", event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tiêu đề</Label>
                    <Input value={rule.title} onChange={(event) => updatePointRule(rule.id, "title", event.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Mô tả</Label>
                    <Input
                      value={rule.description}
                      onChange={(event) => updatePointRule(rule.id, "description", event.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() =>
              setProgram((current) => ({
                ...current,
                pointRules: [
                  ...current.pointRules,
                  {
                    id: crypto.randomUUID(),
                    icon: "🎁",
                    title: "Cách tích điểm mới",
                    description: "Nhập mô tả",
                  },
                ],
              }))
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm cách tích điểm
          </Button>
        </TabsContent>

        <TabsContent value="promotions" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {program.promotions.map((promotion) => (
              <Card key={promotion.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">{promotion.title || "Ưu đãi mới"}</CardTitle>
                      <CardDescription>{promotion.badge || "Nhóm thành viên áp dụng"}</CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setProgram((current) => ({
                          ...current,
                          promotions: current.promotions.filter((item) => item.id !== promotion.id),
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label>Tên ưu đãi</Label>
                    <Input
                      value={promotion.title}
                      onChange={(event) => updatePromotion(promotion.id, "title", event.target.value)}
                    />
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Badge</Label>
                      <Input
                        value={promotion.badge}
                        onChange={(event) => updatePromotion(promotion.id, "badge", event.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Hiển thị hạn</Label>
                      <Input
                        value={promotion.deadlineLabel}
                        onChange={(event) => updatePromotion(promotion.id, "deadlineLabel", event.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Ngày hết hạn</Label>
                    <Input
                      type="datetime-local"
                      value={toDatetimeLocal(promotion.expiresAt)}
                      onChange={(event) => updatePromotion(promotion.id, "expiresAt", fromDatetimeLocal(event.target.value))}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() =>
              setProgram((current) => ({
                ...current,
                promotions: [
                  ...current.promotions,
                  {
                    id: crypto.randomUUID(),
                    title: "Ưu đãi mới",
                    badge: "Tất cả thành viên",
                    deadlineLabel: "Cập nhật sau",
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                  },
                ],
              }))
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm ưu đãi
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
