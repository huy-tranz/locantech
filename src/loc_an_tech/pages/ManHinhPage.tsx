import CategoryPage from "@/components/CategoryPage";
import { getAllProductsByCategory } from "@/data/products";

export default function ManHinhPage() {
  return (
    <CategoryPage
      categoryId="man-hinh"
      title="Màn hình máy tính"
      description="Màn hình văn phòng, màn hình gaming 144Hz 165Hz 180Hz chính hãng giá tốt tại Lộc An"
      products={getAllProductsByCategory("man-hinh")}
    />
  );
}
