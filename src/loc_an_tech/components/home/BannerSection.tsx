import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useBanners } from "@/hooks/queries/cms.queries";
import { ChevronLeft, ChevronRight } from "lucide-react";

// DB shape: position = "HERO" | "SIDEBAR", isActive = boolean
interface BannerItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  link?: string;
  position: "HERO" | "SIDEBAR";
  isActive: boolean;
}

export default function BannerSection() {
  const { data: rawBanners = [] } = useBanners();

  const activeBanners = (rawBanners as BannerItem[]).filter((b) => b.isActive);
  const mainBanners = activeBanners.filter((b) => b.position === "HERO");
  const subBanners = activeBanners.filter((b) => b.position === "SIDEBAR");
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (mainBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % mainBanners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [mainBanners.length]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      {/* Main banner */}
      <div className="lg:col-span-2 relative rounded-lg overflow-hidden bg-primary group">
        <div className="relative h-48 sm:h-64 md:h-80">
          {mainBanners.map((b, i) => (
            <Link
              key={b.id}
              to={b.link}
              className={`absolute inset-0 transition-opacity duration-500 ${i === current ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 to-primary/60 flex items-center z-10">
                <div className="px-6 md:px-10">
                  <h2 className="text-xl md:text-3xl font-extrabold text-primary-foreground mb-2">{b.title}</h2>
                  {b.subtitle && (
                    <p className="text-sm md:text-base text-primary-foreground/80">{b.subtitle}</p>
                  )}
                  <span className="btn-cta mt-4 inline-flex">Xem ngay →</span>
                </div>
              </div>
              <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
            </Link>
          ))}
        </div>
        {/* Nav dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {mainBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${i === current ? "w-6 bg-accent" : "w-2 bg-primary-foreground/50"}`}
            />
          ))}
        </div>
        {/* Arrows */}
        <button
          onClick={() => setCurrent(prev => (prev - 1 + mainBanners.length) % mainBanners.length)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/40 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => setCurrent(prev => (prev + 1) % mainBanners.length)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1.5 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/40 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Sub banners */}
      <div className="flex flex-row lg:flex-col gap-3">
        {subBanners.slice(0, 2).map((b) => (
          <Link
            key={b.id}
            to={b.link || "/"}
            className="flex-1 relative rounded-lg overflow-hidden bg-primary group/sub"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 to-primary/40 flex items-end z-10">
              <div className="p-4">
                <h3 className="text-sm md:text-base font-bold text-primary-foreground">{b.title}</h3>
                {b.subtitle && (
                  <p className="text-xs text-primary-foreground/70 mt-0.5">{b.subtitle}</p>
                )}
              </div>
            </div>
            <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
          </Link>
        ))}
      </div>
    </div>
  );
}
