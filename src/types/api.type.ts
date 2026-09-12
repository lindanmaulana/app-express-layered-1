export interface PaginationMeta {
  page: number;
  limit: number;
  totalData: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

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

export interface PaginationQuery {
  page?: number | undefined
  limit?: number | undefined
  sortOrder?: string | undefined
}

export interface PaginationOptions {
  page: number
  limit: number
  skip: number
  take: number
}

export interface SortType {
  asc: "ASC",
  desc: "DESC"
}