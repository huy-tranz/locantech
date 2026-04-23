import { Link } from "react-router-dom";
import { getAllServices, getServiceIcon } from "@/data/services";
import { ArrowRight } from "lucide-react";

export default function ServiceSection() {
  const services = getAllServices();

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl md:text-2xl font-bold text-foreground">Dịch vụ sửa chữa & CNTT</h2>
        <Link to="/dich-vu" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
          Xem tất cả <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {services.map(service => {
          const Icon = getServiceIcon(service.iconKey);
          return (
            <Link
              key={service.id}
              to={`/dich-vu/${service.slug}`}
              className="bg-card rounded-lg border p-4 hover:shadow-md hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-1">{service.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{service.shortDesc}</p>
              <span className="text-xs text-primary font-medium">Xem chi tiết →</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
