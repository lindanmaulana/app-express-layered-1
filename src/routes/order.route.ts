import { Router } from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.js";
import { USER_ROLE } from "../constants/user-role.constant.js";
import { orderController } from "../controllers/order.controller.js";


const router = Router()

    router.get("/me", authenticate, authorizeRoles(USER_ROLE.USER), orderController.getMyOrders)
    router.post("/", authenticate, authorizeRoles(USER_ROLE.USER), orderController.create)
    
    router.get("/:id", authenticate, authorizeRoles(USER_ROLE.ADMIN, USER_ROLE.USER), orderController.getById)
    router.patch("/:id/cancel", authenticate, authorizeRoles(USER_ROLE.ADMIN, USER_ROLE.USER), orderController.cancelOrder)

export default router