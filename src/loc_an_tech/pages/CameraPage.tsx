import CategoryPage from "@/components/CategoryPage";
import { getAllProductsByCategory } from "@/data/products";

export default function CameraPage() {
  return (
    <CategoryPage
      categoryId="camera"
      title="Camera giám sát"
      description="Camera trong nhà, ngoài trời, combo camera trọn bộ, đầu ghi – lắp đặt tận nơi bởi Lộc An"
      products={getAllProductsByCategory("camera")}
    />
  );
}
