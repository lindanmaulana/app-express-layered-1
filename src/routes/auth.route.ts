import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { registerSchema } from "../validations/auth.validation.js";
import { authController } from "../controllers/auth.controller.js";

const router = Router()

    router.post("/register", validate({body: registerSchema}), authController.register)

export default router