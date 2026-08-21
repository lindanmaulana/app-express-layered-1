import pool from "../config/db.js";
import type {
  BulkDeleteProductsDTO,
  BulkRestockProductDTO,
  ChangePriceProductDTO,
  CreateProductDTO,
  GetProductsQueryDTO,
  PaginatedProductsResult,
  Product,
  ReduceStockProductDTO,
  RestockProductDTO,
  UpdateProductDTO,
} from "../models/product.model.js";
import { productRepository } from "../repositories/product.repository.js";

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

  getById: async (id: number): Promise<Product> => {
    const result = await productRepository.findById(id);

    if (!result) throw new Error("Product not found");

    return result;
  },

  getBySku: async (sku: string): Promise<Product> => {
    const result = await productRepository.findBySku(sku);

    if (!result) throw new Error("Sku not found");

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

  create: async (dto: CreateProductDTO): Promise<Product> => {
    const product = await productRepository.existsBySku(dto.sku);
    if (product) throw new Error("SKU is taken.");

    const result = await productRepository.create(dto);

    return result;
  },

  updateById: async (id: number, dto: UpdateProductDTO): Promise<void> => {
    const product = await productRepository.findById(id);
    if (!product) throw new Error("Product not found");

    if (dto.sku) {
      const isSkuTaken = await productRepository.existsBySkuExcludeId(
        product.id,
        dto.sku,
      );

      if (isSkuTaken) throw new Error("Sku sudah digunakan oleh produk lain");
    }

    const result = await productRepository.updateById(id, dto);
    if (!result)
      throw new Error("Gagal memperbarui produk, silahkan coba lagi");
  },

  changePrice: async (
    id: number,
    dto: ChangePriceProductDTO,
  ): Promise<void> => {
    if (dto.amount <= 0) throw new Error("Harga produk baru tidak valid");

    const product = await productRepository.findById(id);
    if (!product) throw new Error("Produk tidak ditemukan");

    if (Number(product.price) === dto.amount)
      throw new Error("Harga baru tidak boleh sama dengan harga saat ini");

    const result = await productRepository.updatePrice(id, dto);
    if (!result)
      throw new Error("Gagal memperbarui harga produk, silahkan coba lagi");
  },

  restock: async (id: number, dto: RestockProductDTO): Promise<void> => {
    if (dto.quantity <= 0)
      throw new Error("Jumlah penambahan stok tidak valid");

    const product = await productRepository.findById(id);
    if (!product) throw new Error("Produk tidak ditemukan");

    const result = await productRepository.incrementStock(id, dto);
    if (!result)
      throw new Error("Gagal menambah stok produk, silahkan coba lagi");
  },

  reduceStock: async (
    id: number,
    dto: ReduceStockProductDTO,
  ): Promise<void> => {
    if (dto.quantity <= 0)
      throw new Error("Jumlah pengurangan stok tidak valid");

    const product = await productRepository.findById(id);
    if (!product) throw new Error("Produk tidak ditemukan");

    if (product.stock < dto.quantity)
      throw new Error(
        `Stok tidak mencukupi, Sisa stok saat ini: ${product.stock}`,
      );

    const result = await productRepository.decrementStock(id, dto);
    if (!result)
      throw new Error("Gagal mengurangi stok produk, silahkan coba lagi");
  },

  bulkRestock: async (items: BulkRestockProductDTO): Promise<void> => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      for (const item of items) {
        const isRestock = await productRepository.incrementStock(item.id, {
          quantity: item.quantity,
        });

        if (!isRestock)
          throw new Error(`Produk dengan ID ${item.id} tidak ditemukan`);
      }

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");

      throw err;
    } finally {
      client.release();
    }
  },

  deleteById: async (id: number): Promise<void> => {
    const product = await productRepository.findById(id);
    if (!product) throw new Error("Product not found");

    const result = await productRepository.deleteById(id);
    if (!result) throw new Error("Gagal menghapus produk, silahkan coba lagi");
  },

  bulkDelete: async (dto: BulkDeleteProductsDTO): Promise<number> => {
    if (!dto.ids || dto.ids.length === 0)
      throw new Error("Daftar ID produk tidak boleh kosong");

    const deleteCount = await productRepository.deleteManyByIds(dto.ids);
    if (deleteCount === 0)
      throw new Error("Tidak ada produk yang berhasil dihapus");

    return deleteCount;
  },
};
