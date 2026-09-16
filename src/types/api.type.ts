import type { CursorPaginationMeta, OpaqueCursor, PaginationMeta } from "./pagination.type.js";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ApiPaginationResponse<T = unknown> {
    success: boolean
    message: string
    data: T[] | []
    meta: PaginationMeta
}

export interface ApiCursorPaginationResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T[] | T;
  meta: CursorPaginationMeta;
}

