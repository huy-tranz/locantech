import { useMemo } from "react";
import { useCategories as useCategoriesQuery } from "@/hooks/queries/category.queries";

export function useCategories() {
  const query = useCategoriesQuery();

  const categories = useMemo(() => {
    return (query.data || []) as any[];
  }, [query.data]);

  return { categories, isLoading: query.isLoading, error: query.error };
}
