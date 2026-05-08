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

/** Returns Tailwind classes for panel width + grid columns based on group count */
function getPanelLayout(groupCount: number) {
  if (groupCount >= 8) return { width: "w-[860px]", cols: "grid-cols-4" };
  if (groupCount >= 5) return { width: "w-[680px]", cols: "grid-cols-3" };
  if (groupCount >= 3) return { width: "w-[560px]", cols: "grid-cols-3" };
  return { width: "w-[420px]", cols: "grid-cols-2" };
}

const BADGE_STYLES: Record<string, string> = {
  Hot: "bg-sale text-white",
  Mới: "bg-primary text-primary-foreground",
  Sale: "bg-orange-500 text-white",
};

export default function CategorySidebar() {
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);

  const activeCategory = useMemo(
    () => categories.find((category) => category.id === hoveredCat) ?? null,
    [hoveredCat],
  );

  const panelLayout = useMemo(
    () => getPanelLayout(activeCategory?.children?.length ?? 0),
    [activeCategory],
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
                  className={`flex items-center gap-2.5 border-b border-border/50 px-4 py-2.5 text-sm transition-colors ${
                    isActive ? "bg-primary/5 text-primary" : "text-foreground hover:bg-primary/5 hover:text-primary"
                  }`}
                >
                  {Icon && (
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  )}
                  <span className="flex-1 font-semibold">{cat.name}</span>

                  {cat.badge && (
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[10px] font-black ${BADGE_STYLES[cat.badge] ?? "bg-muted text-foreground"}`}
                    >
                      {cat.badge}
                    </span>
                  )}

                  {cat.children && (
                    <ChevronRight className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {activeCategory?.children && (
        <div className="absolute bottom-0 left-full top-0 z-30 flex items-stretch">
          {/* Bridge gap so hover doesn't break when moving cursor between sidebar and panel */}
          <div className="w-4 shrink-0" aria-hidden />

          <div
            className={`${panelLayout.width} max-h-[calc(100vh-8rem)] self-start overflow-y-auto rounded-xl border bg-card p-5 shadow-2xl`}
          >
            {/* Panel header */}
            <div className="mb-4 flex items-center justify-between border-b border-border/70 pb-3">
              <div className="flex items-center gap-2">
                {activeCategory.icon && (
                  <activeCategory.icon className="h-5 w-5 text-primary" />
                )}
                <p className="text-[15px] font-bold text-foreground">{activeCategory.name}</p>
              </div>
              <Link
                to={`/${activeCategory.slug}`}
                className="text-xs font-semibold text-primary underline-offset-2 hover:underline"
              >
                Xem tất cả →
              </Link>
            </div>

            <div className={`grid ${panelLayout.cols} gap-x-6 gap-y-5 text-sm`}>
              {activeCategory.children.map((group) => (
                <div key={group.id} className={`min-w-0 ${getColumnSpan(group)}`}>
                  {/* Group heading */}
                  {hasChildren(group) ? (
                    <>
                      <p className="mb-2 text-[13px] font-black text-sale">{group.name}</p>
                      <div className="space-y-1.5">
                        {group.children?.map((child) => (
                          <Link
                            key={child.id}
                            to={`/${activeCategory.slug}?subcategory=${encodeURIComponent(child.slug)}`}
                            className="flex items-center gap-1.5 leading-5 text-foreground/80 transition-colors hover:text-primary"
                          >
                            <span className="mt-0.5 h-1 w-1 shrink-0 rounded-full bg-slate-300" aria-hidden />
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      to={`/${activeCategory.slug}?subcategory=${encodeURIComponent(group.slug)}`}
                      className="block leading-6 text-foreground/90 transition-colors hover:text-primary"
                    >
                      <span className="font-bold">{group.name}</span>
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
