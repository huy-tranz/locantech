import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import ProductCard from "@/components/ProductCard";
import { FLASH_SALE_STORAGE_KEY, getFlashSaleConfig } from "@/data/flashSale";
import { formatPrice, getAllProducts } from "@/data/products";
import { ChevronRight, Clock } from "lucide-react";

interface CountdownProps {
  targetDate: Date;
}

function CountdownTimer({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Clock className="h-5 w-5 text-sale" />
      <div className="flex items-center gap-1.5">
        <div className="rounded bg-sale px-2 py-1 font-mono text-sm font-bold text-white">{formatNumber(timeLeft.days)}</div>
        <span className="font-bold text-sale">:</span>
        <div className="rounded bg-sale px-2 py-1 font-mono text-sm font-bold text-white">{formatNumber(timeLeft.hours)}</div>
        <span className="font-bold text-sale">:</span>
        <div className="rounded bg-sale px-2 py-1 font-mono text-sm font-bold text-white">{formatNumber(timeLeft.minutes)}</div>
        <span className="font-bold text-sale">:</span>
        <div className="rounded bg-sale px-2 py-1 font-mono text-sm font-bold text-white">{formatNumber(timeLeft.seconds)}</div>
      </div>
      <span className="text-xs text-muted-foreground">Ngày : giờ : phút : giây</span>
    </div>
  );
}

export default function FlashSalePage() {
  const [config, setConfig] = useState(() => getFlashSaleConfig());

  useEffect(() => {
    const syncConfig = () => setConfig(getFlashSaleConfig());

    syncConfig();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === FLASH_SALE_STORAGE_KEY) {
        syncConfig();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const saleProducts = useMemo(() => {
    const products = getAllProducts();
    const selected = config.selectedProductIds
      .map((id) => products.find((product) => product.id === id))
      .filter(Boolean);

    if (selected.length > 0) {
      return selected;
    }

    return products
      .filter((product) => (product.discount ?? 0) > 0)
      .sort((a, b) => (b.discount || 0) - (a.discount || 0));
  }, [config.selectedProductIds]);

  const totalSavings = saleProducts.reduce((acc, product) => {
    if (product.originalPrice) {
      return acc + (product.originalPrice - product.price);
    }
    return acc;
  }, 0);

  const targetDate = useMemo(() => {
    const parsed = new Date(config.endAt);
    if (Number.isNaN(parsed.getTime())) {
      const fallback = new Date();
      fallback.setHours(fallback.getHours() + 24);
      return fallback;
    }
    return parsed;
  }, [config.endAt]);

  return (
    <div className="bg-background">
      <Header />
      <main className="section-container py-4 md:py-6">
        <nav className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Trang chủ
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">Flash Sale</span>
        </nav>

        <div className="relative mb-6 overflow-hidden rounded-2xl border-2 border-sale bg-gradient-to-r from-sale/10 to-sale/5 p-6">
          {config.bannerImage ? (
            <div
              className="absolute inset-y-0 right-0 hidden w-1/3 bg-cover bg-center opacity-15 lg:block"
              style={{ backgroundImage: `url(${config.bannerImage})` }}
            />
          ) : null}

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl text-center md:text-left">
              <div className="mb-3 inline-flex rounded-full border border-sale/20 bg-sale/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-sale">
                {config.badge}
              </div>
              <h1 className="mb-2 text-2xl font-bold text-sale md:text-3xl">{config.title}</h1>
              <p className="text-muted-foreground">{config.subtitle}</p>
              <p className="mt-3 text-sm text-muted-foreground">
                {saleProducts.length} sản phẩm đang hiển thị | Tiết kiệm tổng cộng{" "}
                <span className="font-bold text-sale">{formatPrice(totalSavings)}</span>
              </p>
            </div>

            <div className="text-center md:text-right">
              <p className="mb-2 text-sm text-muted-foreground">Kết thúc sau:</p>
              <CountdownTimer targetDate={targetDate} />
            </div>
          </div>
        </div>

        {saleProducts.length === 0 ? (
          <div className="rounded-lg border bg-card py-16 text-center">
            <p className="mb-2 text-muted-foreground">Chưa có sản phẩm nào trong chiến dịch Flash Sale.</p>
            <Link to="/" className="btn-primary">
              Về trang chủ
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between rounded-lg border bg-card px-4 py-2.5">
              <span className="text-sm text-muted-foreground">{saleProducts.length} sản phẩm giảm giá</span>
              <span className="text-sm font-medium text-sale">Chiến dịch được cấu hình từ trang admin</span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {saleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
