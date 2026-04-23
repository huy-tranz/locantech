import { useState, useEffect, useCallback } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from './useAuth'
import cartApi from '@/api/cart.api'

// ── Types ──────────────────────────────────────────────────────────
export interface CartItem {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    slug: string
    price: number
    images: string[]
    thumbnail?: string
    quantity: number
    status: string
  }
}

export interface CartResponse {
  items: CartItem[]
  subtotal: number
}

const LOCAL_CART_KEY = 'locan_cart'

// ── localStorage cart helpers ───────────────────────────────────────
interface LocalCartItem {
  productId: string
  quantity: number
  addedAt: number
}

export const getLocalCart = (): LocalCartItem[] => {
  try {
    const stored = localStorage.getItem(LOCAL_CART_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const setLocalCart = (items: LocalCartItem[]) => {
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items))
}

// ── useCartDb: DB cart for logged-in users ─────────────────────────
export function useCartDb() {
  return useQuery<CartResponse>({
    queryKey: ['cart'],
    queryFn: () => cartApi.getCart(),
    enabled: false, // Only fetch when explicitly needed
  })
}

// ── useCart: Dual-layer cart ───────────────────────────────────────
export function useCart() {
  const { user, isLoggedIn } = useAuth()
  const queryClient = useQueryClient()
  const [hasMerged, setHasMerged] = useState(false)

  // ── DB cart query ──────────────────────────────────────────────
  const { data: dbCart, isLoading: dbLoading } = useQuery<CartResponse>({
    queryKey: ['cart'],
    queryFn: () => cartApi.getCart(),
    enabled: isLoggedIn && hasMerged,
    staleTime: 30 * 1000,
  })

  // ── localStorage cart ──────────────────────────────────────────
  const [localCart, setLocalCartState] = useState<LocalCartItem[]>([])

  useEffect(() => {
    setLocalCartState(getLocalCart())
  }, [])

  // ── Merge localStorage → DB on login ──────────────────────────
  const mergeMutation = useMutation({
    mutationFn: (items: LocalCartItem[]) => cartApi.mergeCart(items),
    onSuccess: () => {
      setLocalCartState([])
      localStorage.removeItem(LOCAL_CART_KEY)
      queryClient.invalidateQueries({ queryKey: ['cart'] })
      setHasMerged(true)
    },
    onError: () => {
      // On merge error, keep local cart
      setHasMerged(true)
    },
  })

  useEffect(() => {
    if (user && localCart.length > 0 && !hasMerged) {
      mergeMutation.mutate(localCart)
    } else if (user && !hasMerged) {
      // User logged in but no local cart → just mark as merged
      setHasMerged(true)
    }
  }, [user, localCart.length, hasMerged])

  // When user logs out, reset merge state
  useEffect(() => {
    if (!isLoggedIn) {
      setHasMerged(false)
      setLocalCartState(getLocalCart())
    }
  }, [isLoggedIn])

  // ── Add to cart ───────────────────────────────────────────────
  const addMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity?: number }) =>
      cartApi.addItem(productId, quantity),
    onSuccess: () => {
      if (isLoggedIn) {
        queryClient.invalidateQueries({ queryKey: ['cart'] })
      }
    },
  })

  const addToCart = useCallback(
    (productId: string, quantity = 1) => {
      if (isLoggedIn && hasMerged) {
        addMutation.mutate({ productId, quantity })
      } else {
        // Anonymous: add to localStorage
        setLocalCartState((prev) => {
          const existing = prev.find((i) => i.productId === productId)
          const next = existing
            ? prev.map((i) =>
                i.productId === productId
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              )
            : [...prev, { productId, quantity, addedAt: Date.now() }]
          setLocalCart(next)
          return next
        })
      }
    },
    [isLoggedIn, hasMerged]
  )

  // ── Update quantity ────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartApi.updateQuantity(productId, quantity),
    onSuccess: () => {
      if (isLoggedIn) queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (isLoggedIn && hasMerged) {
        updateMutation.mutate({ productId, quantity })
      } else {
        setLocalCartState((prev) => {
          const next = quantity <= 0
            ? prev.filter((i) => i.productId !== productId)
            : prev.map((i) =>
                i.productId === productId ? { ...i, quantity } : i
              )
          setLocalCart(next)
          return next
        })
      }
    },
    [isLoggedIn, hasMerged]
  )

  // ── Remove from cart ───────────────────────────────────────────
  const removeMutation = useMutation({
    mutationFn: (productId: string) => cartApi.removeItem(productId),
    onSuccess: () => {
      if (isLoggedIn) queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  const removeFromCart = useCallback(
    (productId: string) => {
      if (isLoggedIn && hasMerged) {
        removeMutation.mutate(productId)
      } else {
        setLocalCartState((prev) => {
          const next = prev.filter((i) => i.productId !== productId)
          setLocalCart(next)
          return next
        })
      }
    },
    [isLoggedIn, hasMerged]
  )

  // ── Clear cart ────────────────────────────────────────────────
  const clearMutation = useMutation({
    mutationFn: () => cartApi.clearCart(),
    onSuccess: () => {
      if (isLoggedIn) queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })

  const clearCart = useCallback(() => {
    if (isLoggedIn && hasMerged) {
      clearMutation.mutate()
    } else {
      setLocalCartState([])
      localStorage.removeItem(LOCAL_CART_KEY)
    }
  }, [isLoggedIn, hasMerged])

  // ── Active cart (DB vs localStorage) ─────────────────────────
  const activeItems = isLoggedIn && hasMerged && dbCart ? dbCart.items : []
  const activeSubtotal = isLoggedIn && hasMerged && dbCart ? dbCart.subtotal : 0
  const isLoading = isLoggedIn && hasMerged ? dbLoading : false

  // For localStorage, we only have {productId, quantity} — to show product details,
  // components should use the product query. For cart count, we can count items.
  const localItemCount = localCart.reduce((sum, i) => sum + i.quantity, 0)
  const dbItemCount = activeItems.reduce((sum: number, i: CartItem) => sum + i.quantity, 0)
  const itemCount = isLoggedIn && hasMerged ? dbItemCount : localItemCount

  return {
    // For logged-in users: full cart items with product details
    items: activeItems,
    subtotal: activeSubtotal,
    // For anonymous: just the local cart snapshot
    localItems: localCart,
    // Cart operations
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    // State
    isLoading,
    itemCount,
    // Helpers
    isLoggedIn: isLoggedIn && hasMerged,
  }
}
