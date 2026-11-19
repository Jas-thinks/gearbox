import type { PaginationParams, PaginatedResponse } from "@/types/common";
import { PAGINATION_CONFIG } from "@/config/app";

export function parsePaginationParams(
  searchParams: Record<string, string | string[] | undefined>
): PaginationParams {
  const page = Math.max(1, Number(searchParams.page ?? 1));
  const pageSize = Math.min(
    PAGINATION_CONFIG.maxPageSize,
    Math.max(1, Number(searchParams.pageSize ?? PAGINATION_CONFIG.defaultPageSize))
  );
  return { page, pageSize };
}

export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  params: PaginationParams
): PaginatedResponse<T> {
  return {
    data,
    total,
    page: params.page,
    pageSize: params.pageSize,
    totalPages: Math.ceil(total / params.pageSize),
  };
}

/**
 * Calculate offset for database queries.
 */
export function getOffset(params: PaginationParams): number {
  return (params.page - 1) * params.pageSize;
}
