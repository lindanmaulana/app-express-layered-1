import type { CursorPaginationQuery, OpaqueCursor, CursorPaginationOptions, CursorPaginationOptions2, CursorPaginationQuery2, PaginationOptions, PaginationQuery  } from "../types/pagination.type.js";

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


export const parseCursorPagination2 = (query: CursorPaginationQuery2): CursorPaginationOptions2 => {
    const limit = Math.min(100, Math.max(1, query.limit || 10))

    const cursor = decodeOpaqueCursor(query.cursor)

    return { cursor, limit: limit }
}


export const encodeOpaqueCursor = (data: OpaqueCursor): string => {
    const rawCursorString = JSON.stringify(data)
    const encodeCursor = Buffer.from(rawCursorString).toString('base64')

    return encodeCursor
}

export const decodeOpaqueCursor = (cursor: string | undefined): OpaqueCursor | undefined => {
    if (!cursor) return;
    const decodeCursor = Buffer.from(cursor, 'base64').toString("utf-8")

    return JSON.parse(decodeCursor)
}