import { Router } from "express";
import { userController } from "../controllers/user.controller.js";

const router = Router();

router.get("/users", userController.getAll);
router.post("/users", userController.create);

router.get("/users/:id", userController.getById);
router.patch("/users/:id", userController.update);
router.delete("/users/:id", userController.delete);

export default router;
