import type { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { adminOrderService } from "../services/admin-order.service.js"
import { sendPaginationResponse, sendResponse } from "../utils/response.util.js"
import type { GetOrdersQueryDTO, UpdateStatusOrderDTO } from "../validations/order.validation.js"

export const adminOrderController = {
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const query = req.query as unknown as GetOrdersQueryDTO
            const result = await adminOrderService.getAll(query)

            sendPaginationResponse(res, StatusCodes.OK, "Berhasil memuat data pesanan", result.data, result.meta)
        } catch (err) {
            next(err)
        }
    },

    updateStatusById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id)
            const payload: UpdateStatusOrderDTO = req.body
            await adminOrderService.updateStatusById(id, payload)

            sendResponse(res, StatusCodes.OK, "Berhasil memperbarui status pesanan")
        } catch (err) {
            next(err)
        }
    }
}