import { Router } from "express";
import { adminProductController } from "../controllers/admin-product.controller.js";
import { validate } from "../middlewares/validate.js";
import { idParamSchema } from "../validations/param.validation.js";
import { authenticate, authorizeRoles } from "../middlewares/auth.middleware.js";
import { USER_ROLE } from "../constants/user-role.constant.js";
import { createProductSchema, reduceStockProductSchema, restockProductSchema } from "../validations/product.validation.js";

const router = Router()

    router.post("/", authenticate, authorizeRoles(USER_ROLE.ADMIN), validate({ body: createProductSchema }), adminProductController.create);
    router.patch("/bulk/restock", authenticate, authorizeRoles(USER_ROLE.ADMIN), adminProductController.bulkRestock);
    router.delete("/bulk", authenticate, authorizeRoles(USER_ROLE.ADMIN), adminProductController.bulkDelete);

    router.get("/:id", authenticate, authorizeRoles(USER_ROLE.ADMIN), validate({ params: idParamSchema }), adminProductController.getById);
    router.patch("/:id", authenticate, authorizeRoles(USER_ROLE.ADMIN), validate({ params: idParamSchema }), adminProductController.updateById);
    router.patch("/:id/change-price", authenticate, authorizeRoles(USER_ROLE.ADMIN), validate({ params: idParamSchema }), adminProductController.changePrice);
    router.patch("/:id/restock", authenticate, authorizeRoles(USER_ROLE.ADMIN), validate({ params: idParamSchema, body: restockProductSchema }), adminProductController.restock);
    router.patch("/:id/reduce-stock", authenticate, authorizeRoles(USER_ROLE.ADMIN), validate({ params: idParamSchema, body: reduceStockProductSchema }), adminProductController.reduceStock);
    router.delete("/:id", authenticate, authorizeRoles(USER_ROLE.ADMIN), validate({ params: idParamSchema }), adminProductController.deleteById);


export default router