const CART_ICON_SELECTOR = "[data-cart-icon]";
const FLY_DURATION_MS = 750;

export function bumpCartIcon() {
  window.dispatchEvent(new CustomEvent("cart:bump"));
}

export function flyToCart(sourceEl: HTMLElement | null, imageUrl: string) {
  if (!sourceEl || typeof document === "undefined") {
    bumpCartIcon();
    return;
  }

  const targetEl = document.querySelector<HTMLElement>(CART_ICON_SELECTOR);
  if (!targetEl) {
    bumpCartIcon();
    return;
  }

  const sourceRect = sourceEl.getBoundingClientRect();
  const targetRect = targetEl.getBoundingClientRect();

  const size = Math.max(48, Math.min(110, sourceRect.width * 0.45));
  const startX = sourceRect.left + sourceRect.width / 2 - size / 2;
  const startY = sourceRect.top + sourceRect.height / 2 - size / 2;
  const endX = targetRect.left + targetRect.width / 2 - size / 2;
  const endY = targetRect.top + targetRect.height / 2 - size / 2;

  const dx = endX - startX;
  const dy = endY - startY;

  const clone = document.createElement("div");
  clone.style.position = "fixed";
  clone.style.left = `${startX}px`;
  clone.style.top = `${startY}px`;
  clone.style.width = `${size}px`;
  clone.style.height = `${size}px`;
  clone.style.borderRadius = "16px";
  clone.style.background = `#ffffff url(${imageUrl}) center/contain no-repeat`;
  clone.style.boxShadow = "0 18px 38px rgba(15, 23, 42, 0.28)";
  clone.style.border = "2px solid rgba(248, 113, 113, 0.55)";
  clone.style.zIndex = "9999";
  clone.style.pointerEvents = "none";
  clone.style.willChange = "transform, opacity";

  document.body.appendChild(clone);

  const arcOffsetY = -Math.max(80, Math.min(180, Math.abs(dx) * 0.25 + 60));

  const animation = clone.animate(
    [
      { transform: "translate(0, 0) scale(1) rotate(0deg)", opacity: 1, offset: 0 },
      {
        transform: `translate(${dx * 0.55}px, ${dy * 0.25 + arcOffsetY}px) scale(0.65) rotate(15deg)`,
        opacity: 0.95,
        offset: 0.55,
      },
      {
        transform: `translate(${dx}px, ${dy}px) scale(0.18) rotate(35deg)`,
        opacity: 0.15,
        offset: 1,
      },
    ],
    { duration: FLY_DURATION_MS, easing: "cubic-bezier(0.5, 0.05, 0.65, 0.45)", fill: "forwards" },
  );

  animation.onfinish = () => {
    clone.remove();
    bumpCartIcon();
  };
  animation.oncancel = () => {
    clone.remove();
  };
}
