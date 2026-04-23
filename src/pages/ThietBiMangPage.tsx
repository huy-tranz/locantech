import CategoryPage from "@/components/CategoryPage";
import { getAllProductsByCategory } from "@/data/products";

export default function ThietBiMangPage() {
  return (
    <CategoryPage
      categoryId="thiet-bi-mang"
      title="Thiết bị mạng"
      description="Router WiFi, Mesh WiFi, Switch, Access Point cho gia đình và văn phòng tại Lộc An"
      products={getAllProductsByCategory("thiet-bi-mang")}
    />
  );
}
