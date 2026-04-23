import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import { useNews } from "@/hooks/queries/cms.queries";
import { ChevronRight, CalendarDays, Tag } from "lucide-react";

const categories = ["Tất cả", "Tư vấn", "Kiến thức", "Kinh nghiệm", "Hướng dẫn"];

export default function TinTucPage() {
  const [selectedCat, setSelectedCat] = useState("Tất cả");
  const { data } = useNews({ limit: 200 });
  const articles: any[] = (data as any)?.articles || [];

  const filtered = selectedCat === "Tất cả"
    ? articles
    : articles.filter((a: any) => a.category === selectedCat);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="section-container py-4 md:py-6">
        <nav className="flex items-center text-sm text-muted-foreground mb-4 gap-1.5">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium">Tin tức & Kiến thức</span>
        </nav>

        <h1 className="text-xl md:text-2xl font-bold text-foreground mb-4">Tin tức & Kiến thức công nghệ</h1>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${selectedCat === cat ? "bg-primary text-primary-foreground border-primary" : "text-foreground hover:bg-muted"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Articles grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((article: any) => (
            <Link
              key={article.id}
              to={`/tin-tuc/${article.slug}`}
              className="bg-card rounded-lg border overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="aspect-video bg-muted overflow-hidden">
                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1"><Tag className="h-3 w-3" />{article.category || "Tin tức"}</span>
                  <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{new Date(article.date || article.createdAt).toLocaleDateString("vi-VN")}</span>
                </div>
                <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">{article.title}</h3>
                <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{article.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center py-12 text-muted-foreground">Chưa có bài viết nào trong chủ đề này.</p>
        )}
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
