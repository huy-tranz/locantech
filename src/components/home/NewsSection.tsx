import { Link } from "react-router-dom";
import { useNews } from "@/hooks/queries/cms.queries";
import { ArrowRight, CalendarDays, Tag } from "lucide-react";

export default function NewsSection() {
  const { data } = useNews({ limit: 6 });
  const articles: any[] = (data as any)?.articles || [];

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl md:text-2xl font-bold text-foreground">Tin tức & Kiến thức</h2>
        <Link to="/tin-tuc" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
          Xem tất cả <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map(article => (
          <Link
            key={article.id}
            to={`/tin-tuc/${article.slug}`}
            className="bg-card rounded-lg border overflow-hidden hover:shadow-md transition-shadow group"
          >
            <div className="aspect-video bg-muted overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                <span className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {article.category || article.tag || "Tin tức"}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {new Date(article.date || article.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {article.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{article.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
