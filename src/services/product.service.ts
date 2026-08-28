import { NotFoundError } from "../errors/index.js";

import type {
  PaginatedProductsResult,
  Product,
} from "../models/product.model.js";
import { productRepository } from "../repositories/product.repository.js";
import type { GetProductsQueryDTO } from "../validations/product.validation.js";

export const productService = {
  getAll: async (
    filters: GetProductsQueryDTO,
  ): Promise<PaginatedProductsResult> => {
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(filters.limit) || 10));
    const search = filters.search?.trim() || "";

    const offset = (page - 1) * limit;

    const [products, totalData] = await Promise.all([
      productRepository.findAll({ ...filters, search, offset }),
      productRepository.countAll({ ...filters, search, offset }),
    ]);

    const totalPages = Math.ceil(totalData / limit);

    return {
      data: products,
      meta: {
        page: page,
        limit: limit,
        totalData: totalData,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  },

  getBySku: async (sku: string): Promise<Product> => {
    const result = await productRepository.findBySku(sku);

    if (!result)
      throw new NotFoundError(`Produk dengan SKU ${sku} tidak tersedia`);

    return result;
  },

  getLowStock: async (): Promise<Product[]> => {
    const result = await productRepository.findLowStock();

    return result;
  },

  getHighStock: async (): Promise<Product[]> => {
    const result = await productRepository.findHighStock();

    return result;
  },
};