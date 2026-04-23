import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import cmsApi from '@/api/cms.api'

// ── Banners ────────────────────────────────────────────
export const bannerKeys = { all: ['banners'] as const }

export function useBanners() {
  return useQuery({
    queryKey: bannerKeys.all,
    queryFn: () => cmsApi.getBanners(),
    staleTime: 10 * 60 * 1000,
  })
}

export function useAdminBanners() {
  return useQuery({
    queryKey: [...bannerKeys.all, 'admin'],
    queryFn: () => cmsApi.getAdminBanners(),
    staleTime: 60 * 1000,
  })
}

export function useCreateBanner() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: cmsApi.createBanner,
    onSuccess: () => qc.invalidateQueries({ queryKey: bannerKeys.all }),
  })
}

export function useUpdateBanner() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => cmsApi.updateBanner(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: bannerKeys.all }),
  })
}

export function useDeleteBanner() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: cmsApi.deleteBanner,
    onSuccess: () => qc.invalidateQueries({ queryKey: bannerKeys.all }),
  })
}

// ── News ───────────────────────────────────────────────
export const newsKeys = {
  all: ['news'] as const,
  list: (filters?: Record<string, unknown>) => [...newsKeys.all, 'list', filters ?? {}] as const,
  detail: (slug: string) => [...newsKeys.all, 'detail', slug] as const,
}

export function useNews(filters?: { page?: number; limit?: number; tag?: string }) {
  return useQuery({
    queryKey: newsKeys.list(filters),
    queryFn: () => cmsApi.getNews(filters),
    staleTime: 10 * 60 * 1000,
  })
}

export function useAdminNews(filters?: { page?: number; limit?: number; tag?: string }) {
  return useQuery({
    queryKey: [...newsKeys.all, 'admin', filters ?? {}],
    queryFn: () => cmsApi.getAdminNews(filters),
    staleTime: 60 * 1000,
  })
}

export function useNewsArticle(slug: string) {
  return useQuery({
    queryKey: newsKeys.detail(slug),
    queryFn: () => cmsApi.getNewsBySlug(slug),
    enabled: !!slug,
  })
}

export function useCreateNews() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: cmsApi.createNews,
    onSuccess: () => qc.invalidateQueries({ queryKey: newsKeys.all }),
  })
}

export function useUpdateNews() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => cmsApi.updateNews(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: newsKeys.all }),
  })
}

export function useDeleteNews() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: cmsApi.deleteNews,
    onSuccess: () => qc.invalidateQueries({ queryKey: newsKeys.all }),
  })
}

// ── Services ────────────────────────────────────────────
export const serviceKeys = { all: ['services'] as const }

export function useServices() {
  return useQuery({
    queryKey: serviceKeys.all,
    queryFn: () => cmsApi.getServices(),
    staleTime: 10 * 60 * 1000,
  })
}

export function useAdminServices() {
  return useQuery({
    queryKey: [...serviceKeys.all, 'admin'],
    queryFn: () => cmsApi.getAdminServices(),
    staleTime: 60 * 1000,
  })
}

export function useCreateService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: cmsApi.createService,
    onSuccess: () => qc.invalidateQueries({ queryKey: serviceKeys.all }),
  })
}

export function useUpdateService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => cmsApi.updateService(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: serviceKeys.all }),
  })
}

export function useDeleteService() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: cmsApi.deleteService,
    onSuccess: () => qc.invalidateQueries({ queryKey: serviceKeys.all }),
  })
}
