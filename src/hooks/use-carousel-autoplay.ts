import { useCallback, useEffect, useRef, useState } from "react";
import { type CarouselApi } from "@/components/ui/carousel";

interface UseCarouselAutoplayOptions {
  itemCount: number;
  delayMs?: number;
  resumeAfterInteractionMs?: number;
  enabled?: boolean;
}

export function useCarouselAutoplay({
  itemCount,
  delayMs = 5200,
  resumeAfterInteractionMs = 12000,
  enabled = true,
}: UseCarouselAutoplayOptions) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [api, setApiState] = useState<CarouselApi>();
  const [isHovering, setIsHovering] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [interactionPauseUntil, setInteractionPauseUntil] = useState(0);

  const setApi = useCallback((carouselApi: CarouselApi) => {
    setApiState(carouselApi);
  }, []);

  const pauseAfterInteraction = useCallback(() => {
    setInteractionPauseUntil(Date.now() + resumeAfterInteractionMs);
  }, [resumeAfterInteractionMs]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled || itemCount <= 1) return;

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting && entry.intersectionRatio >= 0.45);
      },
      { threshold: [0, 0.45, 0.8] },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [enabled, itemCount]);

  useEffect(() => {
    if (!api || !enabled || itemCount <= 1 || !isInView) return;

    const timer = window.setInterval(() => {
      if (document.hidden) return;

      const isTemporarilyPaused = interactionPauseUntil > Date.now();
      if (isHovering || isFocused || isInteracting || isTemporarilyPaused) return;

      api.scrollNext();
    }, delayMs);

    return () => window.clearInterval(timer);
  }, [
    api,
    delayMs,
    enabled,
    interactionPauseUntil,
    isFocused,
    isHovering,
    isInteracting,
    isInView,
    itemCount,
  ]);

  return {
    rootRef,
    setApi,
    autoplayProps: {
      onMouseEnter: () => setIsHovering(true),
      onMouseLeave: () => setIsHovering(false),
      onFocusCapture: () => setIsFocused(true),
      onBlurCapture: () => setIsFocused(false),
      onPointerDownCapture: () => {
        setIsInteracting(true);
        pauseAfterInteraction();
      },
      onPointerUpCapture: () => {
        setIsInteracting(false);
        pauseAfterInteraction();
      },
      onPointerCancelCapture: () => {
        setIsInteracting(false);
        pauseAfterInteraction();
      },
    },
  };
}
