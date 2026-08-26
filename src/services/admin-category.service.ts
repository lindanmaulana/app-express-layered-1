import { ConflictError } from "../errors/conflict.js";
import { InternalServerError } from "../errors/internal-server.js";
import { NotFoundError } from "../errors/not-found.js";
import type { CategoryResponse } from "../models/category.model.js";
import { categoryRepository } from "../repositories/category.repository.js";
import type { CreateCategoryDTO, UpdateCategoryDTO } from "../validations/category.validation.js";


export const adminCategoryService = {
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