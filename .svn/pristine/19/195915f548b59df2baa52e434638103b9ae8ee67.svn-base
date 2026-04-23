import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import productApi from '@/api/product.api'

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: Record<string, unknown>) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  slug: (slug: string) => [...productKeys.details(), 'slug', slug] as const,
  featured: () => [...productKeys.all, 'featured'] as const,
  bestSellers: () => [...productKeys.all, 'bestSellers'] as const,
  related: (id: string) => [...productKeys.all, 'related', id] as const,
  brands: () => [...productKeys.all, 'brands'] as const,
}

export function useProducts(filters = {}) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productApi.getById(id),
    enabled: !!id,
  })
}

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: productKeys.slug(slug),
    queryFn: () => productApi.getBySlug(slug),
    enabled: !!slug,
  })
}

export function useFeaturedProducts(limit = 8) {
  return useQuery({
    queryKey: [...productKeys.featured(), limit],
    queryFn: () => productApi.getFeatured(limit),
    staleTime: 5 * 60 * 1000,
  })
}

export function useBestSellers(limit = 8) {
  return useQuery({
    queryKey: [...productKeys.bestSellers(), limit],
    queryFn: () => productApi.getBestSellers(limit),
    staleTime: 5 * 60 * 1000,
  })
}

export function useRelatedProducts(id: string, limit = 4) {
  return useQuery({
    queryKey: productKeys.related(id),
    queryFn: () => productApi.getRelated(id, limit),
    enabled: !!id,
  })
}

export function useBrands() {
  return useQuery({
    queryKey: productKeys.brands(),
    queryFn: () => productApi.getBrands(),
    staleTime: 30 * 60 * 1000,
  })
}

// Admin mutations
export function useCreateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: productApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.lists() }),
  })
}

export function useUpdateProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => productApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: productKeys.detail(id) })
      qc.invalidateQueries({ queryKey: productKeys.lists() })
    },
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.lists() }),
  })
}
