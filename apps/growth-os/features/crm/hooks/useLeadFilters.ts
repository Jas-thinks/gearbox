"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

export interface LeadFilterState {
  search: string;
  status: string;
  creator_type: string;
  lead_source: string;
  city: string;
  page: number;
  sort: string;
  order: "asc" | "desc";
}

export function useLeadFilters(): {
  filters: LeadFilterState;
  setFilter: (key: keyof LeadFilterState, value: string | number) => void;
  setSearch: (value: string) => void;
  resetFilters: () => void;
  isPending: boolean;
} {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const filters: LeadFilterState = {
    search: searchParams.get("search") ?? "",
    status: searchParams.get("status") ?? "",
    creator_type: searchParams.get("creator_type") ?? "",
    lead_source: searchParams.get("lead_source") ?? "",
    city: searchParams.get("city") ?? "",
    page: Number(searchParams.get("page") ?? 1),
    sort: searchParams.get("sort") ?? "created_at",
    order: (searchParams.get("order") ?? "desc") as "asc" | "desc",
  };

  const updateParams = useCallback(
    (updates: Partial<LeadFilterState>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === "" || value === undefined || value === null) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      // Reset to page 1 when filter changes (not when page changes itself)
      if (!("page" in updates)) params.set("page", "1");
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [searchParams, router, pathname]
  );

  const setFilter = useCallback(
    (key: keyof LeadFilterState, value: string | number) => {
      updateParams({ [key]: value });
    },
    [updateParams]
  );

  const setSearch = useDebouncedCallback((value: string) => {
    updateParams({ search: value });
  }, 400);

  const resetFilters = useCallback(() => {
    startTransition(() => {
      router.push(pathname);
    });
  }, [router, pathname]);

  return { filters, setFilter, setSearch, resetFilters, isPending };
}
