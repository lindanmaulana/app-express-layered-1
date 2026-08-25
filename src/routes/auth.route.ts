import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { authenticateRefresh } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.js";
import { loginSchema, registerSchema } from "../validations/auth.validation.js";

const router = Router()

    router.post("/register", validate({body: registerSchema}), authController.register)
    router.post("/login", validate({body: loginSchema}), authController.login)
    router.post("/logout", authenticateRefresh, authController.logout)
    router.post("/refresh-token", authenticateRefresh, authController.refreshAccessToken)

export default router