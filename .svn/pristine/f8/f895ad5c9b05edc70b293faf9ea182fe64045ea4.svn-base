import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Search, Eye, Phone, Printer } from "lucide-react";
import { useAdminOrders, useUpdateOrderStatus } from "@/hooks/queries/order.queries";

// ── Status mapping ────────────────────────────────────────
const UI_STATUSES = ["Mới", "Đang xử lý", "Hoàn thành", "Hủy"] as const;
type UiStatus = typeof UI_STATUSES[number];

const uiToDb: Record<UiStatus, string> = {
  "Mới": "PENDING",
  "Đang xử lý": "PROCESSING",
  "Hoàn thành": "DELIVERED",
  "Hủy": "CANCELLED",
};
const dbToUi: Record<string, UiStatus> = {
  PENDING: "Mới",
  CONFIRMED: "Đang xử lý",
  PROCESSING: "Đang xử lý",
  SHIPPED: "Đang xử lý",
  DELIVERED: "Hoàn thành",
  CANCELLED: "Hủy",
  REFUNDED: "Hủy",
};

const statusColors: Record<UiStatus, string> = {
  "Mới": "bg-blue-100 text-blue-700",
  "Đang xử lý": "bg-yellow-100 text-yellow-700",
  "Hoàn thành": "bg-green-100 text-green-700",
  "Hủy": "bg-red-100 text-red-700",
};

function toUiStatus(db: string): UiStatus {
  return dbToUi[db] ?? "Mới";
}

function formatPrice(p: number) {
  return p.toLocaleString("vi-VN") + "đ";
}

interface OrderItem { name?: string; productName?: string; quantity: number; price: number; product?: { name?: string } }

interface ApiOrder {
  id: string; code?: string; orderNumber?: string;
  user?: { name?: string; phone?: string }; customerName?: string; phone?: string;
  shippingAddress?: string; address?: string;
  items?: OrderItem[]; orderItems?: OrderItem[];
  totalAmount?: number; total?: number;
  status: string;
  note?: string; notes?: string;
  createdAt?: string; date?: string;
}

export default function AdminOrdersPage() {
  const [filters, setFilters] = useState({ page: 1, limit: 50 });
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [detail, setDetail] = useState<ApiOrder | null>(null);

  const { data, isLoading } = useAdminOrders(filters);
  const updateStatus = useUpdateOrderStatus();

  const orders: ApiOrder[] = (data as any)?.orders || [];
  // Search
  const filtered = orders.filter((o) => {
    const code = o.code || o.orderNumber || o.id;
    const name = o.user?.name || o.customerName || "";
    const phone = o.user?.phone || o.phone || "";
    const match = code.toLowerCase().includes(search.toLowerCase()) || name.toLowerCase().includes(search.toLowerCase()) || phone.includes(search);
    const uiStatus = toUiStatus(o.status);
    return match && (filterStatus === "all" || uiStatus === filterStatus);
  });

  const handleUpdateStatus = async (id: string, uiStatus: UiStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status: uiToDb[uiStatus] });
      toast({ title: `Đã cập nhật trạng thái: ${uiStatus}` });
      if (detail?.id === id) setDetail((d) => d ? { ...d, status: uiToDb[uiStatus] } : d);
    } catch {
      toast({ title: "Lỗi khi cập nhật trạng thái", variant: "destructive" });
    }
  };

  const getItems = (o: ApiOrder): OrderItem[] => o.items || o.orderItems || [];
  const getTotal = (o: ApiOrder) => o.totalAmount ?? o.total ?? 0;
  const getAddress = (o: ApiOrder) => o.shippingAddress || o.address || "";
  const getCustomer = (o: ApiOrder) => o.user?.name || o.customerName || "";
  const getPhone = (o: ApiOrder) => o.user?.phone || o.phone || "";
  const getNote = (o: ApiOrder) => o.note || o.notes || "";
  const getCode = (o: ApiOrder) => o.code || o.orderNumber || o.id;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Quản lý đơn hàng</h1>

      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Mã đơn, tên, SĐT..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {UI_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="p-8 text-center text-muted-foreground">Đang tải...</div>
      ) : (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>SĐT</TableHead>
                  <TableHead className="text-right">Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((o) => {
                  const uiStatus = toUiStatus(o.status);
                  return (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium">{getCode(o)}</TableCell>
                      <TableCell>{getCustomer(o)}</TableCell>
                      <TableCell>{getPhone(o)}</TableCell>
                      <TableCell className="text-right font-medium">{formatPrice(getTotal(o))}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[uiStatus]}`}>{uiStatus}</span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString("vi-VN") : (o.date || "").split(" ")[0]}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => setDetail(o)}><Eye className="w-4 h-4" /></Button>
                          {getPhone(o) && <Button variant="ghost" size="icon" asChild><a href={`tel:${getPhone(o)}`}><Phone className="w-4 h-4" /></a></Button>}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Không có đơn hàng nào.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Chi tiết đơn hàng {detail ? getCode(detail) : ""}</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Khách hàng:</span> <strong>{getCustomer(detail)}</strong></div>
                <div><span className="text-muted-foreground">SĐT:</span> <strong>{getPhone(detail)}</strong></div>
                <div className="col-span-2"><span className="text-muted-foreground">Địa chỉ:</span> {getAddress(detail)}</div>
                {getNote(detail) && <div className="col-span-2"><span className="text-muted-foreground">Ghi chú:</span> {getNote(detail)}</div>}
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader><TableRow>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead className="text-center">SL</TableHead>
                    <TableHead className="text-right">Giá</TableHead>
                  </TableRow></TableHeader>
                  <TableBody>
                    {getItems(detail).map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-sm">{item.name || item.productName || item.product?.name || ""}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} className="text-right font-bold">Tổng:</TableCell>
                      <TableCell className="text-right font-bold text-lg">{formatPrice(getTotal(detail))}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center gap-3">
                <Label className="shrink-0 text-sm">Trạng thái:</Label>
                <Select value={toUiStatus(detail.status)} onValueChange={(v: UiStatus) => handleUpdateStatus(detail.id, v)}>
                  <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{UI_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              <div className="flex justify-end gap-2">
                {getPhone(detail) && <Button variant="outline" asChild><a href={`tel:${getPhone(detail)}`}><Phone className="w-4 h-4 mr-1" /> Gọi khách</a></Button>}
                <Button variant="outline" onClick={() => { window.print(); }}><Printer className="w-4 h-4 mr-1" /> In đơn</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
