import { Router } from "express";
import { USER_ROLE } from "../constants/user-role.constant.js";
import { adminCategoryController } from "../controllers/admin-category.controller.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.js";
import { createCategorySchema, getCategoriesCursorQuerySchema, updateCategorySchema } from "../validations/category.validation.js";
import { idParamSchema } from "../validations/param.validation.js";

const router = Router()
    router.get("/", validate({ query: getCategoriesCursorQuerySchema }), authenticate, authorizeRoles(USER_ROLE.ADMIN), adminCategoryController.getAllCursor)
    router.get("/:id", validate({ params: idParamSchema }), authenticate, authorizeRoles(USER_ROLE.ADMIN),  adminCategoryController.getById)

    router.post("/", validate({body: createCategorySchema}), authenticate, authorizeRoles(USER_ROLE.ADMIN),  adminCategoryController.create)
    router.patch("/:id", validate({ params: idParamSchema, body: updateCategorySchema }), authenticate, authorizeRoles(USER_ROLE.ADMIN), adminCategoryController.updateById)
    router.delete("/:id", validate({ params: idParamSchema }), authenticate, authorizeRoles(USER_ROLE.ADMIN), adminCategoryController.deleteById)

export default router 