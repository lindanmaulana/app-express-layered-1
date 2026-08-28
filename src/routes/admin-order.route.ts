import { Router } from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.js";
import { USER_ROLE } from "../constants/user-role.constant.js";
import { adminOrderController } from "../controllers/admin-order.controller.js";


const router = Router()

    router.get("/", authenticate, authorizeRoles(USER_ROLE.ADMIN), adminOrderController.getAll)
    router.patch("/:id/status", authenticate, authorizeRoles(USER_ROLE.ADMIN), adminOrderController.updateStatusById)

export default router