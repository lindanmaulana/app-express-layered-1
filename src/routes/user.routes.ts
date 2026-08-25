import { Router } from "express";
import { userController } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/profile", authenticate, userController.getProfile)
router.patch("/profile", authenticate, userController.updateProfile)

router.get("/:id", userController.getById);

export default router;
