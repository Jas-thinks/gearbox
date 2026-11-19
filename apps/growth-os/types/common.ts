/**
 * Shared primitive types used across all modules.
 * Keep this file lean — only universal types live here.
 */

export type ID = string; // UUID

export type ISODateString = string;

export interface Timestamps {
  created_at: ISODateString;
  updated_at: ISODateString;
}

export interface SoftDelete {
  deleted_at: ISODateString | null;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export type SortOrder = "asc" | "desc";

export interface SortParams {
  field: string;
  order: SortOrder;
}

export interface FilterParams {
  [key: string]: string | number | boolean | null | undefined;
}

export type AsyncResult<T> = Promise<ApiResponse<T>>;
