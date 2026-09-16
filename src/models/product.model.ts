import type { CursorPaginationMeta, CursorPaginationQuery2, OpaqueCursor, PaginationMeta } from "../types/pagination.type.js";

export type Product = {
  id: number;
  category_id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  created_at: string;
};









export type GetProductsQueryData = CursorPaginationQuery2 & {
  search?: string | undefined;
  min_price?: number | undefined;
  max_price?: number | undefined;

  category_id?: number | undefined;
  category_slug?: string | undefined;
};

export type ProductFilterParams = Omit<GetProductsQueryData, "page" | "cursor"> & {
  cursor?: OpaqueCursor | undefined
}

export type CreateProductData = Omit<Product, "id" | "created_at"> & {
  stock?: number | undefined;
};

export type UpdateProductData = {
  [K in keyof CreateProductData]?: Product[K] | undefined;
};

export type RestockProductData = {
  quantity: number;
};

export type ReduceStockProductData = {
  quantity: number;
};

export type BulkRestockProductData = {
  id: number;
  quantity: number;
}[];

export type ChangePriceProductData = {
  amount: number;
};

export type BulkDeleteProductsData = {
  ids: number[];
};









export type ProductResponse = Product;
export type PaginatedProductsResponse = {
  data: Product[];
  meta: PaginationMeta;
};

export type PaginatedCursorProductsResponse = {
  data: Product[]
  meta: CursorPaginationMeta
};
