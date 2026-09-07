import type { Request, Response, NextFunction } from "express"
import { getAuthUser } from "../utils/auth-user.util.js"
import type { JwtPayload } from "../types/jwt.type.js"
import type { CreateOrderDTO } from "../validations/order.validation.js"
import { orderPlaygroundService } from "../services/order-playground.service.js"
import { sendResponse } from "../utils/response.util.js"
import { StatusCodes } from "http-status-codes"

export const orderPlayGroundController = {
    createWithCommittedRead: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = getAuthUser(req) as JwtPayload
            const payload = req.body as CreateOrderDTO

            const result = await orderPlaygroundService.createWithCommitedRead(user, payload)

            sendResponse(res, StatusCodes.CREATED, "Pesana berhasil dibuat, ---- Committed Read", result)
        } catch (err) {
            next(err)
        }
    },

    createWithRepeatableRead: async (req: Request, res: Response, next: NextFunction) =>  {
        try {
            const user = getAuthUser(req) as JwtPayload
            const payload = req.body as CreateOrderDTO

            const result = await orderPlaygroundService.createWithRepeatableRead(user, payload)

            sendResponse(res, StatusCodes.CREATED, "Pesanan berhasil dibuat, ---- Repeatable Read", result)
        } catch (err) {
            next(err)
        }
    },

    createWithSerializable: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = getAuthUser(req) as JwtPayload
            const payload = req.body as CreateOrderDTO

            const result = await orderPlaygroundService.createWithSerializable(user, payload)

            sendResponse(res, StatusCodes.CREATED, "Pesanan berhasil dibuat, ---- Serializable", result)
        } catch (err) {
            next(err)
        }
    },

    createWithRepeatableAndLock: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = getAuthUser(req) as JwtPayload
            const payload = req.body as CreateOrderDTO

            const result = await orderPlaygroundService.createWithRepeatableReadAndLock(user, payload)

            sendResponse(res, StatusCodes.CREATED, "Pesanan berhasil dibuat, ---- Repeatable Read and Lock FOR UPDATE", result)
        } catch (err) {
            next(err)
        }
    }
}