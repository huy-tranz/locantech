import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import categoryApi from '@/api/category.api'

export const categoryKeys = {
  all: ['categories'] as const,
  list: () => [...categoryKeys.all, 'list'] as const,
  flat: () => [...categoryKeys.all, 'flat'] as const,
  detail: (id: string) => [...categoryKeys.all, 'detail', id] as const,
  slug: (slug: string) => [...categoryKeys.all, 'slug', slug] as const,
}

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () => categoryApi.getAll(),
    staleTime: 30 * 60 * 1000, // 30 min
  })
}

export function useCategoriesFlat() {
  return useQuery({
    queryKey: categoryKeys.flat(),
    queryFn: () => categoryApi.getAllFlat(),
    staleTime: 30 * 60 * 1000,
  })
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryApi.getById(id),
    enabled: !!id,
  })
}

export function useCategoryBySlug(slug: string) {
  return useQuery({
    queryKey: categoryKeys.slug(slug),
    queryFn: () => categoryApi.getBySlug(slug),
    enabled: !!slug,
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: categoryApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.all }),
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => categoryApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.all }),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: categoryApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: categoryKeys.all }),
  })
}
