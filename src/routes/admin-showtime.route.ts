import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { createShowtimeSchema, updateShowtimeSchema } from "../validations/showtime.validation.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.js";
import { USER_ROLE } from "../constants/user-role.constant.js";
import { adminShowtimeController } from "../controllers/admin-showtime.controller.js";
import { idParamSchema } from "../validations/param.validation.js";

const router = Router()

    router.post("/", validate({ body: createShowtimeSchema }), authenticate, authorizeRoles(USER_ROLE.ADMIN), adminShowtimeController.create)
    
    router.patch("/:id", validate({ params: idParamSchema, body: updateShowtimeSchema }), authenticate, authorizeRoles(USER_ROLE.ADMIN), adminShowtimeController.updateById)
    router.delete("/:id", validate({ params: idParamSchema }), authenticate, authorizeRoles(USER_ROLE.ADMIN), adminShowtimeController.deleteById)

export default router