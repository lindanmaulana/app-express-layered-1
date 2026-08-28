import type { Request, Response, NextFunction } from "express"
import { getAuthUser } from "../utils/auth-user.util.js"
import type { JwtPayload } from "../types/jwt.type.js"
import type { CreateOrderDTO, GetOrdersQueryDTO } from "../validations/order.validation.js"
import { orderService } from "../services/order.service.js"
import { sendPaginationResponse, sendResponse } from "../utils/response.util.js"
import { StatusCodes } from "http-status-codes"

export const orderController = {
    getMyOrders: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = getAuthUser(req) as JwtPayload
            const query = req.query as unknown as GetOrdersQueryDTO

            const result = await orderService.getMyOrders(user, query)

            sendPaginationResponse(res, StatusCodes.OK, "Berhasil memuat data pesanan", result.data, result.meta)
        } catch (err) {
            next(err)
        }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id)

            const result = await orderService.getById(id)

            sendResponse(res, StatusCodes.OK, "Berhasil memuat detail pesanan", result)
        } catch (err) {
            next(err)
        }
    },

    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = getAuthUser(req) as JwtPayload
            const payload = req.body as unknown as CreateOrderDTO

            const result = await orderService.create(user, payload)

            sendResponse(res, StatusCodes.OK, "Pesanan berhasil dibuat", result)
        } catch (err) {
            next(err)
        }
    },

    cancelOrder: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = getAuthUser(req) as JwtPayload
            const id = Number(req.params.id)

            await orderService.cancelOrder(user, id)

            sendResponse(res, StatusCodes.OK, "Pesanan berhasil dibatalkan")
        } catch (err) {
            next(err)
        }
    }
}