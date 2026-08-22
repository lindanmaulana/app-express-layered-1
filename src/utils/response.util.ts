import type { ApiPaginationResponse, ApiResponse, PaginationMeta } from "../types/api.type.js";
import type { Response } from "express"

export const sendResponse = <T>(res: Response, statusCode: number, message: string, data?: T): Response<ApiResponse<T>> => {
    return res.status(statusCode).json({
        success: true,
        message: message,
        ...(data !== undefined && { data: data })
    })
}


export const sendPaginationResponse = <T>(res: Response, statusCode: number, message: string, data: T[], meta: PaginationMeta): Response<ApiPaginationResponse<T>> => {
    return res.status(statusCode).json({
        success: true,
        message: message,
        data: data,
        meta: meta
    })
}