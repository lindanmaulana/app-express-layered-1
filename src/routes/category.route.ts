import { Router } from "express";
import { USER_ROLE } from "../constants/user-role.constant.js";
import { categoryController } from "../controllers/category.controller.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.js";
import { getCategoriesQuerySchema } from "../validations/category.validation.js";
import { slugParamSchema } from "../validations/param.validation.js";

const router = Router()

    router.get("/", authenticate, authorizeRoles(USER_ROLE.ADMIN, USER_ROLE.USER), validate({ query: getCategoriesQuerySchema }), categoryController.getAll)
    router.get("/:slug", authenticate, authorizeRoles(USER_ROLE.ADMIN, USER_ROLE.USER), validate({ params: slugParamSchema }), categoryController.getBySlug)

export default router