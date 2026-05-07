import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import BannerSection from "@/components/home/BannerSection";
import CategorySidebar from "@/components/home/CategorySidebar";
import ServiceSection from "@/components/home/ServiceSection";
import ProductBlock from "@/components/home/ProductBlock";
import FlashSaleSection from "@/components/home/FlashSaleSection";
import ShopByNeedSection from "@/components/home/ShopByNeedSection";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import NewsSection from "@/components/home/NewsSection";
import { useProducts } from "@/hooks/queries/product.queries";
import { getProductsFromResponse } from "@/lib/productAdapter";
import ScrollReveal from "@/components/ScrollReveal";
import {
  ArrowRight,
  Camera,
  Cpu,
  Headphones,
  Laptop,
  MessageCircle,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Truck,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";
import heroPcImage from "@/assets/products/pc-gaming.png";
import heroLaptopImage from "@/assets/products/laptop-gaming.png";
import heroMonitorImage from "@/assets/products/monitor-gaming.png";

const quickCampaigns = [
  {
    label: "Tư vấn cấu hình",
    title: "Build PC theo ngân sách",
    desc: "Gaming, đồ họa, văn phòng",
    href: "/build-pc",
    icon: Cpu,
    tone: "from-cyan-50 to-white",
    toneClass: "tone-gaming",
    action: "Build ngay",
  },
  {
    label: "Máy học tập",
    title: "Laptop văn phòng",
    desc: "Gọn nhẹ, bảo hành rõ, dễ mua",
    href: "/laptop",
    icon: Laptop,
    tone: "from-indigo-50 to-white",
    toneClass: "tone-trust",
    action: "Xem laptop",
  },
  {
    label: "Kỹ thuật tận nơi",
    title: "Sửa chữa máy tính",
    desc: "Vệ sinh, nâng cấp SSD/RAM, cài Win",
    href: "/dich-vu",
    icon: Wrench,
    tone: "from-orange-50 to-white",
    toneClass: "tone-service",
    action: "Đặt lịch",
  },
  {
    label: "Nhà & văn phòng",
    title: "Camera, mạng nội bộ",
    desc: "Thi công camera, WiFi, LAN",
    href: "/camera",
    icon: Camera,
    tone: "from-emerald-50 to-white",
    toneClass: "tone-trust",
    action: "Tư vấn ngay",
  },
];

const heroMetrics = [
  { value: "60 phút", label: "hỗ trợ kỹ thuật nội thành", icon: Headphones },
  { value: "36 tháng", label: "bảo hành cấu hình PC", icon: ShieldCheck },
  { value: "Toàn quốc", label: "giao hàng & đóng gói", icon: Truck },
];

const heroCampaignBadges = [
  { label: "PC gaming", value: "Build theo ngân sách" },
  { label: "Laptop", value: "Văn phòng, học tập, gaming" },
  { label: "Kỹ thuật", value: "Tư vấn trước khi mua" },
];

const Index = () => {
  const { data: laptopRes } = useProducts({ category: "laptop", limit: 5 });
  const { data: pcRes } = useProducts({ category: "pc", limit: 5 });
  const { data: pcGamingRes } = useProducts({ category: "pc-gaming", limit: 5 });
  const { data: linhKienRes } = useProducts({ category: "linh-kien", limit: 5 });
  const { data: manHinhRes } = useProducts({ category: "man-hinh", limit: 5 });
  const { data: ngoaiViRes } = useProducts({ category: "ngoai-vi", limit: 5 });
  const { data: tbMangRes } = useProducts({ category: "thiet-bi-mang", limit: 5 });
  const { data: cameraRes } = useProducts({ category: "camera", limit: 5 });

  const laptops = getProductsFromResponse(laptopRes);
  const pcs = getProductsFromResponse(pcRes);
  const pcGaming = getProductsFromResponse(pcGamingRes);
  const linhKien = getProductsFromResponse(linhKienRes);
  const manHinh = getProductsFromResponse(manHinhRes);
  const ngoaiVi = getProductsFromResponse(ngoaiViRes);
  const tbMang = getProductsFromResponse(tbMangRes);
  const cameras = getProductsFromResponse(cameraRes);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="section-container py-4 md:py-6">
        <ScrollReveal>
          <section className="home-hero-shell mb-6">
            <div className="relative z-10">
              <div className="grid gap-4 lg:grid-cols-[clamp(14rem,14.2vw,15.625rem)_minmax(0,1fr)]">
                <div className="hidden lg:block">
                  <CategorySidebar />
                </div>
                <BannerSection />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {quickCampaigns.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.href} to={item.href} className={`brand-quick-card group bg-gradient-to-br ${item.tone}`}>
                      <div className="flex items-start gap-3">
                        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors ${item.toneClass}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                            {item.label}
                          </span>
                          <p className="mt-0.5 text-sm font-extrabold text-foreground">{item.title}</p>
                          <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.desc}</p>
                          <span className="mt-2 inline-flex text-xs font-extrabold text-primary group-hover:text-accent">
                            {item.action} →
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              <div className="mt-4 grid gap-4 px-1 xl:grid-cols-[minmax(0,1.05fr)_minmax(24rem,0.95fr)] xl:items-stretch">
                <div className="flex min-h-0 flex-col justify-center rounded-2xl border border-white/15 bg-white/[0.06] p-4 backdrop-blur md:p-6 xl:min-h-[20rem]">
                  <span className="hero-eyebrow">
                    <Sparkles className="mr-2 h-3.5 w-3.5" />
                    Lộc An Tech Store
                  </span>
                  <h1 className="mt-4 max-w-3xl text-[clamp(1.9rem,1.2rem+2vw,3.35rem)] font-black leading-[1.04] text-white">
                    Build PC, chọn laptop và sửa máy tính rõ giá ngay từ đầu
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-cyan-50/80 md:text-base">
                    Tư vấn cấu hình theo ngân sách, chọn máy phù hợp nhu cầu và hỗ trợ kỹ thuật tại Hà Đông. Chốt cấu hình nhanh, bảo hành rõ, giao hàng toàn quốc.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {heroCampaignBadges.map((item) => (
                      <span
                        key={item.label}
                        className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-left shadow-sm backdrop-blur"
                      >
                        <span className="block text-[10px] font-black uppercase tracking-widest text-cyan-100">{item.label}</span>
                        <span className="mt-0.5 block text-xs font-bold text-white/85">{item.value}</span>
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Link to="/build-pc" className="btn-cta gap-2 !rounded-xl !px-5 !py-3">
                      <Cpu className="h-4 w-4" />
                      Build PC ngay
                    </Link>
                    <Link
                      to="/laptop"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white px-5 text-sm font-extrabold text-primary shadow-sm transition hover:-translate-y-0.5 hover:bg-cyan-50"
                    >
                      <Laptop className="h-4 w-4" />
                      Xem laptop
                    </Link>
                    <a
                      href="tel:0989386219"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-sm font-extrabold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/18"
                    >
                      <PhoneCall className="h-4 w-4" />
                      Gọi tư vấn
                    </a>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2 md:max-w-2xl">
                    {heroMetrics.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.value} className="metric-pill">
                          <div className="mb-1 flex items-center gap-1.5 text-cyan-100">
                            <Icon className="h-3.5 w-3.5" />
                            <span className="text-sm font-extrabold">{item.value}</span>
                          </div>
                          <p className="text-[11px] leading-4 text-white/70">{item.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="relative order-first min-h-[15rem] overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-white/16 via-cyan-200/10 to-slate-950/20 p-4 shadow-[0_22px_55px_rgba(0,0,0,0.22)] backdrop-blur md:min-h-[18rem] xl:order-none xl:min-h-[20rem]">
                  <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/18 to-transparent" />
                  <div className="absolute right-4 top-4 z-20 rounded-full bg-yellow-300 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-slate-950 shadow-lg">
                    Tư vấn miễn phí
                  </div>
                  <div className="relative z-10 flex h-full flex-col">
                    <div className="grid flex-1 grid-cols-[0.95fr_1.05fr] items-center gap-2">
                      <div className="relative">
                        <img
                          src={heroLaptopImage}
                          alt="Laptop gaming tại Lộc An"
                          className="relative z-10 w-full -rotate-3 object-contain drop-shadow-[0_24px_34px_rgba(0,0,0,0.35)]"
                          loading="eager"
                        />
                        <img
                          src={heroMonitorImage}
                          alt="Màn hình gaming"
                          className="absolute -bottom-8 left-2 z-0 w-[62%] rotate-2 object-contain opacity-90 drop-shadow-[0_20px_26px_rgba(0,0,0,0.24)]"
                          loading="eager"
                        />
                      </div>
                      <div className="relative">
                        <img
                          src={heroPcImage}
                          alt="PC gaming build theo ngân sách"
                          className="relative z-10 ml-auto w-[94%] object-contain drop-shadow-[0_28px_38px_rgba(0,0,0,0.42)]"
                          loading="eager"
                        />
                        <div className="absolute bottom-2 right-1 z-20 rounded-2xl border border-white/20 bg-white/95 px-3 py-2 text-slate-950 shadow-xl">
                          <span className="block text-[10px] font-black uppercase tracking-widest text-sale">Build PC</span>
                          <span className="mt-0.5 block text-sm font-black">Từ 5 triệu</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 hidden gap-2 sm:grid sm:grid-cols-3">
                      {[
                        "Cân game, học tập, đồ họa",
                        "Nâng cấp SSD/RAM nhanh",
                        "Gửi cấu hình qua Zalo",
                      ].map((item) => (
                        <div key={item} className="flex min-h-12 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 text-xs font-bold text-white/85 backdrop-blur">
                          <MessageCircle className="h-4 w-4 shrink-0 text-cyan-100" />
                          {item}
                        </div>
                      ))}
                    </div>

                    <Link
                      to="/build-pc"
                      className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white text-sm font-black text-primary shadow-lg transition hover:-translate-y-0.5 hover:bg-cyan-50"
                    >
                      Nhận gợi ý cấu hình
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal delayMs={100}>
          <FlashSaleSection />
        </ScrollReveal>

        <ScrollReveal delayMs={150}>
          <ShopByNeedSection />
        </ScrollReveal>

        <ProductBlock title="Laptop bán chạy" products={laptops} link="/laptop" />
        <ProductBlock title="PC văn phòng" products={pcs} link="/pc" />
        <ProductBlock title="PC Gaming" products={pcGaming} link="/pc-gaming" />
        <ProductBlock title="Linh kiện máy tính" products={linhKien} link="/linh-kien" />
        <ProductBlock title="Màn hình máy tính" products={manHinh} link="/man-hinh" />
        <ProductBlock title="Gaming Gear" products={ngoaiVi} link="/ngoai-vi" />
        <ProductBlock title="Thiết bị mạng" products={tbMang} link="/thiet-bi-mang" />
        <ProductBlock title="Camera giám sát" products={cameras} link="/camera" />

        <ScrollReveal delayMs={200}>
          <ServiceSection />
        </ScrollReveal>

        <ScrollReveal delayMs={300}>
          <WhyChooseUs />
        </ScrollReveal>

        <ScrollReveal delayMs={400}>
          <NewsSection />
        </ScrollReveal>

        <ScrollReveal delayMs={500}>
          <section className="brand-section mx-auto my-8 max-w-3xl px-6 py-8 text-center">
            <h2 className="mb-3 text-xl font-extrabold text-foreground md:text-2xl">
              Lộc An - đồng hành cùng bạn trong mọi giải pháp công nghệ
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Lộc An chuyên bán và sửa chữa máy tính, laptop, linh kiện, thiết bị mạng và camera giám sát
              tại Hà Đông, Hà Nội. Chúng tôi cam kết tư vấn đúng nhu cầu, báo giá rõ ràng và hỗ trợ kỹ thuật tận tâm.
            </p>
            <a href="tel:0989386219" className="btn-cta mt-4 inline-flex">
              Gọi ngay: 0989.386.219
            </a>
          </section>
        </ScrollReveal>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
};

export default Index;
