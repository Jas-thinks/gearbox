"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { LeadTable } from "./LeadTable";
import type { Lead } from "@/types/lead";
import type { PaginatedResponse } from "@/types/common";
import { useTransition } from "react";

interface Props {
  data: PaginatedResponse<Lead>;
  currentSort: string;
  currentOrder: "asc" | "desc";
}

export function LeadTablePaginationWrapper({ data, currentSort, currentOrder }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  };

  const handleSortChange = (field: string) => {
    if (field === "next-page") {
      updateParam("page", String(data.page + 1));
      return;
    }
    if (field === "page") {
      updateParam("page", String(Math.max(1, data.page - 1)));
      return;
    }
    const newOrder =
      currentSort === field && currentOrder === "desc" ? "asc" : "desc";
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", field);
    params.set("order", newOrder);
    params.set("page", "1");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  };

  return (
    <LeadTable
      data={data}
      currentSort={currentSort}
      currentOrder={currentOrder}
      onSortChange={handleSortChange}
    />
  );
}
