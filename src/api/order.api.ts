import api from './axios'

export interface OrderItemPayload {
  productId: string
  quantity: number
  price: number
  productName: string
  productSku: string
  productImage?: string
}

export interface CreateGuestOrderPayload {
  items: OrderItemPayload[]
  paymentMethod: 'COD' | 'BANK_TRANSFER'
  shippingFee?: number
  discountAmount?: number
  discountCode?: string
  recipientName: string
  recipientPhone: string
  shippingAddress: string
  shippingCity?: string
  note?: string
}

export default {
  getAll: (filters?: { page?: number; limit?: number; status?: string }) =>
    api.get('/orders', { params: filters }).then((r) => r.data),

  getById: (id: string) => api.get(`/orders/${id}`).then((r) => r.data),

  create: (data: unknown) => api.post('/orders', data).then((r) => r.data),

  createGuest: (data: CreateGuestOrderPayload) =>
    api.post('/orders/guest', data).then((r) => r.data),

  // Admin
  getAllAdmin: (filters?: { page?: number; limit?: number; status?: string }) =>
    api.get('/admin/orders', { params: filters }).then((r) => r.data),

  updateStatus: (id: string, status: string) =>
    api.patch(`/orders/${id}/status`, { status }).then((r) => r.data),

  getStats: () => api.get('/admin/orders/stats').then((r) => r.data),
}
