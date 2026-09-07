import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { getShowtimesQuerySchema } from "../validations/showtime.validation.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.js";
import { USER_ROLE } from "../constants/user-role.constant.js";
import { showtimeController } from "../controllers/showtime.controller.js";
import { idParamSchema } from "../validations/param.validation.js";

const router = Router()

    router.get("/", validate({ query: getShowtimesQuerySchema }), authenticate, authorizeRoles(USER_ROLE.ADMIN, USER_ROLE.USER), showtimeController.getAll)
    router.get("/:id", validate({ params: idParamSchema }), authenticate, authorizeRoles(USER_ROLE.ADMIN, USER_ROLE.USER), showtimeController.getById)

export default router