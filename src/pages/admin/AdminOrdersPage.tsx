import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Search, Eye, Phone, Printer, FileDown, Save } from "lucide-react";
import { useAdminOrders, useUpdateOrderStatus } from "@/hooks/queries/order.queries";

const UI_STATUSES = ["Mới", "Đang xử lý", "Hoàn thành", "Hủy"] as const;
type UiStatus = typeof UI_STATUSES[number];
type PaymentStatus = "Chưa thanh toán" | "Đã thanh toán" | "Hoàn tiền một phần" | "Đã hoàn tiền";

const uiToDb: Record<UiStatus, string> = {
  Mới: "PENDING",
  "Đang xử lý": "PROCESSING",
  "Hoàn thành": "DELIVERED",
  Hủy: "CANCELLED",
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
  Mới: "bg-blue-100 text-blue-700",
  "Đang xử lý": "bg-yellow-100 text-yellow-700",
  "Hoàn thành": "bg-green-100 text-green-700",
  Hủy: "bg-red-100 text-red-700",
};

const ORDER_META_STORAGE_KEY = "locan_admin_order_meta";

interface OrderItem {
  name?: string;
  productName?: string;
  quantity: number;
  price: number;
  product?: { name?: string };
}

interface ApiOrder {
  id: string;
  code?: string;
  orderNumber?: string;
  user?: { name?: string; phone?: string };
  customerName?: string;
  phone?: string;
  shippingAddress?: string;
  address?: string;
  items?: OrderItem[];
  orderItems?: OrderItem[];
  totalAmount?: number;
  total?: number;
  status: string;
  note?: string;
  notes?: string;
  createdAt?: string;
  date?: string;
}

interface OrderAdminMeta {
  assignee: string;
  trackingCode: string;
  paymentStatus: PaymentStatus;
  refundAmount: string;
  refundReason: string;
  internalNote: string;
}

function getOrderMetaMap(): Record<string, OrderAdminMeta> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(ORDER_META_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, OrderAdminMeta>) : {};
  } catch {
    return {};
  }
}

function saveOrderMetaMap(meta: Record<string, OrderAdminMeta>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ORDER_META_STORAGE_KEY, JSON.stringify(meta));
}

function getDefaultMeta(): OrderAdminMeta {
  return {
    assignee: "",
    trackingCode: "",
    paymentStatus: "Chưa thanh toán",
    refundAmount: "",
    refundReason: "",
    internalNote: "",
  };
}

function toUiStatus(db: string): UiStatus {
  return dbToUi[db] ?? "Mới";
}

function formatPrice(p: number) {
  return p.toLocaleString("vi-VN") + "đ";
}

function downloadTextFile(filename: string, content: string, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export default function AdminOrdersPage() {
  const [filters] = useState({ page: 1, limit: 50 });
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [detail, setDetail] = useState<ApiOrder | null>(null);
  const [metaMap, setMetaMap] = useState<Record<string, OrderAdminMeta>>(() => getOrderMetaMap());

  const { data, isLoading } = useAdminOrders(filters);
  const updateStatus = useUpdateOrderStatus();

  const orders: ApiOrder[] = (data as { orders?: ApiOrder[] } | undefined)?.orders || [];

  function getItems(order: ApiOrder): OrderItem[] {
    return order.items || order.orderItems || [];
  }

  function getTotal(order: ApiOrder) {
    return order.totalAmount ?? order.total ?? 0;
  }

  function getAddress(order: ApiOrder) {
    return order.shippingAddress || order.address || "";
  }

  function getCustomer(order: ApiOrder) {
    return order.user?.name || order.customerName || "";
  }

  function getPhone(order: ApiOrder) {
    return order.user?.phone || order.phone || "";
  }

  function getNote(order: ApiOrder) {
    return order.note || order.notes || "";
  }

  function getCode(order: ApiOrder) {
    return order.code || order.orderNumber || order.id;
  }

  const getMeta = (orderId: string) => metaMap[orderId] ?? getDefaultMeta();

  const filtered = useMemo(
    () =>
      orders.filter((order) => {
        const code = getCode(order);
        const name = getCustomer(order);
        const phone = getPhone(order);
        const meta = metaMap[order.id] ?? getDefaultMeta();
        const keyword = search.toLowerCase();
        const match =
          code.toLowerCase().includes(keyword) ||
          name.toLowerCase().includes(keyword) ||
          phone.includes(search) ||
          meta.assignee.toLowerCase().includes(keyword) ||
          meta.trackingCode.toLowerCase().includes(keyword);
        const uiStatus = toUiStatus(order.status);
        return match && (filterStatus === "all" || uiStatus === filterStatus);
      }),
    [filterStatus, metaMap, orders, search],
  );

  const updateMetaField = (orderId: string, field: keyof OrderAdminMeta, value: string) => {
    setMetaMap((current) => ({
      ...current,
      [orderId]: {
        ...(current[orderId] ?? getDefaultMeta()),
        [field]: value,
      },
    }));
  };

  const persistMeta = (orderId: string) => {
    const next = {
      ...metaMap,
      [orderId]: metaMap[orderId] ?? getDefaultMeta(),
    };
    saveOrderMetaMap(next);
    toast({ title: "Đã lưu thông tin vận hành đơn hàng" });
  };

  const handleUpdateStatus = async (id: string, uiStatus: UiStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status: uiToDb[uiStatus] });
      toast({ title: `Đã cập nhật trạng thái: ${uiStatus}` });
      if (detail?.id === id) {
        setDetail((current) => (current ? { ...current, status: uiToDb[uiStatus] } : current));
      }
    } catch {
      toast({ title: "Lỗi khi cập nhật trạng thái", variant: "destructive" });
    }
  };

  const exportOrders = () => {
    const rows = [
      ["Mã đơn", "Khách hàng", "SĐT", "Tổng tiền", "Trạng thái", "Phụ trách", "Mã vận đơn", "Thanh toán"].join(","),
      ...filtered.map((order) => {
        const meta = getMeta(order.id);
        return [
          getCode(order),
          `"${getCustomer(order)}"`,
          getPhone(order),
          getTotal(order),
          toUiStatus(order.status),
          `"${meta.assignee}"`,
          `"${meta.trackingCode}"`,
          meta.paymentStatus,
        ].join(",");
      }),
    ].join("\n");

    downloadTextFile("don-hang-loc-an.csv", rows, "text/csv;charset=utf-8");
    toast({ title: "Đã xuất danh sách đơn hàng" });
  };

  const exportSingleOrder = (order: ApiOrder) => {
    const meta = getMeta(order.id);
    const content = [
      `Mã đơn: ${getCode(order)}`,
      `Khách hàng: ${getCustomer(order)}`,
      `SĐT: ${getPhone(order)}`,
      `Địa chỉ: ${getAddress(order)}`,
      `Trạng thái: ${toUiStatus(order.status)}`,
      `Phụ trách: ${meta.assignee || "Chưa gán"}`,
      `Mã vận đơn: ${meta.trackingCode || "Chưa có"}`,
      `Thanh toán: ${meta.paymentStatus}`,
      `Ghi chú nội bộ: ${meta.internalNote || "Không có"}`,
      "",
      "Sản phẩm:",
      ...getItems(order).map((item) => `- ${item.name || item.productName || item.product?.name || ""} x${item.quantity} - ${formatPrice(item.price)}`),
      "",
      `Tổng cộng: ${formatPrice(getTotal(order))}`,
    ].join("\n");

    downloadTextFile(`${getCode(order)}.txt`, content);
    toast({ title: "Đã xuất chi tiết đơn hàng" });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quản lý đơn hàng</h1>
          <p className="text-sm text-muted-foreground">
            Theo dõi trạng thái đơn, gán nhân viên phụ trách, cập nhật vận đơn, thanh toán, hoàn tiền và xuất danh sách nhanh.
          </p>
        </div>
        <Button variant="outline" onClick={exportOrders}>
          <FileDown className="mr-2 h-4 w-4" />
          Xuất CSV
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Mã đơn, tên, SĐT, phụ trách, mã vận đơn..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
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
          <CardContent className="overflow-x-auto p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Phụ trách</TableHead>
                  <TableHead>Mã vận đơn</TableHead>
                  <TableHead>Thanh toán</TableHead>
                  <TableHead className="text-right">Tổng tiền</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((order) => {
                  const uiStatus = toUiStatus(order.status);
                  const meta = getMeta(order.id);

                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{getCode(order)}</TableCell>
                      <TableCell>
                        <div>
                          <p>{getCustomer(order)}</p>
                          <p className="text-xs text-muted-foreground">{getPhone(order)}</p>
                        </div>
                      </TableCell>
                      <TableCell>{meta.assignee || "Chưa gán"}</TableCell>
                      <TableCell>{meta.trackingCode || "—"}</TableCell>
                      <TableCell>{meta.paymentStatus}</TableCell>
                      <TableCell className="text-right font-medium">{formatPrice(getTotal(order))}</TableCell>
                      <TableCell>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[uiStatus]}`}>{uiStatus}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => setDetail(order)}><Eye className="h-4 w-4" /></Button>
                          {getPhone(order) && <Button variant="ghost" size="icon" asChild><a href={`tel:${getPhone(order)}`}><Phone className="h-4 w-4" /></a></Button>}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={8} className="py-8 text-center text-muted-foreground">Không có đơn hàng nào.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader><DialogTitle>Chi tiết đơn hàng {detail ? getCode(detail) : ""}</DialogTitle></DialogHeader>
          {detail && (
            <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Khách hàng:</span> <strong>{getCustomer(detail)}</strong></div>
                  <div><span className="text-muted-foreground">SĐT:</span> <strong>{getPhone(detail)}</strong></div>
                  <div className="col-span-2"><span className="text-muted-foreground">Địa chỉ:</span> {getAddress(detail)}</div>
                  {getNote(detail) && <div className="col-span-2"><span className="text-muted-foreground">Ghi chú khách:</span> {getNote(detail)}</div>}
                </div>

                <div className="overflow-hidden rounded-lg border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead className="text-center">SL</TableHead>
                        <TableHead className="text-right">Giá</TableHead>
                      </TableRow>
                    </TableHeader>
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
                        <TableCell className="text-right text-lg font-bold">{formatPrice(getTotal(detail))}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Vận hành đơn hàng</CardTitle>
                    <CardDescription>Những trường này hỗ trợ quản lý nội bộ trên giao diện admin.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Trạng thái</Label>
                      <Select value={toUiStatus(detail.status)} onValueChange={(v: UiStatus) => handleUpdateStatus(detail.id, v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{UI_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Nhân viên phụ trách</Label>
                      <Input value={getMeta(detail.id).assignee} onChange={(e) => updateMetaField(detail.id, "assignee", e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label>Mã vận đơn</Label>
                      <Input value={getMeta(detail.id).trackingCode} onChange={(e) => updateMetaField(detail.id, "trackingCode", e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label>Trạng thái thanh toán</Label>
                      <Select value={getMeta(detail.id).paymentStatus} onValueChange={(value: PaymentStatus) => updateMetaField(detail.id, "paymentStatus", value)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Chưa thanh toán">Chưa thanh toán</SelectItem>
                          <SelectItem value="Đã thanh toán">Đã thanh toán</SelectItem>
                          <SelectItem value="Hoàn tiền một phần">Hoàn tiền một phần</SelectItem>
                          <SelectItem value="Đã hoàn tiền">Đã hoàn tiền</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Số tiền hoàn</Label>
                        <Input placeholder="0" value={getMeta(detail.id).refundAmount} onChange={(e) => updateMetaField(detail.id, "refundAmount", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Lý do hoàn tiền</Label>
                        <Input placeholder="Nhập lý do" value={getMeta(detail.id).refundReason} onChange={(e) => updateMetaField(detail.id, "refundReason", e.target.value)} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Ghi chú nội bộ</Label>
                      <Textarea rows={4} value={getMeta(detail.id).internalNote} onChange={(e) => updateMetaField(detail.id, "internalNote", e.target.value)} />
                    </div>

                    <div className="flex flex-wrap justify-end gap-2">
                      {getPhone(detail) && <Button variant="outline" asChild><a href={`tel:${getPhone(detail)}`}><Phone className="mr-1 h-4 w-4" /> Gọi khách</a></Button>}
                      <Button variant="outline" onClick={() => window.print()}><Printer className="mr-1 h-4 w-4" /> In đơn</Button>
                      <Button variant="outline" onClick={() => exportSingleOrder(detail)}><FileDown className="mr-1 h-4 w-4" /> Xuất</Button>
                      <Button onClick={() => persistMeta(detail.id)}><Save className="mr-1 h-4 w-4" /> Lưu</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
