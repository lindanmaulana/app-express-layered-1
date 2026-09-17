import type { Request, Response, NextFunction } from "express";
import type { GetShowtimesQueryDTO } from "../validations/showtime.validation.js";
import { showtimeService } from "../services/showtime.service.js";
import { sendPaginationResponse, sendResponse } from "../utils/response.util.js";
import { StatusCodes } from "http-status-codes";

export const showtimeController = {
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.parsedQuery as GetShowtimesQueryDTO
            const result = await showtimeService.getAll(query)

            sendPaginationResponse(res, StatusCodes.OK, "Berhasil memuat data film", result.data, result.meta)
        } catch (err) {
            next(err)
        }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id)

            const result = await showtimeService.getById(id)

            sendResponse(res, StatusCodes.OK, "Berhasil memuat detail film", result)
        } catch (err) {
            next(err)
        }
    },

    getByIdWithSeats: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id)
            
            const result = await showtimeService.getByIdWithSeats(id)

            sendResponse(res, StatusCodes.OK, "Berhasil memuat detail film", result)
        } catch (err) {
            next(err)
        }
    },
}