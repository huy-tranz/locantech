import { Link } from "react-router-dom";
import { getAllServices, getServiceIcon } from "@/data/services";
import { ArrowRight } from "lucide-react";

export default function ServiceSection() {
  const services = getAllServices();

  return (
    <section className="py-8">
      <div className="section-heading">
        <div>
          <p className="section-label text-service">Service</p>
          <h2 className="section-heading-title">Dịch vụ sửa chữa & CNTT</h2>
        </div>
        <Link to="/dich-vu" className="section-link">
          Xem tất cả <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {services.map((service) => {
          const Icon = getServiceIcon(service.iconKey);
          return (
            <Link
              key={service.id}
              to={`/dich-vu/${service.slug}`}
              className="group rounded-xl border border-white/70 bg-card p-4 shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-service/30"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-service/10 transition-colors group-hover:bg-service">
                <Icon className="h-5 w-5 text-service group-hover:text-service-foreground" />
              </div>
              <h3 className="mb-1 text-sm font-bold text-foreground">{service.name}</h3>
              <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">{service.shortDesc}</p>
              <span className="text-xs font-bold text-service">Xem chi tiết →</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
