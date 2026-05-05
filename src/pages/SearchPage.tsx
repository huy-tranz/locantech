import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/queries/product.queries";
import { getProductsFromResponse } from "@/lib/productAdapter";
import { ChevronRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const q = (searchParams.get("q") ?? "").trim();
  const { data, isLoading } = useProducts({ search: q || undefined, limit: 100 });
  const results = q ? getProductsFromResponse(data) : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="section-container py-4 md:py-6">
        <ScrollReveal>
          <nav className="flex items-center text-sm text-muted-foreground mb-4 gap-1.5">
            <Link to="/" className="hover:text-primary">Trang chủ</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">Tìm kiếm</span>
          </nav>
        </ScrollReveal>

        <ScrollReveal delayMs={100}>
          <div className="mb-4">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Kết quả tìm kiếm</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {q ? <>Từ khóa: <span className="text-foreground font-medium">{q}</span></> : <>Vui lòng nhập từ khóa để tìm kiếm sản phẩm.</>}
            </p>
          </div>

          {q && (
            <div className="mb-4 text-sm text-muted-foreground">
              {isLoading ? "Đang tìm kiếm..." : <>Có <span className="text-foreground font-medium">{results.length}</span> sản phẩm phù hợp</>}
            </div>
          )}
        </ScrollReveal>

        {q && !isLoading && results.length === 0 ? (
          <ScrollReveal delayMs={200}>
            <div className="text-center py-16">
              <p className="text-muted-foreground">Không tìm thấy sản phẩm phù hợp với từ khóa này.</p>
              <Link to="/" className="btn-primary mt-3 inline-flex text-sm">Quay về trang chủ</Link>
            </div>
          </ScrollReveal>
        ) : (
          q && (
            <ScrollReveal delayMs={200}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </ScrollReveal>
          )
        )}
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
