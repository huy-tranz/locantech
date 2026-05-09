import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useBanners } from "@/hooks/queries/cms.queries";
import { BadgePercent, ChevronLeft, ChevronRight, Cpu, Gift, ShieldCheck } from "lucide-react";

interface BannerItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  position: "HERO" | "SIDEBAR";
  isActive: boolean;
}

const campaignChips = [
  { icon: BadgePercent, text: "Deal tốt mỗi ngày" },
  { icon: ShieldCheck, text: "Bảo hành rõ" },
  { icon: Cpu, text: "Build PC miễn phí" },
];

export default function BannerSection() {
  const { data: rawBanners = [] } = useBanners();

  const activeBanners = (rawBanners as BannerItem[]).filter((b) => b.isActive);
  const mainBanners = activeBanners.filter((b) => b.position === "HERO");
  const subBanners = activeBanners.filter((b) => b.position === "SIDEBAR");
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (mainBanners.length <= 1) return;
    const timer = setInterval(() => {
      if (document.hidden) return;
      setCurrent((prev) => (prev + 1) % mainBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [mainBanners.length]);

  const goPrev = () => setCurrent((prev) => (prev - 1 + mainBanners.length) % mainBanners.length);
  const goNext = () => setCurrent((prev) => (prev + 1) % mainBanners.length);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(clamp(15rem,19vw,20rem),0.9fr)] [@media(min-width:1800px)]:grid-cols-3">
      <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-primary shadow-card [@media(min-width:1800px)]:col-span-2">
        <div className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_18%_18%,rgba(34,211,238,0.24),transparent_24rem)] dark:bg-[radial-gradient(circle_at_18%_18%,rgba(56,189,248,0.14),transparent_24rem)]" />
        <div className="relative h-[clamp(18rem,17vw,20rem)]">
          {mainBanners.map((banner, index) => (
            <Link
              key={banner.id}
              to={banner.link || "/"}
              className={`absolute inset-0 transition-opacity duration-500 ${index === current ? "opacity-100" : "pointer-events-none opacity-0"}`}
            >
              <div className="absolute inset-0 z-10 flex items-center bg-gradient-to-r from-primary-dark via-primary-dark/95 to-primary-dark/45 dark:via-primary-dark/90 dark:to-primary-dark/68">
                <div className="max-w-[min(40rem,62vw)] px-[clamp(1.25rem,2vw,2.5rem)]">
                  <div className="mb-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-cyan-100 backdrop-blur">
                      Lộc An Campaign
                    </span>
                    <span className="rounded-full bg-sale px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white shadow-sm">
                      Tư vấn miễn phí
                    </span>
                  </div>
                  <h2 className="mb-2 max-w-xl text-[clamp(1.5rem,0.95rem+1.35vw,2.25rem)] font-extrabold leading-tight text-primary-foreground">
                    {banner.title}
                  </h2>
                  {banner.subtitle && (
                    <p className="max-w-lg text-[clamp(0.8rem,0.68rem+0.3vw,1rem)] font-semibold leading-5 text-primary-foreground/80">
                      {banner.subtitle}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    {campaignChips.map((chip) => {
                      const Icon = chip.icon;
                      return (
                        <span
                          key={chip.text}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur"
                        >
                          <Icon className="h-3.5 w-3.5 text-cyan-100" />
                          {chip.text}
                        </span>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <span className="btn-cta inline-flex !px-[clamp(1rem,1.25vw,1.25rem)] !py-[clamp(0.5rem,0.65vw,0.625rem)] text-[clamp(0.75rem,0.68rem+0.2vw,0.875rem)]">
                      Xem ưu đãi →
                    </span>
                    <span className="hidden rounded-lg bg-white/10 px-3 py-2 text-xs font-bold text-cyan-50 backdrop-blur sm:inline-flex">
                      Hotline 0989.386.219
                    </span>
                  </div>
                </div>
              </div>
              <img
                src={banner.image}
                alt={banner.title}
                className="h-full w-full object-cover object-[70%_center] transition-transform duration-700 group-hover:scale-105"
              />
            </Link>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 h-16 bg-gradient-to-t from-primary-dark/80 to-transparent" />

        {mainBanners.length > 1 && (
          <>
            <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2">
              {mainBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`h-2 rounded-full transition-all ${index === current ? "w-7 bg-accent" : "w-2 bg-primary-foreground/50"}`}
                  aria-label={`Chọn banner ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/20 p-2 text-primary-foreground opacity-0 backdrop-blur transition-opacity hover:bg-white/30 group-hover:opacity-100"
              aria-label="Banner trước"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 z-30 -translate-y-1/2 rounded-full bg-white/20 p-2 text-primary-foreground opacity-0 backdrop-blur transition-opacity hover:bg-white/30 group-hover:opacity-100"
              aria-label="Banner sau"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-col">
        {subBanners.slice(0, 2).map((banner) => (
          <Link
            key={banner.id}
            to={banner.link || "/"}
            className="group/sub relative min-h-[clamp(8.75rem,8.2vw,9.5rem)] overflow-hidden rounded-xl border border-border/70 bg-primary shadow-card"
          >
            <div className="absolute inset-0 z-10 flex items-end bg-gradient-to-t from-primary-dark/98 via-primary/55 to-transparent dark:via-primary-dark/70">
              <div className="p-4">
                <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-cyan-100 backdrop-blur">
                  <Gift className="h-3 w-3" />
                  Ưu đãi
                </span>
                <h3 className="text-sm font-extrabold leading-tight text-primary-foreground md:text-base">{banner.title}</h3>
                {banner.subtitle && <p className="mt-1 text-xs font-medium text-primary-foreground/80">{banner.subtitle}</p>}
              </div>
            </div>
            <img
              src={banner.image}
              alt={banner.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover/sub:scale-105"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
