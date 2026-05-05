import { Link } from "react-router-dom";
import { motion, type Variants } from "framer-motion";
import { type Product } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { ArrowRight } from "lucide-react";

interface ProductBlockProps {
  title: string;
  products: Product[];
  link: string;
  maxItems?: number;
}

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const gridVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function ProductBlock({ title, products, link, maxItems = 5 }: ProductBlockProps) {
  const displayed = products.slice(0, maxItems);

  if (displayed.length === 0) return null;

  return (
    <motion.section
      className="py-6"
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="section-heading">
        <h2 className="section-heading-title">{title}</h2>
        <Link to={link} className="section-link">
          Xem tất cả <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <motion.div
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        variants={gridVariants}
      >
        {displayed.map((product) => (
          <motion.div key={product.id} variants={cardVariants} className="h-full">
            <ProductCard product={product} />
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
