import pool from "../config/db.js";
import type { Category, CategoryFilterParams, CreateCategoryData, GetCategoriesQueryData, UpdateCategoryData } from "../models/category.model.js";

export const categoryRepository = {
    buildWhereClause: (filters: CategoryFilterParams) => {
        const condition: string[] = []
        const values: (string | number | boolean)[] = []

        if (filters.search) {
            values.push(`%${filters.search}%`)
            condition.push(`name ILIKE $${values.length}`)
        }

        const whereSQL = condition.length > 0 ? `WHERE ${condition.join(" AND ")}` : ""

        return { whereSQL, values }
    },

    findAll: async (filters: CategoryFilterParams): Promise<Category[]> => {
        const {whereSQL, values} = categoryRepository.buildWhereClause(filters)
        const queryValues = [...values]

        let paginationClause = ""
        if (filters.limit) {
            queryValues.push(filters.limit)
            paginationClause += ` LIMIT $${queryValues.length}`
        }

        if (filters.offset) {
            queryValues.push(filters.offset)
            paginationClause += ` OFFSET $${queryValues.length}`
        }

        const query = `SELECT id, name, slug, created_at, updated_at FROM categories ${whereSQL} ORDER BY id DESC ${paginationClause}`
        const result = await pool.query<Category>(query, queryValues)

        return result.rows
    },

    findById: async (id: number): Promise<Category | null> => {
        const query = "SELECT id, name, slug, created_at, updated_at FROM categories WHERE id = $1"
        const result = await pool.query<Category>(query, [id])

        return result.rows[0] ?? null
    },

    findBySlug: async (slug: string): Promise<Category | null> => {
        const query = "SELECT id, name, slug, created_at, updated_at FROM categories WHERE slug = $1"
        const result = await pool.query<Category>(query, [slug])

        return result.rows[0] ?? null
    },

    countAll: async (filters: CategoryFilterParams): Promise<number> => {
        const {whereSQL, values} = categoryRepository.buildWhereClause(filters)

        const query = `SELECT COUNT(id) AS total FROM categories ${whereSQL}`
        const result = await pool.query(query, values)

        return parseInt(result.rows[0].total ?? "0", 10)
    },

    existsBySlug: async (slug: string): Promise<boolean> => {
        const query = "SELECT 1 FROM categories WHERE slug = $1"
        const result = await pool.query(query, [slug])

        return (result.rowCount ?? 0) > 0
    },

    existsBySlugExludeId: async (id: number, slug: string): Promise<boolean> => {
        const query = "SELECT 1 FROM categories WHERE slug = $1 AND id != $2"
        const result = await pool.query(query, [slug, id])

        return (result.rowCount ?? 0) > 0
    },

    create: async (data: CreateCategoryData): Promise<Category> => {
        const query = "INSERT INTO categories (name, slug) VALUES ($1, $2) RETURNING id, name, slug, created_at, updated_at"
        const result = await pool.query<Category>(query, [data.name, data.slug])

        const createdCategory = result.rows[0]
        if (!createdCategory) throw new Error("Gagal membuat kategori baru")

        return createdCategory
    },

    update: async (id: number, data: UpdateCategoryData): Promise<boolean> => {
        const query = "UPDATE categories SET name = COALESCE($1, name), slug = COALESCE($2, slug), updated_at = NOW() WHERE id = $3"
        const result = await pool.query<Category>(query, [data.name ?? null, data.slug ?? null, id])

        return (result.rowCount ?? 0) > 0
    },

    deleteById: async (id: number): Promise<boolean> => {
        const query = "DELETE FROM categories WHERE id = $1"
        const result = await pool.query(query, [id])

        return (result.rowCount ?? 0) > 0
    }
}