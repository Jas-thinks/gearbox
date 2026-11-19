"use client";

import * as React from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { categoryLabels, cities } from "@/lib/data";
import type { EquipmentCategory, SortOption } from "@/types/equipment";

export interface BrowseFilters {
  search: string;
  category: EquipmentCategory | "all";
  city: string;
  minPrice: string;
  maxPrice: string;
  sort: SortOption;
}

interface BrowseFiltersProps {
  filters: BrowseFilters;
  onFiltersChange: (filters: BrowseFilters) => void;
  resultCount: number;
}

export function BrowseFiltersPanel({
  filters,
  onFiltersChange,
  resultCount,
}: BrowseFiltersProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const update = (partial: Partial<BrowseFilters>) => {
    onFiltersChange({ ...filters, ...partial });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: "",
      category: "all",
      city: "all",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
    });
  };

  const filterContent = (
    <div className="space-y-6">
      <div>
        <Label htmlFor="search" className="mb-2 block">
          Search
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search equipment..."
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            className="pl-10"
          />
        </div>
      </div>

      <Separator />

      <div>
        <Label className="mb-2 block">Category</Label>
        <Select
          value={filters.category}
          onValueChange={(value) =>
            update({ category: value as EquipmentCategory | "all" })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {(Object.keys(categoryLabels) as EquipmentCategory[]).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {categoryLabels[cat]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 block">City</Label>
        <Select
          value={filters.city}
          onValueChange={(value) => update({ city: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="All cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All cities</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 block">Price range (₹/day)</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Min"
            type="number"
            value={filters.minPrice}
            onChange={(e) => update({ minPrice: e.target.value })}
          />
          <Input
            placeholder="Max"
            type="number"
            value={filters.maxPrice}
            onChange={(e) => update({ maxPrice: e.target.value })}
          />
        </div>
      </div>

      <Separator />

      <div>
        <Label className="mb-2 block">Sort by</Label>
        <Select
          value={filters.sort}
          onValueChange={(value) => update({ sort: value as SortOption })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="popular">Popular</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button variant="outline" className="w-full" onClick={clearFilters}>
        Clear filters
      </Button>
    </div>
  );

  return (
    <>
      <div className="mb-6 flex items-center justify-between lg:hidden">
        <p className="text-sm text-muted-foreground">
          {resultCount} {resultCount === 1 ? "item" : "items"}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <SlidersHorizontal className="size-4" />
          Filters
        </Button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm overflow-y-auto bg-background p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                <X className="size-5" />
              </Button>
            </div>
            {filterContent}
          </div>
        </div>
      )}

      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-6 text-lg font-semibold">Filters</h2>
          {filterContent}
        </div>
      </aside>
    </>
  );
}
