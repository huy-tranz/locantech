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
import { Camera, Cpu, Laptop, Wrench } from "lucide-react";
import { Link } from "react-router-dom";

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

      <main className="section-container py-3 md:py-4">
        <ScrollReveal>
          <section className="home-hero-shell mb-4">
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

            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <FlashSaleSection />
        </ScrollReveal>

        <ScrollReveal>
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

        <ScrollReveal>
          <ServiceSection />
        </ScrollReveal>

        <ScrollReveal>
          <WhyChooseUs />
        </ScrollReveal>

        <ScrollReveal>
          <NewsSection />
        </ScrollReveal>

        <ScrollReveal>
          <section className="brand-section mx-auto my-6 max-w-3xl px-6 py-6 text-center">
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
