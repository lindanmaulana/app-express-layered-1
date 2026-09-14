import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { categoryService } from "../services/category.service.js";
import { sendPaginationResponse, sendResponse } from "../utils/response.util.js";
import type { GetCategoriesCursorQueryDTO, GetCategoriesQueryDTO } from "../validations/category.validation.js";
import type { GetProductsQueryDTO } from "../validations/product.validation.js";

export const categoryController = {
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payloadQuery = req.parsedQuery as GetCategoriesQueryDTO
            const result = await categoryService.getAll(payloadQuery)

            sendPaginationResponse(res, StatusCodes.OK, "Berhasil memuat data kategori", result.data, result.meta)
        } catch (err) {
            next(err)
        }
    },

    getBySlug: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const slug = req.params.slug as string

            const result = await categoryService.getBySlug(slug)

            sendResponse(res, StatusCodes.OK, "Berhasil memuat detail kategori", result)
        } catch (err) {
            next(err)
        }
    },

    getByIdWithProducts: async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            const id = Number(req.params.id)
            const query = req.query as unknown as GetProductsQueryDTO

            const result = await categoryService.getByIdWithProducts(id, query)

            sendPaginationResponse(res, StatusCodes.OK, "Berhasil memuat detail kategori beserta produk", result.data, result.meta)
        } catch (err) {
            next(err)
        }
    }
};
