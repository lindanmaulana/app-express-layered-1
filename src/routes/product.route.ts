import { Router } from "express";
import { productController } from "../controllers/product.controller.js";
import { validate } from "../middlewares/validate.js";
import { idParamSchema } from "../validations/param.validation.js";
import { createProductSchema, getProductsQuerySchema, reduceStockProductSchema, restockProductSchema } from "../validations/product.validation.js";

const router = Router();

// router.param("id", validateIdParam)

router.get("/products",  validate({ query: getProductsQuerySchema }), productController.getAll);
router.get("/products/low-stock", productController.getLowStock);
router.get("/products/high-stock", productController.getHighStock);
router.post("/products", validate({ body: createProductSchema }), productController.create);

router.patch("/products/bulk/restock", productController.bulkRestock);
router.delete("/products/bulk", productController.bulkDelete);

router.get("/products/:id", validate({ params: idParamSchema }), productController.getById);
router.patch("/products/:id", validate({ params: idParamSchema }), productController.updateById);
router.patch("/products/:id/change-price", validate({ params: idParamSchema }), productController.changePrice);
router.patch("/products/:id/restock", validate({ params: idParamSchema, body: restockProductSchema }), productController.restock);
router.patch("/products/:id/reduce-stock",validate({ params: idParamSchema, body: reduceStockProductSchema }) , productController.reduceStock);
router.delete("/products/:id", validate({ params: idParamSchema }), productController.deleteById);

export default router;
