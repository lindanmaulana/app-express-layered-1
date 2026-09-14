import type { CursorPaginationOptions, CursorPaginationQuery, PaginationOptions, PaginationQuery } from "../types/api.type.js";

export const parsePagination = (query: PaginationQuery): PaginationOptions => {
    const page = Math.max(1, Number(query.page) || 1)
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 10))


    const skip = (page - 1) * limit
    const take = limit

    return {page, limit, skip, take}
}


export const parseCursorPagination = (query: CursorPaginationQuery): CursorPaginationOptions => {
    const limit = Math.min(100, Math.max(1, query.limit || 10))

    return { cursor: query.cursor, limit: limit }
}