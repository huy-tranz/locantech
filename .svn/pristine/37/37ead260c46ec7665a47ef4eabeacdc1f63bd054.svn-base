import { useSyncExternalStore } from "react";
import { cartStore } from "@/lib/cart";

export function useCart() {
  const items = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getItems
  );

  return {
    items,
    addItem: cartStore.addItem,
    removeItem: cartStore.removeItem,
    updateQuantity: cartStore.updateQuantity,
    clearCart: cartStore.clearCart,
    totalItems: cartStore.totalItems(),
    totalPrice: cartStore.totalPrice(),
  };
}
