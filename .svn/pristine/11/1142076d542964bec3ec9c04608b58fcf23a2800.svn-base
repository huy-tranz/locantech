import { useMemo } from "react";
import { useNews as useNewsQuery } from "@/hooks/queries/cms.queries";

export function useNews(filters?: { page?: number; limit?: number; tag?: string }) {
  const query = useNewsQuery(filters);
  const articles = useMemo(() => {
    return ((query.data as any)?.articles || []) as any[];
  }, [query.data]);
  return { articles, isLoading: query.isLoading, error: query.error };
}
