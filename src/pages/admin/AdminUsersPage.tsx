import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  useAdminUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/hooks/queries/user.queries";

// ── DB ↔ UI role mapping ─────────────────────────────────
type UiRole = "Quản trị viên" | "Khách hàng";
const uiToDb: Record<UiRole, string> = { "Quản trị viên": "ADMIN", "Khách hàng": "CUSTOMER" };
const dbToUi: Record<string, UiRole> = { ADMIN: "Quản trị viên", CUSTOMER: "Khách hàng", SUPERADMIN: "Quản trị viên" };

interface FormUser {
  id?: string;
  name: string;
  email: string;
  phone: string;
  role: UiRole;
  password?: string;
}

export default function AdminUsersPage() {
  const { data: users = [], isLoading } = useAdminUsers();
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<FormUser | null>(null);

  const openCreate = () => {
    setEditing({ id: undefined, name: "", email: "", phone: "", role: "Khách hàng", password: "" });
    setDialogOpen(true);
  };
  const openEdit = (u: any) => {
    setEditing({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone || "",
      role: dbToUi[u.role] ?? "Khách hàng",
      password: "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editing?.name || !editing?.email) { toast({ title: "Nhập tên và email", variant: "destructive" }); return; }
    const payload = { ...editing, role: uiToDb[editing.role] };
    try {
      if (editing.id) {
        const { password, ...updateData } = payload;
        await updateUser.mutateAsync({ id: editing.id, data: updateData });
        toast({ title: "Đã cập nhật người dùng" });
      } else {
        if (!editing.password) { toast({ title: "Nhập mật khẩu", variant: "destructive" }); return; }
        await createUser.mutateAsync({
          name: editing.name,
          email: editing.email,
          phone: editing.phone || undefined,
          role: uiToDb[editing.role],
          password: editing.password,
        });
        toast({ title: "Đã thêm người dùng" });
      }
      setDialogOpen(false);
    } catch {
      toast({ title: "Lỗi khi lưu người dùng", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Xóa người dùng này?")) return;
    try {
      await deleteUser.mutateAsync(id);
      toast({ title: "Đã xóa người dùng" });
    } catch {
      toast({ title: "Lỗi khi xóa", variant: "destructive" });
    }
  };

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Đang tải...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Quản lý người dùng</h1>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-1" /> Thêm người dùng</Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>SĐT</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => {
                const uiRole = dbToUi[u.role] ?? "Khách hàng";
                return (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{u.phone || "—"}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        u.role === "SUPERADMIN" || u.role === "ADMIN"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                      }`}>
                        {uiRole}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm ${u.status === "ACTIVE" ? "text-green-600" : "text-red-500"}`}>
                        ● {u.status === "ACTIVE" ? "Hoạt động" : u.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(u)}><Pencil className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(u.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {users.length === 0 && (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Chưa có người dùng nào.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing?.id ? "Sửa người dùng" : "Thêm người dùng"}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-2"><Label>Họ tên</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} /></div>
              <div className="space-y-2"><Label>SĐT</Label><Input value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} /></div>
              <div className="space-y-2">
                <Label>Vai trò</Label>
                    <Select value={editing.role} onValueChange={(v: UiRole) => setEditing({ ...editing, role: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Quản trị viên">Quản trị viên</SelectItem>
                        <SelectItem value="Khách hàng">Khách hàng</SelectItem>
                      </SelectContent>
                    </Select>
              </div>
              <div className="space-y-2">
                <Label>{editing.id ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu"}</Label>
                <Input type="password" value={editing.password || ""} onChange={(e) => setEditing({ ...editing, password: e.target.value })} placeholder={editing.id ? "••••••••" : ""} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
                <Button onClick={handleSave} disabled={createUser.isPending || updateUser.isPending}>Lưu</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
