import type { PaginationMeta } from "../types/api.type.js";

export type Product = {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  created_at: Date;
};

export type ProductResponse = Product;

export type GetProductsQueryData = {
  search?: string | undefined;
  min_price?: number | undefined;
  max_price?: number | undefined;

  category_id?: number | undefined;
  category_slug?: string | undefined

  page?: number | undefined;
  limit?: number | undefined;
};

export type ProductFilterParams = Omit<GetProductsQueryData, "page"> & { offset?: number }

export type PaginatedProductsResult = {
  data: Product[];
  meta: PaginationMeta;
};

export type CreateProductData = Omit<Product, "id" | "created_at"> & {
  stock?: number | undefined;
};

export type UpdateProductData = {
  [K in keyof CreateProductData]?: Product[K] | undefined
}

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
