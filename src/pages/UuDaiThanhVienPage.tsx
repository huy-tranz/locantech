import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import ScrollReveal from "@/components/ScrollReveal";
import { getCurrentUser, subscribeAuthChange, type AuthSession } from "@/lib/auth";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Award, Crown, Gift, ShieldCheck, Sparkles, Star, UserPlus, Wrench } from "lucide-react";
import {
  MEMBER_PROGRAM_STORAGE_KEY,
  type MemberTierId,
  getMemberProgramData,
} from "@/data/memberProgram";

type CountdownMap = Record<string, string>;

const tierClassMap: Record<MemberTierId, { card: string; badge: string }> = {
  bronze: {
    card: "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50",
    badge: "bg-amber-100 text-amber-900 border-amber-200",
  },
  silver: {
    card: "border-slate-200 bg-gradient-to-br from-slate-50 to-zinc-100",
    badge: "bg-slate-100 text-slate-900 border-slate-200",
  },
  gold: {
    card: "border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50",
    badge: "bg-yellow-100 text-yellow-900 border-yellow-200",
  },
  diamond: {
    card: "border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50",
    badge: "bg-cyan-100 text-cyan-900 border-cyan-200",
  },
};

function formatCountdown(targetDate: string) {
  const distance = new Date(targetDate).getTime() - Date.now();

  if (distance <= 0) {
    return "Đã hết hạn";
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  return `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;
}

export default function UuDaiThanhVienPage() {
  const [currentUser, setCurrentUser] = useState<AuthSession | null>(() => getCurrentUser());
  const [program, setProgram] = useState(() => getMemberProgramData());
  const [countdowns, setCountdowns] = useState<CountdownMap>(() =>
    getMemberProgramData().promotions.reduce((acc, promo) => {
      acc[promo.id] = formatCountdown(promo.expiresAt);
      return acc;
    }, {} as CountdownMap),
  );

  useEffect(() => {
    const syncUser = () => setCurrentUser(getCurrentUser());
    const unsubscribe = subscribeAuthChange(syncUser);
    syncUser();
    return unsubscribe;
  }, []);

  useEffect(() => {
    const syncProgram = () => setProgram(getMemberProgramData());

    syncProgram();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === MEMBER_PROGRAM_STORAGE_KEY) {
        syncProgram();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    setCountdowns(
      program.promotions.reduce((acc, promo) => {
        acc[promo.id] = formatCountdown(promo.expiresAt);
        return acc;
      }, {} as CountdownMap),
    );

    const timer = window.setInterval(() => {
      if (document.hidden) return;
      setCountdowns(
        program.promotions.reduce((acc, promo) => {
          acc[promo.id] = formatCountdown(promo.expiresAt);
          return acc;
        }, {} as CountdownMap),
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, [program.promotions]);

  const currentTier = useMemo<MemberTierId | null>(() => {
    if (!currentUser) return null;
    return program.defaultLoggedInTier;
  }, [currentUser, program.defaultLoggedInTier]);

  const currentTierMeta = currentTier ? program.tiers.find((tier) => tier.id === currentTier) ?? null : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="section-container py-4 md:py-6">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Trang chủ</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Ưu đãi thành viên</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <ScrollReveal>
          <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-primary-dark via-primary to-primary-light px-6 py-10 text-primary-foreground shadow-lg md:px-10 md:py-14">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,153,0,0.18),transparent_30%)]" />
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <Badge className="mb-4 w-fit border-white/20 bg-white/10 text-white">Ưu đãi dành riêng cho hội viên</Badge>
                <h1 className="text-3xl font-bold leading-tight md:text-5xl">Chương trình Thành viên Lộc An</h1>
                <p className="mt-3 text-base text-primary-foreground/85 md:text-lg">
                  Tích điểm – Nhận ưu đãi – Nâng hạng thành viên
                </p>
              </div>

              <div className="w-full max-w-xl rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
                {currentUser && currentTierMeta ? (
                  <div className="space-y-2">
                    <p className="text-sm uppercase tracking-[0.24em] text-primary-foreground/70">Thành viên hiện tại</p>
                    <p className="text-2xl font-semibold">
                      Xin chào {currentUser.fullName}! Hạng của bạn: {currentTierMeta.name} {currentTierMeta.icon}
                    </p>
                    <p className="text-sm text-primary-foreground/80">
                      Tiếp tục mua sắm và tích điểm để mở khóa thêm nhiều đặc quyền hơn tại Lộc An Tech.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-primary-foreground/80">
                      Đăng ký hội viên miễn phí để nhận ưu đãi sinh nhật, tích điểm cho mỗi đơn hàng và theo dõi hạng
                      thành viên dễ dàng.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button asChild className="btn-cta">
                        <Link to="/dang-ky">Đăng ký thành viên</Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="border-white/40 bg-transparent text-white hover:bg-white hover:text-primary"
                      >
                        <Link to="/dang-nhap">Đăng nhập</Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal delayMs={80} className="mt-8">
          <section>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-foreground">4 hạng thành viên</h2>
              <p className="mt-1 text-sm text-muted-foreground">Mua sắm nhiều hơn để nâng hạng và nhận thêm đặc quyền hấp dẫn.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {program.tiers.map((tier) => {
                const style = tierClassMap[tier.id];
                const isActive = tier.id === currentTier;

                return (
                  <Card
                    key={tier.id}
                    className={`${style.card} ${isActive ? "ring-2 ring-primary shadow-md" : "shadow-sm"} border`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="text-4xl">{tier.icon}</div>
                        {isActive && <Badge className="bg-primary text-primary-foreground">Hạng của bạn</Badge>}
                      </div>
                      <CardTitle className="text-xl">{tier.name}</CardTitle>
                      <CardDescription className="text-foreground/80">{tier.condition}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Badge variant="outline" className={style.badge}>
                        Mốc nâng hạng
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal delayMs={140} className="mt-8">
          <section>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-foreground">Bảng so sánh quyền lợi</h2>
              <p className="mt-1 text-sm text-muted-foreground">So sánh nhanh các đặc quyền giữa từng hạng để chọn mục tiêu nâng cấp phù hợp.</p>
            </div>

            <Card className="overflow-hidden">
              <CardContent className="overflow-x-auto p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="min-w-[220px] font-semibold text-foreground">Quyền lợi</TableHead>
                      {program.tiers.map((tier) => (
                        <TableHead key={tier.id} className="min-w-[120px] text-center font-semibold text-foreground">
                          {tier.name}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {program.benefits.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium text-foreground">{row.label}</TableCell>
                        <TableCell className="text-center">{row.bronze}</TableCell>
                        <TableCell className="text-center">{row.silver}</TableCell>
                        <TableCell className="text-center">{row.gold}</TableCell>
                        <TableCell className="text-center">{row.diamond}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </section>
        </ScrollReveal>

        <ScrollReveal delayMs={200} className="mt-8">
          <section>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-foreground">Cách tích điểm</h2>
              <p className="mt-1 text-sm text-muted-foreground">Điểm thưởng được cộng tự động theo các hoạt động quen thuộc của thành viên.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {program.pointRules.map((item) => (
                <Card key={item.id} className="border-border/70 shadow-sm">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="text-4xl">{item.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal delayMs={260} className="mt-8">
          <section>
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-foreground">Ưu đãi nổi bật tháng này</h2>
              <p className="mt-1 text-sm text-muted-foreground">Các quyền lợi nổi bật đang áp dụng cho thành viên trong giai đoạn hiện tại.</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {program.promotions.map((promo, index) => {
                const icons = [Gift, Wrench, Award];
                const Icon = icons[index] ?? Sparkles;

                return (
                  <Card key={promo.id} className="border-border/70 shadow-sm">
                    <CardHeader className="pb-3">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <Badge variant="outline" className="border-accent/30 bg-accent/10 text-accent-foreground">
                          {promo.badge}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl leading-snug">{promo.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                      <div className="rounded-2xl bg-muted/60 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Countdown</p>
                        <p className="mt-2 text-sm font-semibold text-foreground">{countdowns[promo.id]}</p>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Hạn</span>
                        <span className="font-medium text-foreground">{promo.deadlineLabel}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal delayMs={320} className="mt-8">
          <section className="rounded-[28px] bg-accent px-6 py-8 text-accent-foreground shadow-lg md:px-10 md:py-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-accent-foreground/75">Gia nhập miễn phí</p>
                <h2 className="text-2xl font-bold md:text-3xl">
                  Chưa có tài khoản? Đăng ký ngay để nhận ngay {program.signupBonusPoints} điểm!
                </h2>
                <p className="mt-2 text-sm text-accent-foreground/85 md:text-base">
                  Trở thành thành viên Lộc An để tích điểm từ đơn hàng đầu tiên và nhận thêm nhiều quà tặng theo từng hạng.
                </p>
              </div>

              <Button asChild className="bg-white text-accent hover:bg-white/90">
                <Link to="/dang-ky">Đăng ký miễn phí</Link>
              </Button>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal delayMs={360} className="mt-8">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: Crown, title: "Nâng hạng dễ hiểu", desc: "Mỗi mốc chi tiêu đều rõ ràng để bạn theo dõi và chinh phục." },
              { icon: ShieldCheck, title: "Đặc quyền bảo hành", desc: "Ưu tiên xử lý nhanh hơn với thành viên hạng cao." },
              { icon: Star, title: "Ưu đãi định kỳ", desc: "Khuyến mãi riêng theo tháng, theo mùa và dịp sinh nhật." },
              { icon: UserPlus, title: "Gia nhập miễn phí", desc: "Chỉ cần đăng ký tài khoản là đã bắt đầu tích điểm ngay." },
            ].map((item) => (
              <Card key={item.title} className="shadow-sm">
                <CardContent className="flex items-start gap-4 p-5">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>
        </ScrollReveal>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
