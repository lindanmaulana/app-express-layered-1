import type { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { adminCategoryService } from "../services/admin-category.service.js"
import { sendResponse } from "../utils/response.util.js"
import type { CreateCategoryDTO, UpdateCategoryDTO } from "../validations/category.validation.js"

export const adminCategoryController = {
    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id)

            const result = await adminCategoryService.getById(id)

            sendResponse(res, StatusCodes.OK, "Berhasil memuat detail kategori", result)
        } catch (err) {
            next(err)
        }
    },

    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload: CreateCategoryDTO = req.body
            const result = await adminCategoryService.create(payload)

            sendResponse(res, StatusCodes.CREATED, "Berhasil menambahkan kategori baru", result)
        } catch (err) {
            next(err)
        }
    },

    updateById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id)
            const payload = req.body as UpdateCategoryDTO
            await adminCategoryService.updateById(id, payload)

            sendResponse(res, StatusCodes.OK, "Berhasil memperbarui kategori")
        } catch (err) {
            next(err)
        }
    },

    deleteById: async ( req: Request, res: Response, next: NextFunction ) => {
        try {
            const id = Number(req.params.id)
            await adminCategoryService.deleteById(id)

            sendResponse(res, StatusCodes.OK, "Berhasil menghapus kategori")
        } catch (err) {
            next(err)
        }
    }
}