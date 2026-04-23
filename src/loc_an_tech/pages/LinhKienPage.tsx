import CategoryPage from "@/components/CategoryPage";
import { getAllProductsByCategory } from "@/data/products";

export default function LinhKienPage() {
  return (
    <CategoryPage
      categoryId="linh-kien"
      title="Linh kiện máy tính"
      description="CPU, RAM, SSD, VGA, Mainboard, nguồn, case, tản nhiệt chính hãng giá tốt tại Lộc An"
      products={getAllProductsByCategory("linh-kien")}
    />
  );
}
