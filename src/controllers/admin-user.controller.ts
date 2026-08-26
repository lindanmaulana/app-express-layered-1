import type { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { adminUserService } from "../services/admin-user.service.js"
import { sendPaginationResponse, sendResponse } from "../utils/response.util.js"
import type { ChangeUserRoleDTO } from "../validations/admin-user.validation.js"
import type { GetUsersQueryDTO } from "../validations/user.validation.js"

export const adminUserController = {
    getAll: async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const query = req.query as unknown as GetUsersQueryDTO
            const result = await adminUserService.getAll(query)

            sendPaginationResponse(res, StatusCodes.OK, "Berhasil memuat data pengguna", result.data, result.meta)
        } catch (err) {
            next(err)
        }
    },

    changeRole: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id)
            const payload: ChangeUserRoleDTO = req.body

            const result = await adminUserService.changeRole(id, payload)

            sendResponse(res, StatusCodes.OK, "Berhasil memperbarui role pengguna", result)
        } catch (err) {
            next(err)
        }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id)
            await adminUserService.deleteById(id)

            sendResponse(res, StatusCodes.OK, "Berhasil menghapus data pengguna")
        } catch (err) {
            next(err)
        }
    }
}