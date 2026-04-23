import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Search, Eye, Phone, MessageSquare } from "lucide-react";
import { useRepairRequests, useUpdateRepairStatus } from "@/hooks/queries/repair.queries";

// ── Status mapping ────────────────────────────────────────
const UI_STATUSES = ["Chưa xử lý", "Đang xử lý", "Đã xong"] as const;
type UiStatus = typeof UI_STATUSES[number];

const uiToDb: Record<UiStatus, string> = {
  "Chưa xử lý": "RECEIVED",
  "Đang xử lý": "REPAIRING",
  "Đã xong": "DELIVERED",
};
const dbToUi: Record<string, UiStatus> = {
  RECEIVED: "Chưa xử lý",
  DIAGNOSING: "Đang xử lý",
  QUOTING: "Đang xử lý",
  APPROVED: "Đang xử lý",
  REPAIRING: "Đang xử lý",
  TESTING: "Đang xử lý",
  READY: "Đã xong",
  DELIVERED: "Đã xong",
};

const statusColors: Record<UiStatus, string> = {
  "Chưa xử lý": "bg-red-100 text-red-700",
  "Đang xử lý": "bg-yellow-100 text-yellow-700",
  "Đã xong": "bg-green-100 text-green-700",
};

function toUiStatus(db: string): UiStatus {
  return dbToUi[db] ?? "Chưa xử lý";
}

export default function AdminServicesPage() {
  const [filters, setFilters] = useState({ page: 1, limit: 50 });
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [detail, setDetail] = useState<any>(null);
  const [noteText, setNoteText] = useState("");

  const { data, isLoading } = useRepairRequests(filters);
  const updateStatus = useUpdateRepairStatus();

  const requests: any[] = (data as any)?.requests || [];
  const pagination: any = (data as any)?.pagination || {};

  const filtered = requests.filter((r) => {
    const phone = r.user?.phone || r.phone || "";
    const name = r.user?.name || r.customerName || "";
    const match = name.toLowerCase().includes(search.toLowerCase()) || phone.includes(search);
    const uiStatus = toUiStatus(r.status);
    return match && (filterStatus === "all" || uiStatus === filterStatus);
  });

  const handleUpdateStatus = async (id: string, uiStatus: UiStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status: uiToDb[uiStatus], note: "" });
      toast({ title: `Cập nhật: ${uiStatus}` });
      // Refresh detail if open
      if (detail?.id === id) {
        setDetail((d: any) => ({ ...d, status: uiToDb[uiStatus] }));
      }
    } catch {
      toast({ title: "Lỗi khi cập nhật trạng thái", variant: "destructive" });
    }
  };

  const addNote = async () => {
    if (!detail || !noteText.trim()) return;
    try {
      await updateStatus.mutateAsync({ id: detail.id, status: detail.status, note: noteText });
      toast({ title: "Đã thêm ghi chú" });
      setNoteText("");
    } catch {
      toast({ title: "Lỗi khi thêm ghi chú", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-foreground">Quản lý dịch vụ sửa chữa</h1>

      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Tên khách, SĐT..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
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
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>SĐT</TableHead>
                  <TableHead>Nội dung lỗi</TableHead>
                  <TableHead>Thiết bị</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => {
                  const uiStatus = toUiStatus(r.status);
                  const phone = r.user?.phone || r.phone || "";
                  return (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.user?.name || r.customerName}</TableCell>
                      <TableCell>{phone}</TableCell>
                      <TableCell className="max-w-[200px] truncate text-sm">{r.description || r.issue}</TableCell>
                      <TableCell className="text-sm">{r.product?.name || r.device}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[uiStatus]}`}>{uiStatus}</span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(r.createdAt || r.date).toLocaleDateString("vi-VN")}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => { setDetail(r); setNoteText(""); }}><Eye className="w-4 h-4" /></Button>
                          {phone && <Button variant="ghost" size="icon" asChild><a href={`tel:${phone}`}><Phone className="w-4 h-4" /></a></Button>}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filtered.length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Không có yêu cầu nào.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Chi tiết yêu cầu sửa chữa</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Khách:</span> <strong>{detail.user?.name || detail.customerName}</strong></div>
                <div><span className="text-muted-foreground">SĐT:</span> <strong>{detail.user?.phone || detail.phone}</strong></div>
                <div className="col-span-2"><span className="text-muted-foreground">Thiết bị:</span> {detail.product?.name || detail.device}</div>
                <div className="col-span-2"><span className="text-muted-foreground">Mô tả lỗi:</span><p className="mt-1 p-2 bg-muted rounded text-sm">{detail.description || detail.issue}</p></div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground shrink-0">Trạng thái:</span>
                <Select value={toUiStatus(detail.status)} onValueChange={(v: UiStatus) => handleUpdateStatus(detail.id, v)}>
                  <SelectTrigger className="flex-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{UI_STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              {detail.note && (
                <div>
                  <span className="text-sm text-muted-foreground">Ghi chú:</span>
                  <p className="mt-1 p-2 bg-muted rounded text-sm whitespace-pre-wrap">{detail.note}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Textarea placeholder="Thêm ghi chú..." value={noteText} onChange={(e) => setNoteText(e.target.value)} rows={2} className="flex-1" />
                <Button onClick={addNote} disabled={updateStatus.isPending}><MessageSquare className="w-4 h-4 mr-1" /> Ghi chú</Button>
              </div>

              {(detail.user?.phone || detail.phone) && (
                <div className="flex justify-end">
                  <Button variant="outline" asChild><a href={`tel:${detail.user?.phone || detail.phone}`}><Phone className="w-4 h-4 mr-1" /> Gọi khách</a></Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
