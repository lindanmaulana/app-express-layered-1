import { NotFoundError } from "../errors/not-found.js";
import type { CategoryResponse, GetCategoryByIdWithProductsResponse, paginatedCategoriesResult } from "../models/category.model.js";
import { categoryRepository } from "../repositories/category.repository.js";
import { productRepository } from "../repositories/product.repository.js";
import { parsePagination } from "../utils/pagination.util.js";
import type { GetCategoriesQueryDTO } from "../validations/category.validation.js";
import type { GetProductsQueryDTO } from "../validations/product.validation.js";

export const categoryService = {
    getAll: async (query: GetCategoriesQueryDTO): Promise<paginatedCategoriesResult> => {
        const {page, limit, skip} = parsePagination(query)

        const [categories, totalData] = await Promise.all([categoryRepository.findAll({...query, search: query.search, limit, offset: skip}), categoryRepository.countAll({...query, search: query.search, limit, offset: skip})])
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

    getByIdWithProducts: async (id: number, query: GetProductsQueryDTO): Promise<GetCategoryByIdWithProductsResponse> => {
        const category = await categoryRepository.findById(id)
        if (!category) throw new NotFoundError("Kategori tidak ditemukan")

        const {page, limit, skip} = parsePagination(query)

        const [products, totalData] = await Promise.all([ productRepository.findAll({...query, limit, offset: skip, category_id: category.id}), productRepository.countAll({...query, limit, offset: skip, category_id: category.id}) ])
        const totalPages = Math.ceil(totalData / limit)

        return {
            data: {
                category: category,
                products: products
            },

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

    getBySlug: async (slug: string): Promise<CategoryResponse> => {
        const result = await categoryRepository.findBySlug(slug)
        if (!result) throw new NotFoundError(`Kategori dengan slug ${slug} tidak ditemukan`)

        return result
    },
}