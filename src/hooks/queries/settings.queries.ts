import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import settingsApi, { SiteConfig } from '@/api/settings.api'

export const settingsKeys = {
  all: ['settings'] as const,
}

export function useSiteSettings() {
  return useQuery({
    queryKey: settingsKeys.all,
    queryFn: settingsApi.get,
    staleTime: Infinity, // settings rarely change, manual save only
  })
}

export function useUpdateSettings() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<SiteConfig>) => settingsApi.update(data),
    onSuccess: (updated) => {
      qc.setQueryData<SiteConfig>(settingsKeys.all, updated)
    },
  })
}
