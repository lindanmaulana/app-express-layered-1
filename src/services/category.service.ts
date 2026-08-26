import pool from "../config/db.js";
import { ConflictError } from "../errors/conflict.js";
import { InternalServerError } from "../errors/internal-server.js";
import { NotFoundError } from "../errors/not-found.js";
import type { CategoryResponse, paginatedCategoriesResult } from "../models/category.model.js";
import { categoryRepository } from "../repositories/category.repository.js";
import { parsePagination } from "../utils/pagination.util.js";
import type { CreateCategoryDTO, GetCategoriesQueryDTO, UpdateCategoryDTO } from "../validations/category.validation.js";

export const categoryService = {
    getAll: async (query: GetCategoriesQueryDTO): Promise<paginatedCategoriesResult> => {
        const {page, limit, skip} = parsePagination(query)

        const [categories, totalData] = await Promise.all([categoryRepository.findAll({search: query.search, limit, offset: skip}), categoryRepository.countAll({search: query.search, limit, offset: skip})])
        const totalPages = Math.ceil(totalData / limit)

        return {
            data: categories,
            meta: {
                page: page,
                limit: limit,
                totalData: totalData,
                totalPages: totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        }
    },

    getById: async (id: number): Promise<CategoryResponse> => {
        const result = await categoryRepository.findById(id)
        if (!result) throw new NotFoundError("Kategori tidak ditemukan")

        return result
    },

    getBySlug: async (slug: string): Promise<CategoryResponse> => {
        const result = await categoryRepository.findBySlug(slug)
        if (!result) throw new NotFoundError(`Kategori dengan slug ${slug} tidak ditemukan`)

        return result
    },

    create: async (dto: CreateCategoryDTO): Promise<CategoryResponse> => {
        const slugExists = await categoryRepository.existsBySlug(dto.slug)
        if (slugExists) throw new ConflictError(`Kategori dengan Slug ${dto.slug} sudah terdaftar`)

        const result = await categoryRepository.create(dto)

        return result
    },

    updateById: async (id: number, dto: UpdateCategoryDTO): Promise<void> => {
        const category = await categoryRepository.findById(id)
        if (!category) throw new NotFoundError("Kategori tidak ditemukan")

        if (dto.slug) {
            const isSlugExists = await categoryRepository.existsBySlugExludeId(category.id, dto.slug)
            if (isSlugExists) throw new ConflictError(`Kategori dengan slug ${dto.slug} sudah terdaftar`)
        }

        const result = await categoryRepository.update(category.id, dto)
        if (!result) throw new InternalServerError("Gagal memperbarui kategori, silahkan coba lagi")
    }
}