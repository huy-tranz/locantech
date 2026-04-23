import { Link } from "react-router-dom";
import { type Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

interface ProductBlockProps {
  title: string;
  products: Product[];
  link: string;
  maxItems?: number;
}

export default function ProductBlock({ title, products, link, maxItems = 5 }: ProductBlockProps) {
  const displayed = products.slice(0, maxItems);

  if (displayed.length === 0) return null;

  return (
    <ScrollReveal>
      <section className="py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-bold text-foreground">{title}</h2>
          <Link to={link} className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
            Xem tất cả <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {displayed.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </ScrollReveal>
  );
}
