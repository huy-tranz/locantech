import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { categories, type Category } from "@/data/categories";

function hasChildren(category: Category) {
  return Boolean(category.children?.length);
}

function getColumnSpan(item: Category) {
  const count = item.children?.length ?? 0;
  return count >= 5 ? "col-span-2" : "";
}

export default function CategorySidebar() {
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);

  const activeCategory = useMemo(
    () => categories.find((category) => category.id === hoveredCat) ?? null,
    [hoveredCat],
  );

  return (
    <div className="relative" onMouseLeave={() => setHoveredCat(null)}>
      <div className="overflow-hidden rounded-xl border border-white/70 bg-card shadow-card">
        <div className="bg-gradient-to-r from-primary-dark to-primary px-4 py-3">
          <h3 className="text-sm font-extrabold text-primary-foreground">Danh mục sản phẩm</h3>
        </div>

        <ul>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = hoveredCat === cat.id;

            return (
              <li key={cat.id} onMouseEnter={() => setHoveredCat(cat.id)}>
                <Link
                  to={`/${cat.slug}`}
                  className={`flex items-center gap-2.5 border-b border-border/50 px-4 py-3 text-sm transition-colors ${
                    isActive ? "bg-primary/5 text-primary" : "text-foreground hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  {Icon && <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />}
                  <span className="flex-1 font-semibold">{cat.name}</span>
                  {cat.children && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {activeCategory?.children && (
        <div className="absolute bottom-0 left-full top-0 z-30 flex items-stretch">
          <div className="w-4 shrink-0" aria-hidden />
          <div className="w-[760px] self-start rounded-xl border bg-card p-5 shadow-2xl">
            <div className="mb-4 border-b border-border/70 pb-3">
              <p className="text-[15px] font-bold text-foreground">{activeCategory.name}</p>
            </div>

            <div className="grid grid-cols-[repeat(3,minmax(180px,1fr))] gap-x-8 gap-y-6 text-sm">
              {activeCategory.children.map((group) => (
                <div key={group.id} className={`min-w-0 ${getColumnSpan(group)}`}>
                  <p className="mb-2 text-[15px] font-bold text-sale">{group.name}</p>

                  {hasChildren(group) ? (
                    <div className="space-y-2">
                      {group.children?.map((child) => (
                        <Link
                          key={child.id}
                          to={`/${activeCategory.slug}?subcategory=${encodeURIComponent(child.slug)}`}
                          className="block break-words leading-6 text-foreground/90 transition-colors hover:text-primary"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      to={`/${activeCategory.slug}?subcategory=${encodeURIComponent(group.slug)}`}
                      className="block leading-6 text-foreground/90 transition-colors hover:text-primary"
                    >
                      {group.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
