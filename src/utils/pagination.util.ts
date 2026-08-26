import type { PaginationOptions, PaginationQuery } from "../types/api.type.js";

export const parsePagination = (query: PaginationQuery): PaginationOptions => {
    const page = Math.max(1, Number(query.page) || 1)
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10))

    const skip = (page - 1) * limit
    const take = limit

    return {page, limit, skip, take}
}