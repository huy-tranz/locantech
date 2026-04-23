import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import repairApi from '@/api/repair.api'

export const repairKeys = {
  all: ['repair'] as const,
  admin: (filters?: Record<string, unknown>) => [...repairKeys.all, 'admin', filters ?? {}] as const,
}

// ── Admin ─────────────────────────────────────────────────
export function useRepairRequests(filters?: { page?: number; limit?: number; status?: string }) {
  return useQuery({
    queryKey: repairKeys.admin(filters),
    queryFn: () => repairApi.getAllAdmin(filters),
    staleTime: 30 * 1000,
  })
}

export function useUpdateRepairStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: string; note?: string }) =>
      repairApi.updateStatus(id, status, note),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: repairKeys.all })
    },
  })
}
