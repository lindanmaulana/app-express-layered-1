import { Router } from "express";
import { USER_ROLE } from "../constants/user-role.constant.js";
import { orderController } from "../controllers/order.controller.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.js";
import { idParamSchema } from "../validations/param.validation.js";
import { createOrderSchema } from "../validations/order.validation.js";


const router = Router()

    router.get("/me", authenticate, authorizeRoles(USER_ROLE.USER), orderController.getMyOrders)
    router.post("/", authenticate, authorizeRoles(USER_ROLE.USER), orderController.create)
    router.post("/rll", authenticate, validate({ body: createOrderSchema }), authorizeRoles(USER_ROLE.USER), orderController.createWithLock)
    
    router.get("/:id", authenticate, validate({params: idParamSchema}), authorizeRoles(USER_ROLE.ADMIN, USER_ROLE.USER), orderController.getById)
    router.patch("/:id/cancel", validate({params: idParamSchema}), authenticate, authorizeRoles(USER_ROLE.ADMIN, USER_ROLE.USER), orderController.cancelOrder)

export default router