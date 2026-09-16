
export interface PaginationMeta {
  page: number;
  limit: number;
  totalData: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
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



















export interface OpaqueCursor {
  createdAt: string;
  id: number;
}

export interface CursorPaginationMeta {
  limit: number;
  hasNextPage: boolean;
  nextCursor?: string | number | null;
}

export interface CursorPaginationQuery {
  limit?: number | undefined;
  sortOrder?: string | undefined;
  cursor?: string | number | undefined;
}

export interface CursorPaginationOptions {
  cursor?: string | number | undefined;
  limit: number;
}

export interface CursorPaginationQuery2 {
  limit?: number | undefined;
  sortOrder?: string | undefined;
  cursor?: string | undefined
}  

export interface CursorPaginationOptions2 {
  cursor?: OpaqueCursor | undefined;

  limit: number;
}
