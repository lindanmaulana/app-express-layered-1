import {Router} from "express"
import { validate } from "../middlewares/validate.js"
import { createOrderSchema } from "../validations/order.validation.js"
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.js"
import { USER_ROLE } from "../constants/user-role.constant.js"
import { orderPlayGroundController } from "../controllers/order-playground.controller.js"

const router = Router()

    router.post("/committed-read", validate({body: createOrderSchema}), authenticate, authorizeRoles(USER_ROLE.USER), orderPlayGroundController.createWithCommittedRead)
    router.post("/repeatable-read", validate({ body: createOrderSchema }), authenticate, authorizeRoles(USER_ROLE.USER), orderPlayGroundController.createWithRepeatableRead)
    router.post("/serializable", validate({ body:createOrderSchema }), authenticate, authorizeRoles(USER_ROLE.USER), orderPlayGroundController.createWithSerializable)

export default router