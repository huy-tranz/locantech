import api from './axios'

export default {
  getCart: () => api.get('/cart').then((r) => r.data),

  addItem: (productId: string, quantity = 1) =>
    api.post('/cart/items', { productId, quantity }).then((r) => r.data),

  updateQuantity: (productId: string, quantity: number) =>
    api.patch(`/cart/items/${productId}`, { quantity }).then((r) => r.data),

  removeItem: (productId: string) =>
    api.delete(`/cart/items/${productId}`).then((r) => r.data),

  clearCart: () => api.delete('/cart').then((r) => r.data),

  /** Merge localStorage cart into DB cart when user logs in */
  mergeCart: (items: Array<{ productId: string; quantity: number }>) =>
    api.post('/cart/merge', { items }).then((r) => r.data),
}
