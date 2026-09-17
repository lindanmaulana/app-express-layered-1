import type { Request, Response, NextFunction } from "express";
import { seatService } from "../services/seat.service.js";
import { sendResponse } from "../utils/response.util.js";
import { StatusCodes } from "http-status-codes";

export const seatController = {
    getAllByShowtimeId: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const showtimeID = Number(req.params.showtimeId)
            const result = await seatService.getAllByShowtimeId(showtimeID)

            sendResponse(res, StatusCodes.OK, "Berhasil memuat data kursi", result)
        } catch (err) {
            next(err)
        }
    }
}