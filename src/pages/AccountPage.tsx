import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import ProductCard from "@/components/ProductCard";
import { formatPrice } from "@/data/products";
import { useCart } from "@/hooks/use-cart";
import { toast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/queries/product.queries";
import { getProductsFromResponse } from "@/lib/productAdapter";
import { useAuth } from "@/hooks/useAuth";
import orderApi from "@/api/order.api";
import repairApi from "@/api/repair.api";
import type { AuthSession } from "@/lib/auth";
import { getAccountData, saveAccountData, type AccountAddress, type AccountData, type AccountOrder, type RepairRequest } from "@/lib/account";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, CheckCircle2, Clock3, Heart, History, LockKeyhole, LogOut, MapPin, PackageSearch, PenSquare, Plus, Shield, ShoppingBag, Trash2, User, Wrench } from "lucide-react";

type SectionKey = "profile" | "orders" | "repairs" | "addresses" | "wishlist" | "recentlyViewed" | "security";

const sections: Array<{ key: SectionKey; label: string; icon: typeof User }> = [
  { key: "profile", label: "Thông tin tài khoản", icon: User },
  { key: "orders", label: "Đơn hàng của tôi", icon: ShoppingBag },
  { key: "repairs", label: "Dịch vụ sửa chữa", icon: Wrench },
  { key: "addresses", label: "Địa chỉ", icon: MapPin },
  { key: "wishlist", label: "Danh sách yêu thích", icon: Heart },
  { key: "recentlyViewed", label: "Đã xem gần đây", icon: History },
  { key: "security", label: "Bảo mật", icon: Shield },
];

const orderStatusMap = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  processing: "bg-blue-100 text-blue-700 border-blue-200",
  shipping: "bg-sky-100 text-sky-700 border-sky-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
  refunded: "bg-purple-100 text-purple-700 border-purple-200",
} as const;

const repairStatusMap = {
  received: "bg-orange-100 text-orange-700 border-orange-200",
  repairing: "bg-blue-100 text-blue-700 border-blue-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
} as const;

const labels = {
  pending: "Chờ xác nhận",
  processing: "Đang xử lý",
  shipping: "Đang giao",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
  refunded: "Đã hoàn tiền",
  received: "Đã tiếp nhận",
  repairing: "Đang sửa chữa",
};

const formatDate = (v: string) => new Date(v).toLocaleDateString("vi-VN");
const formatDateTime = (v: string) => new Date(v).toLocaleString("vi-VN");
const buildAddressText = (a: AccountAddress) => [a.line1, a.ward, a.district, a.city].filter(Boolean).join(", ");
const emptyAddress = (u: AuthSession | null): AccountAddress => ({ id: "", fullName: u?.fullName ?? "", phone: u?.phone ?? "", line1: "", ward: "", district: "", city: "Ha Noi", note: "", isDefault: false });

const normalizeOrderStatus = (status?: string): AccountOrder["status"] => {
  switch (status) {
    case "CONFIRMED":
    case "PROCESSING":
      return "processing";
    case "SHIPPED":
      return "shipping";
    case "DELIVERED":
      return "completed";
    case "CANCELLED":
      return "cancelled";
    case "REFUNDED":
      return "refunded";
    default:
      return "pending";
  }
};

const normalizeRepairStatus = (status?: string): RepairRequest["status"] => {
  switch (status) {
    case "DELIVERED":
    case "READY":
      return "completed";
    case "CANCELLED":
    case "REJECTED":
      return "cancelled";
    case "DIAGNOSING":
    case "QUOTING":
    case "APPROVED":
    case "REPAIRING":
    case "TESTING":
      return "repairing";
    default:
      return "received";
  }
};

export default function AccountPage() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user: authUser, isLoading: authLoading, logout: logoutAuth, updateProfile, changePassword } = useAuth();
  const [section, setSection] = useState<SectionKey>("profile");
  const [user, setUser] = useState<AuthSession | null>(null);
  const [data, setData] = useState<AccountData | null>(null);
  const [profile, setProfile] = useState({ fullName: "", phone: "", email: "", avatar: "" });
  const [password, setPassword] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [orderDetail, setOrderDetail] = useState<AccountOrder | null>(null);
  const [repairDetail, setRepairDetail] = useState<RepairRequest | null>(null);
  const [addressOpen, setAddressOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AccountAddress | null>(null);
  const { data: productsData } = useProducts({ status: "all", limit: 500 });
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["orders", "me", { limit: 100 }],
    queryFn: () => orderApi.getAll({ limit: 100 }),
    enabled: !!authUser,
  });
  const { data: repairsData, isLoading: repairsLoading } = useQuery({
    queryKey: ["repair", "me"],
    queryFn: () => repairApi.getAll(),
    enabled: !!authUser,
  });
  const allProducts = useMemo(() => getProductsFromResponse(productsData), [productsData]);

  useEffect(() => {
    if (authLoading) return;
    if (!authUser) {
      navigate("/dang-nhap", { replace: true });
      return;
    }
    const current: AuthSession = {
      id: authUser.id,
      fullName: authUser.name,
      phone: authUser.phone ?? "",
      email: authUser.email,
      avatar: authUser.avatar,
    };
    setUser(current);
    setProfile({ fullName: current.fullName, phone: current.phone, email: current.email, avatar: current.avatar ?? "" });
    setData(getAccountData(current.id));
  }, [authLoading, authUser, navigate]);

  const orders = useMemo<AccountOrder[]>(() => {
    const source = Array.isArray(ordersData) ? ordersData : ordersData?.orders ?? [];
    return source.map((order: any) => ({
      id: order.id,
      code: order.orderNumber,
      createdAt: order.createdAt,
      status: normalizeOrderStatus(order.status),
      address: order.shippingAddress,
      paymentMethod: order.paymentMethod,
      shippingFee: Number(order.shippingFee || 0),
      note: order.note,
      items: (order.items ?? []).map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.price || 0),
        productName: item.productName,
        productSku: item.productSku,
        productImage: item.productImage,
      })),
    }));
  }, [ordersData]);

  const repairs = useMemo<RepairRequest[]>(() => {
    const source = Array.isArray(repairsData) ? repairsData : repairsData?.requests ?? [];
    return source.map((repair: any) => {
      const status = normalizeRepairStatus(repair.status);
      const timeline = repair.timeline ?? [];
      return {
        id: repair.id,
        code: repair.ticketNumber,
        deviceName: [repair.deviceBrand, repair.deviceModel].filter(Boolean).join(" ") || repair.product?.name || "Thiết bị",
        issueDescription: repair.faultDescription,
        receivedAt: repair.createdAt,
        status,
        estimate: repair.estimatedCost ? `Dự kiến: ${formatPrice(Number(repair.estimatedCost))}` : "Đang cập nhật",
        history: timeline.length
          ? timeline.map((entry: any) => ({
              id: entry.id,
              title: labels[normalizeRepairStatus(entry.status)] ?? entry.status,
              time: formatDateTime(entry.createdAt),
              note: entry.note,
            }))
          : [{ id: repair.id, title: labels[status], time: formatDateTime(repair.updatedAt ?? repair.createdAt) }],
      };
    });
  }, [repairsData]);

  const wishlist = useMemo(() => (data?.wishlist ?? []).map((id) => allProducts.find((p) => p.id === id)).filter(Boolean), [allProducts, data]);
  const recent = useMemo(() => (data?.recentlyViewed ?? []).map((id) => allProducts.find((p) => p.id === id)).filter(Boolean), [allProducts, data]);

  if (!user || !data) return null;

  const persist = (next: AccountData) => {
    setData(next);
    saveAccountData(user.id, next);
  };

  const logout = () => {
    logoutAuth();
    toast({ title: "Đã đăng xuất", description: "Hẹn gặp lại bạn tại Lộc An." });
    navigate("/dang-nhap", { replace: true });
  };

  const saveProfile = async () => {
    try {
      await updateProfile({ name: profile.fullName, phone: profile.phone, avatar: profile.avatar });
      setUser((current) => current ? { ...current, fullName: profile.fullName, phone: profile.phone, avatar: profile.avatar } : current);
      toast({ title: "Đã lưu thông tin", description: "Hồ sơ của bạn đã được cập nhật." });
    } catch (err: any) {
      toast({ title: "Cập nhật thất bại", description: err?.response?.data?.error || "Vui lòng thử lại.", variant: "destructive" });
    }
  };

  const uploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfile((p) => ({ ...p, avatar: String(reader.result ?? "") }));
    reader.readAsDataURL(file);
  };

  const savePassword = async () => {
    if (password.newPassword.length < 6) {
      return toast({ title: "Mật khẩu mới quá ngắn", description: "Vui lòng nhập tối thiểu 6 ký tự.", variant: "destructive" });
    }
    if (password.newPassword !== password.confirmPassword) {
      return toast({ title: "Xác nhận mật khẩu chưa khớp", description: "Vui lòng kiểm tra lại.", variant: "destructive" });
    }
    try {
      await changePassword(password.currentPassword, password.newPassword);
      setPassword({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast({ title: "Đổi mật khẩu thành công", description: "Thông tin bảo mật đã được cập nhật." });
    } catch (err: any) {
      toast({ title: "Không đổi được mật khẩu", description: err?.response?.data?.error || "Vui lòng thử lại.", variant: "destructive" });
    }
  };

  const saveAddress = () => {
    if (!editingAddress) return;
    const id = editingAddress.id || `addr-${Date.now()}`;
    let next = editingAddress.id
      ? data.addresses.map((a) => (a.id === id ? { ...editingAddress, id } : a))
      : [...data.addresses, { ...editingAddress, id }];
    if (editingAddress.isDefault) next = next.map((a) => ({ ...a, isDefault: a.id === id }));
    if (!next.some((a) => a.isDefault) && next.length) next = next.map((a, i) => ({ ...a, isDefault: i === 0 }));
    persist({ ...data, addresses: next });
    setAddressOpen(false);
    setEditingAddress(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="section-container py-6 md:py-8">
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-primary via-primary to-orange-500 p-6 text-white shadow-lg">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-4 border-white/25">
                <AvatarImage src={profile.avatar} alt={user.fullName} />
                <AvatarFallback className="bg-white/15 text-lg font-bold text-white">{user.fullName.slice(0, 1).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-white/75">Tài khoản</p>
                <h1 className="text-2xl font-bold">{user.fullName}</h1>
                <p className="text-sm text-white/80">{user.email} • {user.phone}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <div className="rounded-2xl bg-white/12 px-4 py-3"><p className="text-xs text-white/70">Đơn hàng</p><p className="mt-1 text-xl font-semibold">{orders.length}</p></div>
              <div className="rounded-2xl bg-white/12 px-4 py-3"><p className="text-xs text-white/70">Sửa chữa</p><p className="mt-1 text-xl font-semibold">{repairs.length}</p></div>
              <div className="rounded-2xl bg-white/12 px-4 py-3"><p className="text-xs text-white/70">Yêu thích</p><p className="mt-1 text-xl font-semibold">{data.wishlist.length}</p></div>
              <div className="rounded-2xl bg-white/12 px-4 py-3"><p className="text-xs text-white/70">Địa chỉ</p><p className="mt-1 text-sm font-semibold line-clamp-2">{data.addresses.find((a) => a.isDefault)?.district ?? "Chưa có"}</p></div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <Card className="rounded-3xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle>Tài khoản của tôi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {sections.map((item) => (
                <button key={item.key} type="button" onClick={() => setSection(item.key)} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium ${section === item.key ? "bg-primary text-primary-foreground" : "bg-slate-50 text-slate-700 hover:bg-slate-100"}`}>
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
              <button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-orange-600 hover:bg-orange-50">
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {section === "profile" && (
              <Card className="rounded-3xl border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Thông tin tài khoản</CardTitle>
                  <CardDescription>Họ Tên, Số Điện thoại, Email.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col gap-4 rounded-3xl bg-slate-50 p-4 md:flex-row md:items-center">
                    <Avatar className="h-20 w-20 border border-slate-200">
                      <AvatarImage src={profile.avatar} alt={profile.fullName} />
                      <AvatarFallback>{profile.fullName.slice(0, 1).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
                      <Camera className="h-4 w-4" />
                      Tải ảnh đại diện
                      <input type="file" accept="image/*" className="hidden" onChange={uploadAvatar} />
                    </label>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input value={profile.fullName} onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))} placeholder="Họ và tên" />
                    <Input value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} placeholder="Số điện thoại" />
                    <div className="md:col-span-2">
                      <Input value={profile.email} disabled placeholder="Email" />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button className="rounded-xl bg-orange-500 hover:bg-orange-600" onClick={saveProfile}>
                      <PenSquare className="mr-2 h-4 w-4" />
                      Lưu thông tin
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {section === "orders" && (
              <Card className="rounded-3xl border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Đơn hàng của tôi</CardTitle>
                  <CardDescription>Danh sách đơn hàng, trạng thái.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {ordersLoading && <p className="text-sm text-slate-500">Đang tải đơn hàng...</p>}
                  {!ordersLoading && orders.length === 0 && <p className="text-sm text-slate-500">Bạn chưa có đơn hàng nào.</p>}
                  {orders.map((order) => {
                    const total = order.items.reduce((s, i) => s + i.price * i.quantity, 0) + order.shippingFee;
                    return (
                      <div key={order.id} className="rounded-3xl border border-slate-200 p-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900">#{order.code}</span>
                              <Badge className={orderStatusMap[order.status]}>{labels[order.status]}</Badge>
                            </div>
                            <p className="mt-2 text-sm text-slate-500">{formatDateTime(order.createdAt)}</p>
                            <p className="text-sm text-slate-600 line-clamp-1">{order.address}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-slate-500">Tổng tiền</p>
                            <p className="text-xl font-bold text-orange-600">{formatPrice(total)}</p>
                            <Button variant="outline" className="mt-3 rounded-xl" onClick={() => setOrderDetail(order)}>
                              <PackageSearch className="mr-2 h-4 w-4" />
                              Xem chi tiết
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}

            {section === "repairs" && (
              <Card className="rounded-3xl border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Dịch vụ sửa chữa</CardTitle>
                  <CardDescription>Danh sách yêu cầu sửa chữa, lịch sử.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {repairsLoading && <p className="text-sm text-slate-500">Đang tải yêu cầu sửa chữa...</p>}
                  {!repairsLoading && repairs.length === 0 && <p className="text-sm text-slate-500">Bạn chưa có yêu cầu sửa chữa nào.</p>}
                  {repairs.map((repair) => (
                    <div key={repair.id} className="rounded-3xl border border-slate-200 p-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">{repair.deviceName}</span>
                            <Badge className={repairStatusMap[repair.status]}>{labels[repair.status]}</Badge>
                          </div>
                          <p className="mt-2 text-sm text-slate-500">{repair.code} • {formatDate(repair.receivedAt)}</p>
                          <p className="text-sm text-slate-700">{repair.issueDescription}</p>
                          <p className="text-sm font-medium text-orange-600">{repair.estimate}</p>
                        </div>
                        <Button variant="outline" className="rounded-xl" onClick={() => setRepairDetail(repair)}>
                          <History className="mr-2 h-4 w-4" />
                          Xem lịch sử
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {section === "addresses" && (
              <Card className="rounded-3xl border-slate-200 shadow-sm">
                <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle>Địa chỉ</CardTitle>
                    {/* <CardDescription>Địa chỉ của bạn.</CardDescription> */}
                  </div>
                  <Button className="rounded-xl bg-orange-500 hover:bg-orange-600" onClick={() => { setEditingAddress(emptyAddress(user)); setAddressOpen(true); }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Thêm địa chỉ
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {data.addresses.map((address) => (
                    <div key={address.id} className="rounded-3xl border border-slate-200 p-4">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">{address.fullName}</span>
                            <span className="text-sm text-slate-500">{address.phone}</span>
                            {address.isDefault && <Badge className="bg-blue-100 text-blue-700 border-blue-200">Mặc định</Badge>}
                          </div>
                          <p className="mt-2 text-sm text-slate-700">{buildAddressText(address)}</p>
                          {address.note && <p className="text-sm text-slate-500">{address.note}</p>}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {!address.isDefault && <Button variant="outline" className="rounded-xl" onClick={() => persist({ ...data, addresses: data.addresses.map((a) => ({ ...a, isDefault: a.id === address.id })) })}>Đặt mặc định</Button>}
                          <Button variant="outline" className="rounded-xl" onClick={() => { setEditingAddress({ ...address }); setAddressOpen(true); }}>Sửa</Button>
                          <Button variant="outline" className="rounded-xl text-red-600" onClick={() => { let next = data.addresses.filter((a) => a.id !== address.id); if (next.length && !next.some((a) => a.isDefault)) next = next.map((a, i) => ({ ...a, isDefault: i === 0 })); persist({ ...data, addresses: next }); }}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Xóa
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {section === "wishlist" && (
              <Card className="rounded-3xl border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Danh sách yêu thích</CardTitle>
                  {/* <CardDescription>Hiển thị sản phẩm đã lưu và cho phép thêm nhanh vào giỏ hàng.</CardDescription> */}
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Danh sách yêu thích</h3>
                    <Badge className="bg-orange-100 text-orange-700 border-orange-200">{wishlist.length} sản phẩm</Badge>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {wishlist.map((product) => product && (
                      <div key={product.id} className="rounded-3xl border border-slate-200 p-4">
                        <Link to={`/san-pham/${product.slug}`} className="block">
                          <img src={product.image} alt={product.name} className="mx-auto h-36 w-full object-contain" />
                          <h4 className="mt-4 line-clamp-2 min-h-[48px] font-semibold text-slate-900">{product.name}</h4>
                          <p className="mt-2 text-lg font-bold text-orange-600">{formatPrice(product.price)}</p>
                        </Link>
                        <div className="mt-4 flex gap-2">
                          <Button
                            className="flex-1 rounded-xl bg-primary hover:bg-primary/90"
                            onClick={() => {
                              addItem(product);
                              toast({
                                title: "Đã thêm vào giỏ hàng",
                                description: product.name,
                              });
                            }}
                          >
                            Thêm vào giỏ
                          </Button>
                          <Button variant="outline" className="rounded-xl" onClick={() => persist({ ...data, wishlist: data.wishlist.filter((id) => id !== product.id) })}>Xóa</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {section === "recentlyViewed" && (
              <Card className="rounded-3xl border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Đã xem gần đây</CardTitle>
                  {/* <CardDescription>Hiển thị các sản phẩm bạn vừa xem gần đây, giữ nguyên cách trình bày cũ.</CardDescription> */}
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900">Đã xem gần đây</h3>
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">{recent.length} sản phẩm</Badge>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {recent.map((product) => product && <ProductCard key={product.id} product={product} />)}
                  </div>
                </CardContent>
              </Card>
            )}

            {section === "security" && (
              <Card className="rounded-3xl border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>Bảo mật</CardTitle>
                  <CardDescription>Đổi mật khẩu và đăng xuất.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-4 rounded-3xl border border-slate-200 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-blue-100 p-3 text-blue-700"><LockKeyhole className="h-5 w-5" /></div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Đổi mật khẩu</h3>
                        <p className="text-sm text-slate-500">Bảo vệ tài khoản của bạn.</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Input type="password" placeholder="Mật khẩu hiện tại" value={password.currentPassword} onChange={(e) => setPassword((p) => ({ ...p, currentPassword: e.target.value }))} />
                      <Input type="password" placeholder="Mật khẩu mới" value={password.newPassword} onChange={(e) => setPassword((p) => ({ ...p, newPassword: e.target.value }))} />
                      <Input type="password" placeholder="Xác nhận mật khẩu mới" value={password.confirmPassword} onChange={(e) => setPassword((p) => ({ ...p, confirmPassword: e.target.value }))} />
                    </div>
                    <div className="flex justify-end">
                      <Button className="rounded-xl bg-orange-500 hover:bg-orange-600" onClick={savePassword}>Lưu mật khẩu</Button>
                    </div>
                  </div>
                  <div className="space-y-4 rounded-3xl border border-orange-200 bg-orange-50 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-orange-500 p-3 text-white"><LogOut className="h-5 w-5" /></div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Đăng xuất</h3>
                        <p className="text-sm text-slate-600">Đăng xuất an toàn khi dùng máy công cộng.</p>
                      </div>
                    </div>
                    <Button className="w-full rounded-xl bg-slate-900 hover:bg-slate-800" onClick={logout}>Đăng xuất ngay</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Dialog open={Boolean(orderDetail)} onOpenChange={() => setOrderDetail(null)}>
        <DialogContent className="max-w-3xl rounded-3xl">
          {orderDetail && (
            <>
              <DialogHeader>
                <DialogTitle>Chi tiết đơn hàng #{orderDetail.code}</DialogTitle>
                <DialogDescription>Hiển thị sản phẩm, giá, tổng tiền và địa chỉ giao hàng.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {orderDetail.items.map((item) => {
                  const product = allProducts.find((p) => p.id === item.productId);
                  const name = product?.name ?? item.productName ?? item.productSku ?? item.productId;
                  const image = product?.image ?? item.productImage;
                  return (
                    <div key={`${orderDetail.id}-${item.productId}`} className="flex items-center gap-4 rounded-2xl border border-slate-200 p-3">
                      {image && <img src={image} alt={name} className="h-20 w-20 rounded-2xl bg-slate-50 object-contain p-2" />}
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 font-semibold text-slate-900">{name}</p>
                        <p className="text-sm text-slate-500">Số lượng: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-orange-600">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  );
                })}
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Địa chỉ</p>
                  <p className="mt-1 text-slate-800">{orderDetail.address}</p>
                  <p className="mt-3 font-bold text-orange-600">Tổng tiền: {formatPrice(orderDetail.items.reduce((s, i) => s + i.price * i.quantity, 0) + orderDetail.shippingFee)}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(repairDetail)} onOpenChange={() => setRepairDetail(null)}>
        <DialogContent className="max-w-2xl rounded-3xl">
          {repairDetail && (
            <>
              <DialogHeader>
                <DialogTitle>Lịch sử sửa chữa #{repairDetail.code}</DialogTitle>
                <DialogDescription>{repairDetail.deviceName}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {repairDetail.history.map((entry, index) => (
                  <div key={entry.id} className="flex gap-4 rounded-2xl border border-slate-200 p-4">
                    <div className="rounded-full bg-primary p-2 text-primary-foreground">
                      {index === repairDetail.history.length - 1 ? <CheckCircle2 className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{entry.title}</p>
                      <p className="text-sm text-slate-500">{entry.time}</p>
                      {entry.note && <p className="mt-2 text-sm text-slate-700">{entry.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={addressOpen} onOpenChange={setAddressOpen}>
        <DialogContent className="max-w-xl rounded-3xl">
          <DialogHeader>
            <DialogTitle>{editingAddress?.id ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}</DialogTitle>
            <DialogDescription>Thêm / Sửa / Xóa địa chỉ và chọn địa chỉ mặc định.</DialogDescription>
          </DialogHeader>
          {editingAddress && (
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Họ và tên" value={editingAddress.fullName} onChange={(e) => setEditingAddress({ ...editingAddress, fullName: e.target.value })} />
              <Input placeholder="Số điện thoại" value={editingAddress.phone} onChange={(e) => setEditingAddress({ ...editingAddress, phone: e.target.value })} />
              <div className="md:col-span-2"><Input placeholder="Số nhà, tên đường" value={editingAddress.line1} onChange={(e) => setEditingAddress({ ...editingAddress, line1: e.target.value })} /></div>
              <Input placeholder="Phường / Xã" value={editingAddress.ward} onChange={(e) => setEditingAddress({ ...editingAddress, ward: e.target.value })} />
              <Input placeholder="Quận / Huyện" value={editingAddress.district} onChange={(e) => setEditingAddress({ ...editingAddress, district: e.target.value })} />
              <div className="md:col-span-2"><Input placeholder="Tỉnh / Thành phố" value={editingAddress.city} onChange={(e) => setEditingAddress({ ...editingAddress, city: e.target.value })} /></div>
              <div className="md:col-span-2"><Textarea placeholder="Ghi chú cho người giao hàng" value={editingAddress.note ?? ""} onChange={(e) => setEditingAddress({ ...editingAddress, note: e.target.value })} /></div>
              <label className="flex items-center gap-2 text-sm text-slate-600 md:col-span-2">
                <input type="checkbox" checked={editingAddress.isDefault} onChange={(e) => setEditingAddress({ ...editingAddress, isDefault: e.target.checked })} />
                Đặt làm địa chỉ mặc định
              </label>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddressOpen(false)}>Hủy</Button>
            <Button className="bg-orange-500 hover:bg-orange-600" onClick={saveAddress}>Lưu địa chỉ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
      <FloatingActions />
    </div>
  );
}
