import { Phone, MessageCircle } from "lucide-react";

export default function FloatingActions() {
  return (
    <>
      {/* Desktop floating buttons */}
      <div className="hidden lg:flex fixed bottom-4 right-4 z-50 flex-col gap-3">
        <a
          href="https://zalo.me/0989386219"
          target="_blank"
          rel="noopener noreferrer"
          className="h-12 w-12 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          style={{ background: "hsl(210 80% 50%)" }}
          title="Chat Zalo"
        >
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        </a>
        <a
          href="tel:0989386219"
          className="h-12 w-12 rounded-full bg-accent flex items-center justify-center shadow-lg hover:scale-110 transition-transform animate-pulse"
          title="Gọi ngay"
        >
          <Phone className="h-6 w-6 text-accent-foreground" />
        </a>
      </div>
    </>
  );
}
