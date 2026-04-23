import { newsImages } from "./images";

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
}

const defaultNews: NewsArticle[] = [
  { id: "n1", title: "Hướng dẫn chọn laptop văn phòng 2025 phù hợp ngân sách", slug: "huong-dan-chon-laptop-van-phong-2025", excerpt: "Bạn đang tìm laptop văn phòng giá tốt? Lộc An tổng hợp tiêu chí chọn laptop phù hợp với công việc và ngân sách của bạn.", category: "Tư vấn", date: "2025-03-15", image: newsImages.newsLaptopGuide },
  { id: "n2", title: "Build PC Gaming 15 triệu chơi mượt mọi tựa game 2025", slug: "build-pc-gaming-15-trieu", excerpt: "Với 15 triệu, bạn hoàn toàn có thể sở hữu một bộ PC Gaming mạnh mẽ. Xem cấu hình gợi ý từ Lộc An.", category: "Tư vấn", date: "2025-03-10", image: newsImages.newsBuildPc },
  { id: "n3", title: "Khi nào cần vệ sinh máy tính? Dấu hiệu và cách xử lý", slug: "khi-nao-can-ve-sinh-may-tinh", excerpt: "Máy tính chạy chậm, nóng bất thường? Có thể đã đến lúc vệ sinh. Lộc An chia sẻ dấu hiệu cần chú ý.", category: "Kinh nghiệm", date: "2025-03-05", image: newsImages.newsMaintenance },
  { id: "n4", title: "So sánh SSD NVMe và SATA: Nên chọn loại nào?", slug: "so-sanh-ssd-nvme-sata", excerpt: "Tìm hiểu sự khác biệt giữa SSD NVMe và SATA để chọn ổ cứng phù hợp với nhu cầu sử dụng.", category: "Kiến thức", date: "2025-02-28", image: newsImages.newsSsdHdd },
  { id: "n5", title: "Hướng dẫn lắp đặt camera giám sát tại nhà đơn giản", slug: "huong-dan-lap-camera-tai-nha", excerpt: "Lộc An hướng dẫn chi tiết các bước lắp đặt camera giám sát tại nhà, phù hợp cho người mới bắt đầu.", category: "Hướng dẫn", date: "2025-02-20", image: newsImages.newsCameraSetup },
  { id: "n6", title: "Top 5 router WiFi 6 giá tốt nhất cho gia đình năm 2025", slug: "top-5-router-wifi-6-gia-tot", excerpt: "Danh sách 5 router WiFi 6 đáng mua nhất với mức giá hợp lý, phủ sóng tốt cho căn hộ và nhà phố.", category: "Tư vấn", date: "2025-02-15", image: newsImages.newsWifi },
];

const STORAGE_KEY = "admin_news";

function getStoredNews(): NewsArticle[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultNews;
  } catch {
    return defaultNews;
  }
}

export const newsArticles: NewsArticle[] = getStoredNews();

export function getAllNews(): NewsArticle[] {
  return getStoredNews();
}
