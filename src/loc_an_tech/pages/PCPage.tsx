import CategoryPage from "@/components/CategoryPage";
import { getAllProductsByCategory } from "@/data/products";

export default function PCPage() {
  return (
    <CategoryPage
      categoryId="pc"
      title="PC đồng bộ"
      description="PC văn phòng, học tập và doanh nghiệp lắp sẵn theo nhu cầu, bảo hành rõ ràng tại Lộc An"
      products={getAllProductsByCategory("pc")}
    />
  );
}
