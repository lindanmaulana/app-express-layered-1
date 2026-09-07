import type { Request, Response, NextFunction } from "express";
import type { CreateShowtimeDTO, UpdateShowtimeDTO } from "../validations/showtime.validation.js";
import { adminShowtimeService } from "../services/admin-showtime.service.js";
import { sendResponse } from "../utils/response.util.js";
import { StatusCodes } from "http-status-codes";

export const adminShowtimeController = {
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const payload = req.body as CreateShowtimeDTO

            const result = await adminShowtimeService.create(payload)

            sendResponse(res, StatusCodes.CREATED, "Berhasil membuat judul film baru", result)
        } catch (err) {
            next(err)
        }
    },

    updateById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id)
            const payload = req.body as UpdateShowtimeDTO

            await adminShowtimeService.updateById(id, payload)

            sendResponse(res, StatusCodes.OK, "Berhasil memperbarui film")
        } catch (err) {
            next(err)
        }
    },

    deleteById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id)
            
            const result = await adminShowtimeService.deleteById(id)

            sendResponse(res, StatusCodes.OK, "Berhasil menghapus film", result)
        } catch (err) {
            next(err)
        }
    }
}