import { Link, NavLink, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import ScrollReveal from "@/components/ScrollReveal";
import { ChevronRight, Phone } from "lucide-react";
import { getAllPolicies, getPolicyBySlug } from "@/data/policies";

const standalonePolicySlugs = ["huong-dan-mua-hang", "huong-dan-thanh-toan"];

function resolvePolicySlug(pathname: string, slug?: string) {
  if (slug) return slug;

  const cleanPath = pathname.replace(/^\/+/, "");
  if (standalonePolicySlugs.includes(cleanPath)) {
    return cleanPath;
  }

  return "";
}

function policyPath(slug: string) {
  if (standalonePolicySlugs.includes(slug)) {
    return `/${slug}`;
  }

  return `/chinh-sach/${slug}`;
}

export default function PolicyPage() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const policies = getAllPolicies();

  const resolvedSlug = resolvePolicySlug(location.pathname, slug);
  const policy = getPolicyBySlug(resolvedSlug);

  if (!policy) {
    return <Navigate to="/chinh-sach/bao-hanh" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="section-container py-4 md:py-6">
        <nav className="mb-4 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">
            Trang chủ
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="hover:text-primary">Chính sách</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-foreground">{policy.title}</span>
        </nav>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">{policy.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Cập nhật: {policy.lastUpdated}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <ScrollReveal>
              <div className="rounded-2xl border bg-card p-4 shadow-sm">
                <h2 className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Danh mục chính sách</h2>

                <div className="lg:hidden">
                  <select
                    value={policy.slug}
                    onChange={(event) => {
                      navigate(policyPath(event.target.value));
                    }}
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {policies.map((item) => (
                      <option key={item.slug} value={item.slug}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>

                <nav className="hidden space-y-1 lg:block">
                  {policies.map((item) => (
                    <NavLink
                      key={item.slug}
                      to={policyPath(item.slug)}
                      className={({ isActive }) =>
                        `block rounded-xl px-3 py-2.5 text-sm transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-muted hover:text-primary"
                        }`
                      }
                    >
                      {item.title}
                    </NavLink>
                  ))}
                </nav>
              </div>
            </ScrollReveal>
          </aside>

          <section className="min-w-0">
            <ScrollReveal delayMs={80}>
              <div className="rounded-2xl border bg-card p-6 shadow-sm md:p-8">
                <div className="space-y-8">
                  {policy.sections.map((section) => (
                    <div key={section.heading}>
                      <h2 className="text-xl font-bold text-foreground">{section.heading}</h2>
                      <div className="mt-3 space-y-2">
                        {section.content.split("\n").map((line, index) => (
                          <p key={`${section.heading}-${index}`} className="text-sm leading-7 text-muted-foreground">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10 rounded-2xl bg-primary p-6 text-primary-foreground">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="text-lg font-bold">Cần hỗ trợ thêm?</h3>
                      <p className="mt-1 text-sm text-primary-foreground/80">
                        Gọi 0989.386.219 hoặc để lại thông tin tại trang liên hệ để Lộc An hỗ trợ nhanh hơn.
                      </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <a href="tel:0989386219" className="btn-cta inline-flex items-center justify-center gap-2">
                        <Phone className="h-4 w-4" />
                        0989.386.219
                      </a>
                      <Link
                        to="/lien-he"
                        className="inline-flex items-center justify-center rounded-lg border border-white/30 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white hover:text-primary"
                      >
                        Đi đến liên hệ
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </section>
        </div>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
