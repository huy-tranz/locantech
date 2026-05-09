import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
}

export default function SEOHead({
  title = "Lộc An – Máy tính, laptop, sửa chữa và giải pháp công nghệ",
  description = "Lộc An – Cửa hàng máy tính, laptop, linh kiện, thiết bị mạng, camera giám sát và dịch vụ sửa chữa tại Hà Nội. Hotline: 0989386219",
  canonical,
}: SEOHeadProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ComputerStore",
          "name": "Lộc An",
          "description": description,
          "telephone": "0989386219",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "7 La Dương, Dương Nội",
            "addressLocality": "Hà Nội",
            "addressRegion": "Hà Nội",
            "addressCountry": "VN"
          },
          "openingHours": "Mo-Su 08:00-20:00"
        })}
      </script>
    </Helmet>
  );
}
