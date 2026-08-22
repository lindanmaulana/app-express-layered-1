import pool from "../config/db.js";
import type {
  ChangePriceProductDTO,
  CreateProductDTO,
  Product,
  ProductFilterParams,
  ReduceStockProductDTO,
  RestockProductDTO,
  UpdateProductDTO
} from "../models/product.model.js";

export const productRepository = {
  buildWhereClause: (filters: ProductFilterParams) => {
    const conditions: string[] = [];
    const params: (string | number | boolean)[] = [];

    if (filters.search) {
      params.push(`%${filters.search}%`);
      conditions.push(`name ILIKE $${params.length}`);
    }

    if (filters.minPrice) {
      params.push(filters.minPrice);
      conditions.push(`price >= $${params.length}`);
    }

    if (filters.maxPrice) {
      params.push(filters.maxPrice);
      conditions.push(`price <= $${params.length}`);
    }

    const whereSQL = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    return { whereSQL, params };
  },

  findAll: async (filters: ProductFilterParams): Promise<Product[]> => {
    const { whereSQL, params } = productRepository.buildWhereClause(filters);
    const queryParams = [...params];

    let paginationClause = "";
    if (filters.limit) {
      queryParams.push(filters.limit);
      paginationClause += ` LIMIT $${queryParams.length}`;
    }

    if (filters.offset) {
      queryParams.push(filters.offset);
      paginationClause += ` OFFSET $${queryParams.length}`;
    }

    const query = `SELECT id, name, sku, price, stock, created_at FROM products ${whereSQL} ORDER BY id DESC ${paginationClause}`;
    const result = await pool.query<Product>(query, queryParams);

    return result.rows;
  },

  countAll: async (filters: ProductFilterParams): Promise<number> => {
    const { whereSQL, params } = productRepository.buildWhereClause(filters);

    const query = `SELECT COUNT(id) AS total FROM products ${whereSQL}`;
    const result = await pool.query(query, params);

    return parseInt(result.rows[0].total, 10);
  },

  findById: async (id: number): Promise<Product | null> => {
    const query =
      "SELECT id, name, sku, price, stock, created_at FROM products WHERE id = $1";
    const result = await pool.query<Product>(query, [id]);

    return result.rows[0] ?? null;
  },

  findBySku: async (sku: string): Promise<Product | null> => {
    const query =
      "SELECT id, name, sku, price, stock, created_at FROM products WHERE sku = $1";
    const result = await pool.query<Product>(query, [sku]);

    return result.rows[0] ?? null;
  },

  findLowStock: async (): Promise<Product[]> => {
    const query =
      "SELECT id, name, sku, price, stock, created_at FROM products WHERE stock <= 2";
    const result = await pool.query<Product>(query);

    return result.rows;
  },

  findHighStock: async (): Promise<Product[]> => {
    const query =
      "SELECT id, name, sku, price, stock, created_at FROM products WHERE stock >= 15";
    const result = await pool.query<Product>(query);

    return result.rows;
  },

  existsBySku: async (sku: string): Promise<boolean> => {
    const query = "SELECT 1 FROM products WHERE sku = $1";
    const result = await pool.query(query, [sku]);

    return (result.rowCount ?? 0) > 0;
  },

  existsBySkuExcludeId: async (id: number, sku: string): Promise<boolean> => {
    const query = "SELECT 1 FROM products WHERE sku = $1 AND id != $2";
    const result = await pool.query<Product>(query, [sku, id]);

    return (result.rowCount ?? 0) > 0;
  },

  create: async (dto: CreateProductDTO): Promise<Product> => {
    const query =
      "INSERT INTO products (name, sku, price, stock) VALUES ($1, $2, $3, $4) RETURNING *";
    const result = await pool.query<Product>(query, [
      dto.name,
      dto.sku,
      dto.price,
      dto.stock,
    ]);

    const createdProduct = result.rows[0];
    if (!createdProduct) throw new Error("Gagal membuat produk baru");

    return createdProduct;
  },

  updateById: async (id: number, dto: UpdateProductDTO): Promise<boolean> => {
    const query =
      "UPDATE products SET name = COALESCE($1, name), sku = COALESCE($2, sku), price = COALESCE($3::numeric, price), stock = COALESCE($4::int, stock) WHERE id = $5";
    const result = await pool.query<Product>(query, [
      dto.name ?? null,
      dto.sku ?? null,
      dto.price ?? null,
      dto.stock ?? null,
      id,
    ]);

    return (result.rowCount ?? 0) > 0;
  },

  updatePrice: async (
    id: number,
    dto: ChangePriceProductDTO,
  ): Promise<boolean> => {
    const query = "UPDATE products SET price = $1 WHERE id = $2";
    const result = await pool.query<Product>(query, [dto.amount, id]);

    return (result.rowCount ?? 0) > 0;
  },

  incrementStock: async (
    id: number,
    dto: RestockProductDTO,
  ): Promise<boolean> => {
    const query = "UPDATE products SET stock = stock + $1 WHERE id = $2";
    const result = await pool.query<Product>(query, [dto.quantity, id]);

    return (result.rowCount ?? 0) > 0;
  },

  decrementStock: async (
    id: number,
    dto: ReduceStockProductDTO,
  ): Promise<boolean> => {
    const query = "UPDATE products SET stock = stock - $1 WHERE id = $2";
    const result = await pool.query<Product>(query, [dto.quantity, id]);

    return (result.rowCount ?? 0) > 0;
  },

  deleteById: async (id: number): Promise<boolean> => {
    const query = "DELETE FROM products WHERE id = $1";
    const result = await pool.query<Product>(query, [id]);

    return (result.rowCount ?? 0) > 0;
  },

  deleteManyByIds: async (ids: number[]): Promise<number> => {
    const query = "DELETE FROM products WHERE id = ANY($1::int[])";
    const result = await pool.query<Product>(query, [ids]);

    return result.rowCount ?? 0;
  },
};
