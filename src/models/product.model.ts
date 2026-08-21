import type { PaginationMeta } from "./pagination.model.js";

export type Product = {
  id: number;
  name: string;
  sku: string;
  price: string;
  stock: number;
  created_at: Date;
};

export type ProductResponse = Product;

export type GetProductsQueryDTO = {
  search?: string | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;

  page?: number | undefined;
  limit?: number | undefined;
};

export type ProductFilterParams = Pick<
  GetProductsQueryDTO,
  "search" | "minPrice" | "maxPrice" | "limit"
> & { offset?: number };

export type PaginatedProductsResult = {
  data: Product[];
  meta: PaginationMeta;
};

export type CreateProductDTO = Omit<Product, "id" | "created_at">;

export type UpdateProductDTO = Partial<Omit<Product, "id" | "created_at">>;

export type RestockProductDTO = {
  quantity: number;
};

export type ReduceStockProductDTO = {
  quantity: number;
};

export type BulkRestockProductDTO = {
  id: number;
  quantity: number;
}[];

export type ChangePriceProductDTO = {
  amount: number;
};

export type BulkDeleteProductsDTO = {
  ids: number[];
};
