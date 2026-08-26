import { Router } from "express";
import { USER_ROLE } from "../constants/user-role.constant.js";
import { adminCategoryController } from "../controllers/admin-category.controller.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.js";
import { createCategorySchema, updateCategorySchema } from "../validations/category.validation.js";
import { idParamSchema } from "../validations/param.validation.js";

const router = Router()
    router.get("/:id", authenticate, authorizeRoles(USER_ROLE.ADMIN), validate({ params: idParamSchema }), adminCategoryController.getById)

    router.post("/", authenticate, authorizeRoles(USER_ROLE.ADMIN), validate({body: createCategorySchema}), adminCategoryController.create)
    router.patch("/:id", authenticate, authorizeRoles(USER_ROLE.ADMIN), validate({ params: idParamSchema, body: updateCategorySchema }), adminCategoryController.updateById)

export default router 