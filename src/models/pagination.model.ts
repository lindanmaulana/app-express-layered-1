export interface PaginationMeta {
  page: number;
  limit: number;
  totalData: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
