import { Router } from "express";
import { USER_ROLE } from "../constants/user-role.constant.js";
import { productController } from "../controllers/product.controller.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.js";
import { idParamSchema } from "../validations/param.validation.js";
import { createProductSchema, getProductsQuerySchema, reduceStockProductSchema, restockProductSchema } from "../validations/product.validation.js";

const router = Router();

router.get("/", authenticate,  validate({ query: getProductsQuerySchema }), productController.getAll);
router.get("/low-stock", productController.getLowStock);
router.get("/high-stock", productController.getHighStock);


export default router;
