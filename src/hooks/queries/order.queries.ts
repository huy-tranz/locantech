import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import orderApi, { CreateGuestOrderPayload } from '@/api/order.api'

export const orderKeys = {
  all: ['orders'] as const,
  list: (filters?: Record<string, unknown>) => [...orderKeys.all, 'list', filters ?? {}] as const,
  detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
  stats: () => ['admin', 'orderStats'] as const,
  guest: ['orders', 'guest'] as const,
}

export function useOrders(filters?: { page?: number; limit?: number; status?: string }) {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => orderApi.getAll(filters),
  })
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: orderApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.all })
      qc.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}

export function useGuestCreateOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateGuestOrderPayload) => orderApi.createGuest(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.all })
      qc.invalidateQueries({ queryKey: orderKeys.guest })
      qc.invalidateQueries({ queryKey: ['cart'] })
      qc.invalidateQueries({ queryKey: ['admin', 'orderStats'] })
    },
  })
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      orderApi.updateStatus(id, status),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: orderKeys.detail(id) })
      qc.invalidateQueries({ queryKey: orderKeys.list() })
      qc.invalidateQueries({ queryKey: orderKeys.stats() })
    },
  })
}

// Admin
export function useAdminOrders(filters?: { page?: number; limit?: number; status?: string }) {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => orderApi.getAllAdmin(filters),
  })
}

export function useOrderStats() {
  return useQuery({
    queryKey: orderKeys.stats(),
    queryFn: () => orderApi.getStats(),
    staleTime: 60 * 1000, // 1 min
  })
}
