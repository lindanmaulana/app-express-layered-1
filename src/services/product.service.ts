import { NotFoundError } from "../errors/index.js";

import type {
  Product
} from "../models/product.model.js";
import { productRepository } from "../repositories/product.repository.js";

export const productService = {
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