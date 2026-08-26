import type { Request, Response, NextFunction } from "express"
import type { CreateCategoryDTO, UpdateCategoryDTO } from "../validations/category.validation.js"
import { categoryService } from "../services/category.service.js"
import { sendResponse } from "../utils/response.util.js"
import { StatusCodes } from "http-status-codes"

export const adminCategoryController = {
    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id)

            const result = await categoryService.getById(id)

            sendResponse(res, StatusCodes.OK, "Berhasil memuat detail kategori", result)
        } catch (err) {
            next(err)
        }
    },

    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload: CreateCategoryDTO = req.body
            const result = await categoryService.create(payload)

            sendResponse(res, StatusCodes.CREATED, "Berhasil menambahkan kategori baru", result)
        } catch (err) {
            next(err)
        }
    },

    updateById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id)
            const payload = req.body as UpdateCategoryDTO
            const result = await categoryService.updateById(id, payload)

            sendResponse(res, StatusCodes.OK, "Berhasil memperbarui kategori")
        } catch (err) {
            next(err)
        }
    },
}