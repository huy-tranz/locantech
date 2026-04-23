import { useMemo } from "react";
import { useBanners as useBannersQuery } from "@/hooks/queries/cms.queries";

export function useBanners() {
  const query = useBannersQuery();
  const banners = useMemo(() => {
    return (query.data || []) as any[];
  }, [query.data]);
  return { banners, isLoading: query.isLoading, error: query.error };
}
