import { Link } from "react-router-dom";
import { Zap, ArrowRight } from "lucide-react";
import { getSaleProducts, formatPrice } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function FlashSaleSection() {
  const saleProducts = getSaleProducts().slice(0, 5);

  if (saleProducts.length === 0) return null;

  return (
    <section className="py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-accent" />
          <h2 className="text-lg md:text-xl font-bold text-sale">Flash Sale & Khuyến mãi</h2>
        </div>
        <Link to="/khuyen-mai" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
          Xem tất cả <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {saleProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
