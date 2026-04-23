import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Search, Eye, Phone, MessageSquare, Plus, Pencil, Trash2, Save, Paperclip } from "lucide-react";
import { useRepairRequests, useUpdateRepairStatus } from "@/hooks/queries/repair.queries";
import {
  type ServiceIconKey,
  type ServiceItem,
  getAllServices,
  getServiceIcon,
  getServiceIconOptions,
  saveAllServices,
} from "@/data/services";

const UI_STATUSES = ["Chưa xử lý", "Đang xử lý", "Đã xong"] as const;
type UiStatus = typeof UI_STATUSES[number];
type AdminTab = "public-services" | "repair-requests";

interface ServiceForm {
  id?: string;
  name: string;
  slug: string;
  iconKey: ServiceIconKey;
  shortDesc: string;
  priceRange: string;
  duration: string;
}

interface RepairMeta {
  technician: string;
  quote: string;
  attachments: string[];
  timeline: Array<{ id: string; time: string; title: string; note: string }>;
}

const REPAIR_META_STORAGE_KEY = "locan_admin_repair_meta";

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

const emptyServiceForm: ServiceForm = {
  name: "",
  slug: "",
  iconKey: "wrench",
  shortDesc: "",
  priceRange: "",
  duration: "",
};

function normalizeSlug(value: string) {
  return value.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function toUiStatus(db: string): UiStatus {
  return dbToUi[db] ?? "Chưa xử lý";
}

function getRepairMetaMap(): Record<string, RepairMeta> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(REPAIR_META_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, RepairMeta>) : {};
  } catch {
    return {};
  }
}

function saveRepairMetaMap(meta: Record<string, RepairMeta>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(REPAIR_META_STORAGE_KEY, JSON.stringify(meta));
}

function getDefaultRepairMeta(): RepairMeta {
  return {
    technician: "",
    quote: "",
    attachments: [],
    timeline: [],
  };
}

export default function AdminServicesPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("public-services");
  const [services, setServices] = useState<ServiceItem[]>(() => getAllServices());
  const [serviceSearch, setServiceSearch] = useState("");
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceForm | null>(null);

  const [filters] = useState({ page: 1, limit: 50 });
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [detail, setDetail] = useState<any>(null);
  const [noteText, setNoteText] = useState("");
  const [timelineTitle, setTimelineTitle] = useState("");
  const [timelineNote, setTimelineNote] = useState("");
  const [attachmentText, setAttachmentText] = useState("");
  const [repairMetaMap, setRepairMetaMap] = useState<Record<string, RepairMeta>>(() => getRepairMetaMap());

  const { data, isLoading } = useRepairRequests(filters);
  const updateStatus = useUpdateRepairStatus();
  const requests: any[] = (data as any)?.requests || [];

  const filteredServices = useMemo(() => {
    const keyword = serviceSearch.trim().toLowerCase();
    if (!keyword) return services;
    return services.filter((service) =>
      [service.name, service.slug, service.shortDesc, service.priceRange, service.duration].join(" ").toLowerCase().includes(keyword),
    );
  }, [serviceSearch, services]);

  const filteredRequests = requests.filter((request) => {
    const phone = request.user?.phone || request.phone || "";
    const name = request.user?.name || request.customerName || "";
    const technician = (repairMetaMap[request.id]?.technician ?? "").toLowerCase();
    const match =
      name.toLowerCase().includes(search.toLowerCase()) ||
      phone.includes(search) ||
      technician.includes(search.toLowerCase());
    const uiStatus = toUiStatus(request.status);
    return match && (filterStatus === "all" || uiStatus === filterStatus);
  });

  const getMeta = (requestId: string) => repairMetaMap[requestId] ?? getDefaultRepairMeta();

  const updateRepairMetaField = (requestId: string, field: "technician" | "quote", value: string) => {
    setRepairMetaMap((current) => ({
      ...current,
      [requestId]: {
        ...(current[requestId] ?? getDefaultRepairMeta()),
        [field]: value,
      },
    }));
  };

  const persistRepairMeta = (requestId: string) => {
    const next = {
      ...repairMetaMap,
      [requestId]: repairMetaMap[requestId] ?? getDefaultRepairMeta(),
    };
    saveRepairMetaMap(next);
    toast({ title: "Đã lưu thông tin sửa chữa" });
  };

  const openCreateService = () => {
    setEditingService({ ...emptyServiceForm });
    setServiceDialogOpen(true);
  };

  const openEditService = (service: ServiceItem) => {
    setEditingService({ ...service });
    setServiceDialogOpen(true);
  };

  const persistServices = (next: ServiceItem[]) => {
    setServices(next);
    saveAllServices(next);
  };

  const handleSaveService = () => {
    if (!editingService) return;

    const name = editingService.name.trim();
    const slug = normalizeSlug(editingService.slug || editingService.name);

    if (!name || !slug || !editingService.shortDesc.trim()) {
      toast({ title: "Thiếu thông tin dịch vụ", description: "Vui lòng nhập tên, slug và mô tả ngắn.", variant: "destructive" });
      return;
    }

    const duplicate = services.find((service) => service.slug === slug && service.id !== editingService.id);
    if (duplicate) {
      toast({ title: "Slug đã tồn tại", description: "Vui lòng chọn slug khác để tránh trùng đường dẫn.", variant: "destructive" });
      return;
    }

    const payload: ServiceItem = {
      id: editingService.id || crypto.randomUUID(),
      name,
      slug,
      iconKey: editingService.iconKey,
      shortDesc: editingService.shortDesc.trim(),
      priceRange: editingService.priceRange.trim(),
      duration: editingService.duration.trim(),
    };

    const next = editingService.id ? services.map((service) => (service.id === editingService.id ? payload : service)) : [...services, payload];
    persistServices(next);
    setServiceDialogOpen(false);
    toast({ title: editingService.id ? "Đã cập nhật dịch vụ" : "Đã thêm dịch vụ" });
  };

  const handleDeleteService = (id: string) => {
    const service = services.find((item) => item.id === id);
    if (!service) return;
    if (!window.confirm(`Xóa dịch vụ "${service.name}"?`)) return;
    persistServices(services.filter((item) => item.id !== id));
    toast({ title: "Đã xóa dịch vụ" });
  };

  const handleUpdateStatus = async (id: string, uiStatus: UiStatus) => {
    try {
      await updateStatus.mutateAsync({ id, status: uiToDb[uiStatus], note: "" });
      toast({ title: `Cập nhật: ${uiStatus}` });
      if (detail?.id === id) {
        setDetail((current: any) => ({ ...current, status: uiToDb[uiStatus] }));
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
      setDetail((current: any) => ({ ...current, note: noteText }));
      setNoteText("");
    } catch {
      toast({ title: "Lỗi khi thêm ghi chú", variant: "destructive" });
    }
  };

  const addTimelineEntry = (requestId: string) => {
    if (!timelineTitle.trim()) return;
    setRepairMetaMap((current) => ({
      ...current,
      [requestId]: {
        ...(current[requestId] ?? getDefaultRepairMeta()),
        timeline: [
          ...(current[requestId]?.timeline ?? []),
          {
            id: crypto.randomUUID(),
            time: new Date().toLocaleString("vi-VN"),
            title: timelineTitle.trim(),
            note: timelineNote.trim(),
          },
        ],
      },
    }));
    setTimelineTitle("");
    setTimelineNote("");
  };

  const addAttachment = (requestId: string) => {
    const value = attachmentText.trim();
    if (!value) return;
    setRepairMetaMap((current) => ({
      ...current,
      [requestId]: {
        ...(current[requestId] ?? getDefaultRepairMeta()),
        attachments: [...(current[requestId]?.attachments ?? []), value],
      },
    }));
    setAttachmentText("");
  };

  const removeTimelineEntry = (requestId: string, timelineId: string) => {
    setRepairMetaMap((current) => ({
      ...current,
      [requestId]: {
        ...(current[requestId] ?? getDefaultRepairMeta()),
        timeline: (current[requestId]?.timeline ?? []).filter((item) => item.id !== timelineId),
      },
    }));
  };

  const removeAttachment = (requestId: string, attachment: string) => {
    setRepairMetaMap((current) => ({
      ...current,
      [requestId]: {
        ...(current[requestId] ?? getDefaultRepairMeta()),
        attachments: (current[requestId]?.attachments ?? []).filter((item) => item !== attachment),
      },
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quản lý dịch vụ</h1>
          <p className="text-sm text-muted-foreground">
            Quản lý dịch vụ public và vận hành yêu cầu sửa chữa với timeline, báo giá, kỹ thuật viên phụ trách và file đính kèm.
          </p>
        </div>
        <div className="inline-flex rounded-xl border bg-card p-1">
          <button
            type="button"
            onClick={() => setActiveTab("public-services")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === "public-services" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Dịch vụ public
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("repair-requests")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === "repair-requests" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Yêu cầu sửa chữa
          </button>
        </div>
      </div>

      {activeTab === "public-services" ? (
        <>
          <Card>
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Tìm theo tên, slug, mô tả..." value={serviceSearch} onChange={(event) => setServiceSearch(event.target.value)} className="pl-9" />
              </div>
              <Button onClick={openCreateService}>
                <Plus className="mr-1 h-4 w-4" />
                Thêm dịch vụ
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="overflow-x-auto p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dịch vụ</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Mô tả ngắn</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service) => {
                    const Icon = getServiceIcon(service.iconKey);
                    return (
                      <TableRow key={service.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{service.name}</p>
                              <p className="text-xs text-muted-foreground">{service.iconKey}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{service.slug}</TableCell>
                        <TableCell>{service.priceRange || "—"}</TableCell>
                        <TableCell>{service.duration || "—"}</TableCell>
                        <TableCell className="max-w-[320px] text-sm text-muted-foreground">{service.shortDesc}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => openEditService(service)}><Pencil className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeleteService(service.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredServices.length === 0 && (
                    <TableRow><TableCell colSpan={6} className="py-8 text-center text-muted-foreground">Không có dịch vụ public nào phù hợp.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <Card>
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Tên khách, SĐT, kỹ thuật viên..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {UI_STATUSES.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}
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
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Thiết bị</TableHead>
                      <TableHead>Kỹ thuật viên</TableHead>
                      <TableHead>Báo giá</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Timeline</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request) => {
                      const uiStatus = toUiStatus(request.status);
                      const meta = getMeta(request.id);
                      const phone = request.user?.phone || request.phone || "";
                      return (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium text-foreground">{request.user?.name || request.customerName}</p>
                              <p className="text-xs text-muted-foreground">{phone}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{request.product?.name || request.device}</TableCell>
                          <TableCell>{meta.technician || "Chưa gán"}</TableCell>
                          <TableCell>{meta.quote || "Chưa báo giá"}</TableCell>
                          <TableCell><span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[uiStatus]}`}>{uiStatus}</span></TableCell>
                          <TableCell>{meta.timeline.length}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" onClick={() => { setDetail(request); setNoteText(""); setTimelineTitle(""); setTimelineNote(""); setAttachmentText(""); }}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              {phone && <Button variant="ghost" size="icon" asChild><a href={`tel:${phone}`}><Phone className="h-4 w-4" /></a></Button>}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {filteredRequests.length === 0 && (
                      <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">Không có yêu cầu nào.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </>
      )}

      <Dialog open={serviceDialogOpen} onOpenChange={setServiceDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>{editingService?.id ? "Sửa dịch vụ public" : "Thêm dịch vụ public"}</DialogTitle></DialogHeader>
          {editingService && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Tên dịch vụ</Label>
                  <Input
                    value={editingService.name}
                    onChange={(event) => {
                      const name = event.target.value;
                      setEditingService((current) => current ? { ...current, name, slug: current.id ? current.slug : normalizeSlug(name) } : current);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Slug</Label>
                  <Input value={editingService.slug} onChange={(event) => setEditingService((current) => current ? { ...current, slug: normalizeSlug(event.target.value) } : current)} />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <Select value={editingService.iconKey} onValueChange={(value: ServiceIconKey) => setEditingService((current) => current ? { ...current, iconKey: value } : current)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {getServiceIconOptions().map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Khoảng giá</Label>
                  <Input value={editingService.priceRange} onChange={(event) => setEditingService((current) => current ? { ...current, priceRange: event.target.value } : current)} />
                </div>
                <div className="space-y-2">
                  <Label>Thời gian xử lý</Label>
                  <Input value={editingService.duration} onChange={(event) => setEditingService((current) => current ? { ...current, duration: event.target.value } : current)} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mô tả ngắn</Label>
                <Textarea rows={4} value={editingService.shortDesc} onChange={(event) => setEditingService((current) => current ? { ...current, shortDesc: event.target.value } : current)} />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setServiceDialogOpen(false)}>Hủy</Button>
                <Button onClick={handleSaveService}>Lưu dịch vụ</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-5xl">
          <DialogHeader><DialogTitle>Chi tiết yêu cầu sửa chữa</DialogTitle></DialogHeader>
          {detail && (
            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Khách:</span> <strong>{detail.user?.name || detail.customerName}</strong></div>
                  <div><span className="text-muted-foreground">SĐT:</span> <strong>{detail.user?.phone || detail.phone}</strong></div>
                  <div className="col-span-2"><span className="text-muted-foreground">Thiết bị:</span> {detail.product?.name || detail.device}</div>
                  <div className="col-span-2"><span className="text-muted-foreground">Mô tả lỗi:</span><p className="mt-1 rounded bg-muted p-2 text-sm">{detail.description || detail.issue}</p></div>
                </div>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Timeline xử lý</CardTitle>
                    <CardDescription>Ghi lại các mốc kiểm tra, báo giá, sửa chữa và bàn giao.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {(getMeta(detail.id).timeline.length > 0 ? getMeta(detail.id).timeline : []).map((entry) => (
                      <div key={entry.id} className="rounded-xl border p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-foreground">{entry.title}</p>
                            <p className="text-xs text-muted-foreground">{entry.time}</p>
                            {entry.note ? <p className="mt-2 text-sm text-muted-foreground">{entry.note}</p> : null}
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => removeTimelineEntry(detail.id, entry.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {getMeta(detail.id).timeline.length === 0 && (
                      <div className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
                        Chưa có timeline xử lý nào.
                      </div>
                    )}

                    <div className="grid gap-3 md:grid-cols-2">
                      <Input placeholder="Tiêu đề mốc xử lý" value={timelineTitle} onChange={(e) => setTimelineTitle(e.target.value)} />
                      <Input placeholder="Ghi chú thêm" value={timelineNote} onChange={(e) => setTimelineNote(e.target.value)} />
                    </div>
                    <Button variant="outline" onClick={() => addTimelineEntry(detail.id)}>
                      <Plus className="mr-1 h-4 w-4" />
                      Thêm mốc timeline
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Điều phối sửa chữa</CardTitle>
                    <CardDescription>Quản lý nội bộ cho từng yêu cầu sửa chữa.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Trạng thái</Label>
                      <Select value={toUiStatus(detail.status)} onValueChange={(value: UiStatus) => handleUpdateStatus(detail.id, value)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>{UI_STATUSES.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Kỹ thuật viên phụ trách</Label>
                      <Input value={getMeta(detail.id).technician} onChange={(e) => updateRepairMetaField(detail.id, "technician", e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label>Báo giá</Label>
                      <Input placeholder="Ví dụ: 850.000đ" value={getMeta(detail.id).quote} onChange={(e) => updateRepairMetaField(detail.id, "quote", e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label>File / link đính kèm</Label>
                      <div className="flex gap-2">
                        <Input placeholder="Dán link ảnh, video, biên bản..." value={attachmentText} onChange={(e) => setAttachmentText(e.target.value)} />
                        <Button variant="outline" onClick={() => addAttachment(detail.id)}>
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {getMeta(detail.id).attachments.map((attachment) => (
                          <div key={attachment} className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2">
                            <span className="line-clamp-1 text-sm text-foreground">{attachment}</span>
                            <Button variant="ghost" size="icon" onClick={() => removeAttachment(detail.id, attachment)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {detail.note && (
                      <div>
                        <span className="text-sm text-muted-foreground">Ghi chú API:</span>
                        <p className="mt-1 whitespace-pre-wrap rounded bg-muted p-2 text-sm">{detail.note}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Textarea placeholder="Thêm ghi chú cập nhật..." value={noteText} onChange={(e) => setNoteText(e.target.value)} rows={2} className="flex-1" />
                      <Button onClick={addNote} disabled={updateStatus.isPending}>
                        <MessageSquare className="mr-1 h-4 w-4" />
                        Ghi chú
                      </Button>
                    </div>

                    <div className="flex flex-wrap justify-end gap-2">
                      {(detail.user?.phone || detail.phone) && <Button variant="outline" asChild><a href={`tel:${detail.user?.phone || detail.phone}`}><Phone className="mr-1 h-4 w-4" /> Gọi khách</a></Button>}
                      <Button variant="outline" onClick={() => persistRepairMeta(detail.id)}>
                        <Save className="mr-1 h-4 w-4" />
                        Lưu
                      </Button>
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
