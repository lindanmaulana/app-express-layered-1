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