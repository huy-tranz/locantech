import CategoryPage from "@/components/CategoryPage";
import { getAllProductsByCategory } from "@/data/products";

export default function PCGamingPage() {
  return (
    <CategoryPage
      categoryId="pc-gaming"
      title="PC Gaming"
      description="PC Gaming phổ thông, tầm trung, cao cấp – build theo yêu cầu, bảo hành 36 tháng tại Lộc An"
      products={getAllProductsByCategory("pc-gaming")}
    />
  );
}
