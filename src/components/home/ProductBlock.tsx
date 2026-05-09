import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { type Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface ProductBlockProps {
  title: string;
  products: Product[];
  link: string;
  maxItems?: number;
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function ProductBlock({ title, products, link, maxItems = 12 }: ProductBlockProps) {
  const displayed = products.slice(0, maxItems);
  const [api, setApi] = useState<CarouselApi>();
  const [isPointerInside, setIsPointerInside] = useState(false);

  useEffect(() => {
    if (!api || displayed.length <= 1) return;

    const timer = window.setInterval(() => {
      if (document.hidden || isPointerInside) return;

      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 3200);

    return () => window.clearInterval(timer);
  }, [api, displayed.length, isPointerInside]);

  if (displayed.length === 0) return null;

  return (
    <motion.section
      className="py-4"
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="section-heading">
        <div className="min-w-0">
          <h2 className="section-heading-title">{title}</h2>
          <div className="mt-1 hidden items-center gap-1.5 text-[11px] font-bold text-muted-foreground sm:flex">
            <Sparkles className="h-3 w-3 text-accent" />
            {displayed.length} sản phẩm nổi bật
          </div>
        </div>
        <Link to={link} className="section-link">
          Xem tất cả <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: displayed.length > 6, dragFree: true }}
        className="group/product-carousel"
        onMouseEnter={() => setIsPointerInside(true)}
        onMouseLeave={() => setIsPointerInside(false)}
        onFocusCapture={() => setIsPointerInside(true)}
        onBlurCapture={() => setIsPointerInside(false)}
      >
        <CarouselContent className="-ml-2 md:-ml-3">
          {displayed.map((product) => (
            <CarouselItem
              key={product.id}
              className="basis-[72%] pl-2 sm:basis-[42%] md:basis-1/3 md:pl-3 lg:basis-1/5 xl:basis-1/6"
            >
              <motion.div variants={cardVariants} className="h-full">
                <ProductCard product={product} compact />
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-1 hidden border-white/80 bg-white/95 text-primary shadow-md transition hover:bg-white md:inline-flex md:opacity-0 md:group-hover/product-carousel:opacity-100" />
        <CarouselNext className="right-1 hidden border-white/80 bg-white/95 text-primary shadow-md transition hover:bg-white md:inline-flex md:opacity-0 md:group-hover/product-carousel:opacity-100" />
      </Carousel>
    </motion.section>
  );
}
