import type { SortableColumns } from "../constants/category.constant.js"
import type { PaginationMeta, PaginationQuery } from "../types/api.type.js"
import type { ProductResponse } from "./product.model.js"

export type Category = {
    id: number
    name: string
    slug: string
    created_at: Date
    updated_at: Date
}

export type CategoryResponse = Category

export type GetCategoriesQueryData = PaginationQuery & {
    search?: string | undefined
    sortBy?: SortableColumns | undefined
}

export type CategoryFilterParams = Omit<GetCategoriesQueryData, "page"> & { offset?: number }
export type paginatedCategoriesResult = {
    data: Category[],
    meta: PaginationMeta
}

export type GetCategoryByIdWithProductsResponse = {
    data: {
        category: Category,
        products: ProductResponse[]
    },

    meta: PaginationMeta
}

export type CreateCategoryData = Pick<Category, "name" | "slug">

export type UpdateCategoryData = {
    [K in keyof CreateCategoryData]?: Category[K] | undefined
}