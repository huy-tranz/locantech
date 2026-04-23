import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import userApi, { AdminUser } from '@/api/user.api'

export const userKeys = {
  all: ['users'] as const,
  list: () => [...userKeys.all, 'list'] as const,
}

export function useAdminUsers() {
  return useQuery({
    queryKey: userKeys.list(),
    queryFn: userApi.getAll,
    staleTime: 5 * 60 * 1000,
  })
}

export function useAdminCustomers() {
  return useQuery({
    queryKey: [...userKeys.all, 'customers'],
    queryFn: userApi.getCustomers,
    staleTime: 5 * 60 * 1000,
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: userApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof userApi.update>[1] }) =>
      userApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: userApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: userKeys.all }),
  })
}
