import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type {
  GetByIdUserDTO,
} from "../models/user.model.js";
import { userService } from "../services/user.service.js";
import type { JwtPayload } from "../types/jwt.type.js";
import { getAuthUser } from "../utils/auth-user.util.js";
import { sendResponse } from "../utils/response.util.js";
import type { UpdateProfileUserDTO } from "../validations/user.validation.js";

export const userController = {
  getById: async (req: Request, res: Response) => {
    const { id }: GetByIdUserDTO = { id: req.params.id as string };

    const user = await userService.getById(Number(id));

    res.json(user);
  },

  getProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = getAuthUser(req) as JwtPayload

      const result = await userService.getProfile(user.userId)

      sendResponse(res, StatusCodes.OK, "Profil pengguna berhasil dimuat", result)
    } catch (err) {
      next(err)
    }
  },

  updateProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = getAuthUser(req) as JwtPayload
      const payload: UpdateProfileUserDTO = req.body;

      const result = await userService.updateProfile(user.userId, payload);

      sendResponse(res, StatusCodes.OK, "Profile berhasil diperbarui", result)
    } catch (err) {
      next(err)
    }
  }
};
