import { ConflictError } from "../errors/conflict.js";
import { InternalServerError } from "../errors/internal-server.js";
import { NotFoundError } from "../errors/not-found.js";
import type { CategoryResponse, cursorPaginatedCategoriesResponse } from "../models/category.model.js";
import { categoryRepository } from "../repositories/category.repository.js";
import { parseCursorPagination } from "../utils/pagination.util.js";
import type { CreateCategoryDTO, GetCategoriesCursorQueryDTO, UpdateCategoryDTO } from "../validations/category.validation.js";


export const adminCategoryService = {
    getAllCursor: async (query: GetCategoriesCursorQueryDTO): Promise<cursorPaginatedCategoriesResponse> => {
        const {limit, cursor} = parseCursorPagination(query)
        const fetchLimit = limit + 1

        const safeCursor = query.search ? undefined : cursor
        const categories = await categoryRepository.findAllCursor({ ...query, cursor: safeCursor, limit: fetchLimit })

        let hashNextPage: boolean = false
        let nextCursor: string | number | null = null
    
        if (categories.length > limit) {
            hashNextPage = true
            categories.pop()
    
            const lastItem = categories[categories.length - 1]
            nextCursor = lastItem ? lastItem.id : null
        }
    
        return {
            data: categories,
            meta: {
                limit: limit,
                hasNextPage: hashNextPage,
                nextCursor: nextCursor
            }
        }
    },

    getById: async (id: number): Promise<CategoryResponse> => {
        const result = await categoryRepository.findById(id)
        if (!result) throw new NotFoundError("Kategori tidak ditemukan")

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
    },

    deleteById: async (id: number): Promise<void> => {
        const category = await categoryRepository.findById(id)
        if (!category) throw new NotFoundError("Kategori tidak ditemukan")
        
        const result = await categoryRepository.deleteById(id)
        if (!result) throw new InternalServerError("Gagal mengahapus kategori, silahkan coba lagi")
    }
}