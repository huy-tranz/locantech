import { useEffect, useMemo, useState } from "react";
import { Search, Phone, Mail, MapPin, Heart, Clock3, Save } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAdminCustomers } from "@/hooks/queries/user.queries";
import { formatPrice, getAllProducts } from "@/data/products";
import type { AdminUser } from "@/api/user.api";
import type { AccountData, AccountOrder, RepairRequest } from "@/lib/account";
import { getStoredUsers } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

const CUSTOMER_NOTES_STORAGE_KEY = "locan_admin_customer_notes";

type CustomerProfile = AdminUser & {
  source: "api" | "local";
};

function getEmptyAccountData(): AccountData {
  return {
    orders: [],
    repairs: [],
    addresses: [],
    wishlist: [],
    recentlyViewed: [],
  };
}

function getCustomerAccountData(userId: string): AccountData {
  if (typeof window === "undefined") {
    return getEmptyAccountData();
  }

  try {
    const raw = localStorage.getItem(`locan_account_data:${userId}`);
    return raw ? (JSON.parse(raw) as AccountData) : getEmptyAccountData();
  } catch {
    return getEmptyAccountData();
  }
}

function getCustomerNotes(): Record<string, string> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = localStorage.getItem(CUSTOMER_NOTES_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function saveCustomerNotes(notes: Record<string, string>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CUSTOMER_NOTES_STORAGE_KEY, JSON.stringify(notes));
}

function getOrderTotal(order: AccountOrder) {
  return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) + order.shippingFee;
}

function getRepairStatusLabel(status: RepairRequest["status"]) {
  if (status === "received") return "Đã tiếp nhận";
  if (status === "repairing") return "Đang sửa";
  return "Hoàn tất";
}

function getOrderStatusLabel(status: AccountOrder["status"]) {
  if (status === "pending") return "Chờ xử lý";
  if (status === "processing") return "Đang xử lý";
  if (status === "shipping") return "Đang giao";
  return "Hoàn tất";
}

export default function AdminCustomersPage() {
  const { data: apiCustomers = [], isLoading } = useAdminCustomers();
  const [search, setSearch] = useState("");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>(() => getCustomerNotes());
  const allProducts = useMemo(() => getAllProducts(), []);

  const customers = useMemo<CustomerProfile[]>(() => {
    const localCustomers: CustomerProfile[] = getStoredUsers().map((user) => ({
      id: user.id,
      name: user.fullName,
      email: user.email,
      phone: user.phone,
      role: "CUSTOMER",
      status: "ACTIVE",
      createdAt: user.createdAt,
      source: "local",
    }));

    const merged = [...apiCustomers.map((customer) => ({ ...customer, source: "api" as const })), ...localCustomers];
    const deduped = new Map<string, CustomerProfile>();

    merged.forEach((customer) => {
      const key = customer.email.toLowerCase();
      if (!deduped.has(key)) {
        deduped.set(key, customer);
      }
    });

    return Array.from(deduped.values()).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [apiCustomers]);

  const filtered = useMemo(
    () =>
      customers.filter(
        (customer) =>
          customer.name.toLowerCase().includes(search.toLowerCase()) ||
          customer.email.toLowerCase().includes(search.toLowerCase()) ||
          customer.phone?.includes(search),
      ),
    [customers, search],
  );

  useEffect(() => {
    if (!selectedCustomerId && filtered.length > 0) {
      setSelectedCustomerId(filtered[0].id);
      return;
    }

    if (selectedCustomerId && !filtered.some((customer) => customer.id === selectedCustomerId)) {
      setSelectedCustomerId(filtered[0]?.id ?? "");
    }
  }, [filtered, selectedCustomerId]);

  const selectedCustomer = filtered.find((customer) => customer.id === selectedCustomerId) ?? customers.find((customer) => customer.id === selectedCustomerId) ?? null;
  const selectedAccountData = selectedCustomer ? getCustomerAccountData(selectedCustomer.id) : getEmptyAccountData();

  const selectedWishlistProducts = selectedAccountData.wishlist
    .map((id) => allProducts.find((product) => product.id === id))
    .filter(Boolean);

  const selectedRecentlyViewedProducts = selectedAccountData.recentlyViewed
    .map((id) => allProducts.find((product) => product.id === id))
    .filter(Boolean);

  const customerStats = useMemo(() => {
    return customers.map((customer) => {
      const accountData = getCustomerAccountData(customer.id);
      const totalSpent = accountData.orders.reduce((sum, order) => sum + getOrderTotal(order), 0);

      return {
        customer,
        totalSpent,
        ordersCount: accountData.orders.length,
        repairsCount: accountData.repairs.length,
      };
    });
  }, [customers]);

  const selectedStats = selectedCustomer
    ? customerStats.find((item) => item.customer.id === selectedCustomer.id)
    : undefined;

  const handleSaveNote = () => {
    saveCustomerNotes(notes);
    toast({ title: "Đã lưu ghi chú nội bộ" });
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Đang tải dữ liệu khách hàng...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Khách hàng</h1>
        <p className="text-sm text-muted-foreground">
          Theo dõi danh sách khách, lịch sử mua hàng, sửa chữa, địa chỉ, wishlist và ghi chú nội bộ ngay trong một màn quản trị.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Tổng khách hàng</p>
            <p className="mt-2 text-2xl font-bold text-foreground">{customers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Khách có đơn hàng</p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {customerStats.filter((item) => item.ordersCount > 0).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Khách có yêu cầu sửa chữa</p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {customerStats.filter((item) => item.repairsCount > 0).length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên, SĐT, email..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Danh sách khách hàng</CardTitle>
              <CardDescription>Chọn một khách hàng để xem hồ sơ chi tiết ở cột bên phải.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Liên hệ</TableHead>
                    <TableHead>Đơn hàng</TableHead>
                    <TableHead className="text-right">Chi tiêu</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((customer) => {
                    const stat = customerStats.find((item) => item.customer.id === customer.id);
                    const active = customer.id === selectedCustomerId;

                    return (
                      <TableRow
                        key={customer.id}
                        className={`cursor-pointer ${active ? "bg-primary/5" : ""}`}
                        onClick={() => setSelectedCustomerId(customer.id)}
                      >
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">{customer.name}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{new Date(customer.createdAt).toLocaleDateString("vi-VN")}</span>
                              <span>•</span>
                              <Badge variant="outline">{customer.source === "api" ? "API" : "Local"}</Badge>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1 text-sm">
                            <p>{customer.phone || "—"}</p>
                            <p className="text-muted-foreground">{customer.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{stat?.ordersCount ?? 0}</TableCell>
                        <TableCell className="text-right font-medium">{formatPrice(stat?.totalSpent ?? 0)}</TableCell>
                      </TableRow>
                    );
                  })}

                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-8 text-center text-muted-foreground">
                        {customers.length === 0 ? "Chưa có khách hàng nào." : "Không tìm thấy khách hàng phù hợp."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card className="xl:sticky xl:top-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Hồ sơ khách hàng</CardTitle>
            <CardDescription>
              {selectedCustomer ? "Chi tiết lịch sử tương tác và thông tin lưu trữ của khách hàng." : "Chọn một khách hàng để xem chi tiết."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!selectedCustomer ? (
              <div className="rounded-lg border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
                Chưa có khách hàng nào được chọn.
              </div>
            ) : (
              <Tabs defaultValue="overview" className="space-y-4">
                <div className="rounded-2xl border bg-muted/30 p-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">{selectedCustomer.name}</h2>
                      <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{selectedCustomer.phone || "Chưa có số điện thoại"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span>{selectedCustomer.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock3 className="h-4 w-4" />
                          <span>Đăng ký: {new Date(selectedCustomer.createdAt).toLocaleString("vi-VN")}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {selectedCustomer.phone ? (
                        <Button variant="outline" size="sm" asChild>
                          <a href={`tel:${selectedCustomer.phone}`}>
                            <Phone className="mr-2 h-4 w-4" />
                            Gọi ngay
                          </a>
                        </Button>
                      ) : null}
                      <Button variant="outline" size="sm" asChild>
                        <a href={`mailto:${selectedCustomer.email}`}>
                          <Mail className="mr-2 h-4 w-4" />
                          Gửi mail
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 md:grid-cols-4">
                    <div className="rounded-xl bg-background p-3">
                      <p className="text-xs text-muted-foreground">Tổng chi tiêu</p>
                      <p className="mt-1 font-semibold text-foreground">{formatPrice(selectedStats?.totalSpent ?? 0)}</p>
                    </div>
                    <div className="rounded-xl bg-background p-3">
                      <p className="text-xs text-muted-foreground">Đơn hàng</p>
                      <p className="mt-1 font-semibold text-foreground">{selectedAccountData.orders.length}</p>
                    </div>
                    <div className="rounded-xl bg-background p-3">
                      <p className="text-xs text-muted-foreground">Sửa chữa</p>
                      <p className="mt-1 font-semibold text-foreground">{selectedAccountData.repairs.length}</p>
                    </div>
                    <div className="rounded-xl bg-background p-3">
                      <p className="text-xs text-muted-foreground">Wishlist</p>
                      <p className="mt-1 font-semibold text-foreground">{selectedWishlistProducts.length}</p>
                    </div>
                  </div>
                </div>

                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                  <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
                  <TabsTrigger value="repairs">Sửa chữa</TabsTrigger>
                  <TabsTrigger value="addresses">Địa chỉ</TabsTrigger>
                  <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Ghi chú nội bộ</CardTitle>
                      <CardDescription>Phần này chỉ dành cho quản trị viên, không hiển thị ra tài khoản khách.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Textarea
                        placeholder="Thêm ghi chú về thói quen mua hàng, nhu cầu nâng cấp, lịch hẹn gọi lại..."
                        value={notes[selectedCustomer.id] ?? ""}
                        onChange={(event) =>
                          setNotes((current) => ({
                            ...current,
                            [selectedCustomer.id]: event.target.value,
                          }))
                        }
                      />
                      <Button onClick={handleSaveNote}>
                        <Save className="mr-2 h-4 w-4" />
                        Lưu ghi chú
                      </Button>
                    </CardContent>
                  </Card>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Địa chỉ mặc định</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {selectedAccountData.addresses.find((address) => address.isDefault) ? (
                          <div className="space-y-2 text-sm">
                            {(() => {
                              const address = selectedAccountData.addresses.find((item) => item.isDefault)!;
                              return (
                                <>
                                  <p className="font-medium text-foreground">{address.fullName}</p>
                                  <p className="text-muted-foreground">{address.phone}</p>
                                  <p className="flex items-start gap-2 text-muted-foreground">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                                    <span>{`${address.line1}, ${address.ward}, ${address.district}, ${address.city}`}</span>
                                  </p>
                                  {address.note ? <p className="text-muted-foreground">Ghi chú: {address.note}</p> : null}
                                </>
                              );
                            })()}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">Khách hàng chưa lưu địa chỉ mặc định.</p>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Sản phẩm xem gần đây</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {selectedRecentlyViewedProducts.length > 0 ? (
                          selectedRecentlyViewedProducts.slice(0, 5).map((product) => (
                            <div key={product.id} className="flex items-center justify-between text-sm">
                              <span className="line-clamp-1 pr-3 text-foreground">{product.name}</span>
                              <span className="text-muted-foreground">{formatPrice(product.price)}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">Chưa có dữ liệu sản phẩm xem gần đây.</p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="orders">
                  <Card>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Mã đơn</TableHead>
                            <TableHead>Ngày tạo</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead>Sản phẩm</TableHead>
                            <TableHead className="text-right">Tổng tiền</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedAccountData.orders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">{order.code}</TableCell>
                              <TableCell>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{getOrderStatusLabel(order.status)}</Badge>
                              </TableCell>
                              <TableCell>{order.items.reduce((sum, item) => sum + item.quantity, 0)} món</TableCell>
                              <TableCell className="text-right">{formatPrice(getOrderTotal(order))}</TableCell>
                            </TableRow>
                          ))}

                          {selectedAccountData.orders.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                                Chưa có lịch sử đơn hàng.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="repairs">
                  <div className="space-y-3">
                    {selectedAccountData.repairs.length > 0 ? (
                      selectedAccountData.repairs.map((repair) => (
                        <Card key={repair.id}>
                          <CardContent className="space-y-3 p-4">
                            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                              <div>
                                <p className="font-medium text-foreground">{repair.deviceName}</p>
                                <p className="text-sm text-muted-foreground">{repair.code}</p>
                              </div>
                              <Badge variant="outline">{getRepairStatusLabel(repair.status)}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{repair.issueDescription}</p>
                            <div className="grid gap-3 text-sm md:grid-cols-2">
                              <div>
                                <span className="text-muted-foreground">Tiếp nhận:</span>{" "}
                                <span className="font-medium text-foreground">
                                  {new Date(repair.receivedAt).toLocaleDateString("vi-VN")}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Dự kiến:</span>{" "}
                                <span className="font-medium text-foreground">{repair.estimate}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Card>
                        <CardContent className="py-8 text-center text-sm text-muted-foreground">
                          Chưa có lịch sử sửa chữa.
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="addresses">
                  <div className="space-y-3">
                    {selectedAccountData.addresses.length > 0 ? (
                      selectedAccountData.addresses.map((address) => (
                        <Card key={address.id}>
                          <CardContent className="space-y-2 p-4 text-sm">
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-medium text-foreground">{address.fullName}</p>
                              {address.isDefault ? <Badge>Địa chỉ mặc định</Badge> : null}
                            </div>
                            <p className="text-muted-foreground">{address.phone}</p>
                            <p className="text-muted-foreground">{`${address.line1}, ${address.ward}, ${address.district}, ${address.city}`}</p>
                            {address.note ? <p className="text-muted-foreground">Ghi chú: {address.note}</p> : null}
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Card>
                        <CardContent className="py-8 text-center text-sm text-muted-foreground">
                          Khách hàng chưa lưu địa chỉ nào.
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="wishlist">
                  <div className="grid gap-3 md:grid-cols-2">
                    {selectedWishlistProducts.length > 0 ? (
                      selectedWishlistProducts.map((product) => (
                        <Card key={product.id}>
                          <CardContent className="flex items-center gap-3 p-4">
                            <img src={product.image} alt={product.name} className="h-16 w-16 rounded-md border object-cover" />
                            <div className="min-w-0">
                              <div className="mb-1 flex items-center gap-2">
                                <Heart className="h-4 w-4 text-rose-500" />
                                <p className="line-clamp-2 font-medium text-foreground">{product.name}</p>
                              </div>
                              <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <Card className="md:col-span-2">
                        <CardContent className="py-8 text-center text-sm text-muted-foreground">
                          Wishlist của khách đang trống.
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
