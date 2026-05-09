export interface PolicySection {
  heading: string;
  content: string;
}

export interface PolicyItem {
  slug: string;
  title: string;
  lastUpdated: string;
  sections: PolicySection[];
}

const STORAGE_KEY = "admin_policies";

const defaultPolicies: PolicyItem[] = [
  {
    slug: "bao-hanh",
    title: "Chính sách bảo hành",
    lastUpdated: "23/04/2026",
    sections: [
      {
        heading: "Thời gian bảo hành",
        content:
          "Laptop, PC nguyên bộ: 12 tháng tại cửa hàng\nLinh kiện (RAM, SSD, CPU...): 36 tháng chính hãng\nMàn hình: 24 tháng\nPhụ kiện (chuột, bàn phím): 6 tháng",
      },
      {
        heading: "Điều kiện bảo hành",
        content:
          "Còn tem bảo hành, không bị tác động vật lý\nKhông vào nước, không tự ý tháo máy\nXuất trình hóa đơn mua hàng hoặc CMND",
      },
      {
        heading: "Quy trình bảo hành",
        content:
          "Bước 1: Liên hệ hotline 0989.386.219\nBước 2: Mang máy đến 7 La Dương, Dương Nội, Hà Đông\nBước 3: Kỹ thuật viên kiểm tra trong 30 phút\nBước 4: Thông báo thời gian & chi phí (nếu có)",
      },
      {
        heading: "Không áp dụng bảo hành",
        content:
          "Hư hỏng do người dùng (rơi, vỡ, vào nước)\nPhần mềm, virus\nHết hạn bảo hành",
      },
    ],
  },
  {
    slug: "doi-tra",
    title: "Chính sách đổi trả",
    lastUpdated: "23/04/2026",
    sections: [
      {
        heading: "Điều kiện đổi trả trong 7 ngày",
        content:
          "Sản phẩm lỗi do nhà sản xuất\nCòn nguyên hộp, phụ kiện đầy đủ\nChưa qua sửa chữa bên ngoài",
      },
      {
        heading: "Sản phẩm không áp dụng đổi trả",
        content: "Phần mềm đã kích hoạt\nSản phẩm đặt hàng theo yêu cầu riêng",
      },
      {
        heading: "Hình thức hoàn tiền",
        content:
          "Đổi sản phẩm tương đương\nHoàn tiền mặt trong 24h (nếu hết hàng)\nHoàn chuyển khoản trong 2-3 ngày làm việc",
      },
      {
        heading: "Liên hệ đổi trả",
        content: "Hotline: 0989.386.219 (8:00-20:00 T2-CN)",
      },
    ],
  },
  {
    slug: "van-chuyen",
    title: "Chính sách vận chuyển",
    lastUpdated: "23/04/2026",
    sections: [
      {
        heading: "Khu vực giao hàng",
        content:
          "Nội thành Hà Nội: giao trong 2 giờ\nTỉnh thành khác: 2-3 ngày qua GHTK/GHN",
      },
      {
        heading: "Phí vận chuyển",
        content:
          "Đơn từ 2.000.000đ: MIỄN PHÍ nội thành Hà Nội\nĐơn dưới 2.000.000đ: 30.000đ nội thành\nTỉnh thành khác: theo bảng giá GHTK/GHN",
      },
      {
        heading: "Lưu ý khi nhận hàng",
        content:
          "Kiểm tra sản phẩm trước khi ký nhận\nQuay video unbox nếu nghi ngờ hư hỏng\nTừ chối nhận nếu hàng bị móp méo, ướt",
      },
    ],
  },
  {
    slug: "bao-mat",
    title: "Chính sách bảo mật",
    lastUpdated: "23/04/2026",
    sections: [
      {
        heading: "Thông tin thu thập",
        content: "Họ tên, SĐT, địa chỉ khi đặt hàng hoặc đăng ký",
      },
      {
        heading: "Mục đích sử dụng",
        content:
          "Xử lý đơn hàng, liên hệ giao hàng\nGửi thông tin khuyến mãi (có thể hủy bất kỳ lúc nào)",
      },
      {
        heading: "Cam kết bảo mật",
        content:
          "Không bán/chia sẻ thông tin cho bên thứ 3\nDữ liệu được mã hóa và lưu trữ an toàn",
      },
      {
        heading: "Quyền của khách hàng",
        content:
          "Yêu cầu xem, sửa, xóa thông tin cá nhân\nLiên hệ: locan@locan.vn",
      },
    ],
  },
  {
    slug: "huong-dan-mua-hang",
    title: "Hướng dẫn mua hàng",
    lastUpdated: "23/04/2026",
    sections: [
      {
        heading: "Mua hàng online",
        content:
          "Bước 1: Chọn sản phẩm, bấm \"Thêm giỏ hàng\"\nBước 2: Vào Giỏ hàng, kiểm tra đơn\nBước 3: Nhập thông tin giao hàng\nBước 4: Chọn phương thức thanh toán\nBước 5: Xác nhận đặt hàng\nBước 6: Chờ Lộc An xác nhận qua SĐT",
      },
      {
        heading: "Mua hàng trực tiếp",
        content:
          "Đến 7 La Dương, Dương Nội, Hà Đông\nT2-CN: 8:00-20:00",
      },
      {
        heading: "Đặt hàng qua điện thoại",
        content:
          "Gọi 0989.386.219, tư vấn viên hỗ trợ chọn máy và báo giá miễn phí",
      },
    ],
  },
  {
    slug: "huong-dan-thanh-toan",
    title: "Hướng dẫn thanh toán",
    lastUpdated: "23/04/2026",
    sections: [
      {
        heading: "Thanh toán tiền mặt",
        content: "Tại cửa hàng hoặc khi nhận hàng (COD)",
      },
      {
        heading: "Chuyển khoản ngân hàng",
        content:
          "Vietcombank: 1234567890 - Nguyễn Văn Lộc\nMB Bank: 0987654321 - Nguyễn Văn Lộc\nNội dung: [Tên] + [SĐT] + [Mã đơn hàng]",
      },
      {
        heading: "Ví điện tử",
        content: "MoMo / ZaloPay / VNPay - quét QR khi thanh toán",
      },
      {
        heading: "Trả góp 0%",
        content:
          "Áp dụng cho đơn từ 5.000.000đ\nHỗ trợ thẻ tín dụng Visa/Mastercard\nLiên hệ hotline để được hướng dẫn",
      },
    ],
  },
];

function hasWindow() {
  return typeof window !== "undefined";
}

function normalizePolicy(policy: Partial<PolicyItem>): PolicyItem {
  return {
    slug: policy.slug?.trim() || "",
    title: policy.title?.trim() || "",
    lastUpdated: policy.lastUpdated?.trim() || "",
    sections: Array.isArray(policy.sections)
      ? policy.sections.map((section) => ({
          heading: section.heading?.trim() || "",
          content: section.content?.trim() || "",
        }))
      : [],
  };
}

function getStoredPolicies(): PolicyItem[] {
  if (!hasWindow()) return defaultPolicies;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultPolicies;

    const parsed = JSON.parse(stored) as Partial<PolicyItem>[];
    if (!Array.isArray(parsed) || parsed.length === 0) return defaultPolicies;

    return parsed.map(normalizePolicy);
  } catch {
    return defaultPolicies;
  }
}

function persistPolicies(items: PolicyItem[]) {
  if (!hasWindow()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.map(normalizePolicy)));
}

export const policies: PolicyItem[] = getStoredPolicies();

export function getAllPolicies() {
  return getStoredPolicies();
}

export function getPolicyBySlug(slug: string) {
  return getStoredPolicies().find((policy) => policy.slug === slug);
}

export function saveAllPolicies(items: PolicyItem[]) {
  persistPolicies(items);
}
