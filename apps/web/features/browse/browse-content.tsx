"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { EquipmentCard } from "@/components/shared/equipment-card";
import { FadeIn } from "@/components/shared/fade-in";
import { equipmentList } from "@/lib/data";
import {
  BrowseFiltersPanel,
  type BrowseFilters,
} from "@/features/browse/browse-filters";
import type { Equipment } from "@/types/equipment";

function filterEquipment(items: Equipment[], filters: BrowseFilters): Equipment[] {
  let result = [...items];

  if (filters.search) {
    const query = filters.search.toLowerCase();
    result = result.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.city.toLowerCase().includes(query)
    );
  }

  if (filters.category !== "all") {
    result = result.filter((item) => item.category === filters.category);
  }

  if (filters.city !== "all") {
    result = result.filter((item) => item.city === filters.city);
  }

  if (filters.minPrice) {
    result = result.filter((item) => item.pricePerDay >= Number(filters.minPrice));
  }

  if (filters.maxPrice) {
    result = result.filter((item) => item.pricePerDay <= Number(filters.maxPrice));
  }

  switch (filters.sort) {
    case "popular":
      result.sort((a, b) => Number(b.popular) - Number(a.popular));
      break;
    case "price-low":
      result.sort((a, b) => a.pricePerDay - b.pricePerDay);
      break;
    case "price-high":
      result.sort((a, b) => b.pricePerDay - a.pricePerDay);
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    default:
      result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  return result;
}

export function BrowseContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  const [filters, setFilters] = React.useState<BrowseFilters>({
    search: "",
    category:
      categoryParam && categoryParam !== "all"
        ? (categoryParam as BrowseFilters["category"])
        : "all",
    city: "all",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
  });

  const activeFilters: BrowseFilters = {
    ...filters,
    category:
      categoryParam && categoryParam !== "all"
        ? (categoryParam as BrowseFilters["category"])
        : filters.category,
  };

  const filtered = filterEquipment(equipmentList, activeFilters);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <BrowseFiltersPanel
        filters={activeFilters}
        onFiltersChange={setFilters}
        resultCount={filtered.length}
      />

      <div>
        <div className="mb-6 hidden lg:block">
          <p className="text-sm text-muted-foreground">
            Showing {filtered.length} {filtered.length === 1 ? "item" : "items"}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
            <p className="text-lg font-medium">No equipment found</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your filters or search query.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item, index) => (
              <FadeIn key={item.id} delay={index * 0.05}>
                <EquipmentCard equipment={item} />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
