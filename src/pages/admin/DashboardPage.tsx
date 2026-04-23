import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, DollarSign, Package, Wrench } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useOrderStats, useAdminOrders } from "@/hooks/queries/order.queries";
import { useProducts } from "@/hooks/queries/product.queries";
import { useRepairRequests } from "@/hooks/queries/repair.queries";

function formatPrice(value: number) {
  return `${Math.round(value).toLocaleString("vi-VN")}đ`;
}

const dayLabels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

const statusLabels: Record<string, string> = {
  PENDING: "Mới",
  CONFIRMED: "Đang xử lý",
  PROCESSING: "Đang xử lý",
  SHIPPED: "Đang xử lý",
  DELIVERED: "Hoàn thành",
  CANCELLED: "Hủy",
  REFUNDED: "Hủy",
};

const statusColors: Record<string, string> = {
  "Mới": "bg-blue-100 text-blue-700",
  "Đang xử lý": "bg-yellow-100 text-yellow-700",
  "Hoàn thành": "bg-green-100 text-green-700",
  "Hủy": "bg-red-100 text-red-700",
};

export default function DashboardPage() {
  const { data: statsData, isLoading: loadingStats } = useOrderStats();
  const { data: ordersData, isLoading: loadingOrders } = useAdminOrders({ page: 1, limit: 200 });
  const { data: productsData, isLoading: loadingProducts } = useProducts({ page: 1, limit: 5, sort: "sold", status: "all" });
  const { data: productCountData } = useProducts({ page: 1, limit: 1 });
  const { data: repairData, isLoading: loadingRepair } = useRepairRequests({ page: 1, limit: 1, status: "RECEIVED" });

  const allOrders = ((ordersData as any)?.orders || []) as Array<any>;
  const topProducts = ((productsData as any)?.products || []) as Array<any>;

  const chartData = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - 6);
    start.setHours(0, 0, 0, 0);

    const buckets = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return { date: d, name: dayLabels[d.getDay()], orders: 0, revenue: 0 };
    });

    allOrders.forEach((o) => {
      const created = new Date(o.createdAt);
      if (created < start || Number.isNaN(created.getTime())) return;
      const idx = Math.floor((created.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
      if (idx < 0 || idx > 6) return;
      buckets[idx].orders += 1;
      buckets[idx].revenue += Number(o.total || 0) / 1_000_000;
    });

    return buckets.map((b) => ({ ...b, revenue: Number(b.revenue.toFixed(2)) }));
  }, [allOrders]);

  const todayOrders = useMemo(() => {
    const today = new Date();
    return allOrders.filter((o) => {
      const d = new Date(o.createdAt);
      return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    }).length;
  }, [allOrders]);

  const todayRevenue = useMemo(() => {
    const today = new Date();
    return allOrders
      .filter((o) => {
        const d = new Date(o.createdAt);
        return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
      })
      .reduce((sum, o) => sum + Number(o.total || 0), 0);
  }, [allOrders]);

  const recentOrders = allOrders.slice(0, 5);

  const isLoading = loadingStats || loadingOrders || loadingProducts || loadingRepair;

  const stats = [
    { label: "Đơn hàng hôm nay", value: String(todayOrders), icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Doanh thu hôm nay", value: formatPrice(todayRevenue), icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
    { label: "Sản phẩm đang bán", value: String((productCountData as any)?.pagination?.total || 0), icon: Package, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Yêu cầu sửa chữa", value: String((repairData as any)?.pagination?.total || 0), icon: Wrench, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

      {isLoading && <div className="text-sm text-muted-foreground">Đang đồng bộ dữ liệu từ database...</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={cn(s.bg, "w-12 h-12 rounded-lg flex items-center justify-center shrink-0")}>
                <s.icon className={cn(s.color, "w-6 h-6")} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Đơn hàng trong 7 ngày</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Doanh thu 7 ngày (triệu đồng)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="text-base">Sản phẩm bán chạy</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p.id || i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    <span className="text-foreground truncate max-w-[230px]">{p.name}</span>
                  </div>
                  <div className="text-right text-muted-foreground">{Number(p.soldCount || 0)} đã bán</div>
                </div>
              ))}
              {topProducts.length === 0 && <div className="text-sm text-muted-foreground">Chưa có dữ liệu sản phẩm.</div>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Đơn hàng gần đây</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((o) => {
                const uiStatus = statusLabels[o.status] || o.status;
                return (
                  <div key={o.id} className="flex items-center justify-between text-sm">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{o.orderNumber} - {o.user?.name || "Khách hàng"}</p>
                      <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString("vi-VN")}</p>
                    </div>
                    <div className="text-right flex items-center gap-2 shrink-0">
                      <span className="font-medium">{formatPrice(Number(o.total || 0))}</span>
                      <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", statusColors[uiStatus] || "bg-gray-100 text-gray-700")}>{uiStatus}</span>
                    </div>
                  </div>
                );
              })}
              {recentOrders.length === 0 && <div className="text-sm text-muted-foreground">Chưa có đơn hàng.</div>}
            </div>
          </CardContent>
        </Card>
      </div>

      {loadingStats && <div className="text-xs text-muted-foreground">Đang tải thống kê tổng: {JSON.stringify(statsData || {})}</div>}
    </div>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}
