import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { loginSchema, registerSchema } from "../validations/auth.validation.js";
import { authController } from "../controllers/auth.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";

const router = Router()

    router.post("/register", validate({body: registerSchema}), authController.register)
    router.post("/login", validate({body: loginSchema}), authController.login)
    router.post("/logout", authorize, authController.logout)
    router.post("/refresh-token", authorize, authController.refreshAccessToken)

export default router