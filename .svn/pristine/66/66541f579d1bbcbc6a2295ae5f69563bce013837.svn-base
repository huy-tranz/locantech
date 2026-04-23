import { type Product } from "@/data/products";

export interface CartItem {
  product: Product;
  quantity: number;
}

const CART_KEY = "locan_cart";

function loadFromStorage(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: CartItem[]) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

let _items: CartItem[] = loadFromStorage();
let _listeners: (() => void)[] = [];

function notify() {
  _listeners.forEach((l) => l());
}

export const cartStore = {
  getItems: () => _items,
  subscribe: (listener: () => void) => {
    _listeners.push(listener);
    return () => {
      _listeners = _listeners.filter((l) => l !== listener);
    };
  },
  addItem: (product: Product, qty = 1) => {
    const existing = _items.find((i) => i.product.id === product.id);
    if (existing) {
      _items = _items.map((i) =>
        i.product.id === product.id
          ? { ...i, quantity: i.quantity + qty }
          : i
      );
    } else {
      _items = [..._items, { product, quantity: qty }];
    }
    saveToStorage(_items);
    notify();
  },
  removeItem: (productId: string) => {
    _items = _items.filter((i) => i.product.id !== productId);
    saveToStorage(_items);
    notify();
  },
  updateQuantity: (productId: string, qty: number) => {
    if (qty <= 0) {
      _items = _items.filter((i) => i.product.id !== productId);
    } else {
      _items = _items.map((i) =>
        i.product.id === productId ? { ...i, quantity: qty } : i
      );
    }
    saveToStorage(_items);
    notify();
  },
  clearCart: () => {
    _items = [];
    saveToStorage(_items);
    notify();
  },
  totalItems: () => _items.reduce((sum, i) => sum + i.quantity, 0),
  totalPrice: () =>
    _items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
};
