import { Router } from "express";
import { productController } from "../controllers/product.controller.js";
import { validate } from "../middlewares/validate.js";
import { idParamSchema } from "../validations/param.validation.js";
import { createProductSchema, getProductsQuerySchema, reduceStockProductSchema, restockProductSchema } from "../validations/product.validation.js";

const router = Router();

// router.param("id", validateIdParam)

router.get("/",  validate({ query: getProductsQuerySchema }), productController.getAll);
router.post("/", validate({ body: createProductSchema }), productController.create);
router.get("/low-stock", productController.getLowStock);
router.get("/high-stock", productController.getHighStock);

router.patch("/bulk/restock", productController.bulkRestock);
router.delete("/bulk", productController.bulkDelete);

router.get("/:id", validate({ params: idParamSchema }), productController.getById);
router.patch("/:id", validate({ params: idParamSchema }), productController.updateById);
router.patch("/:id/change-price", validate({ params: idParamSchema }), productController.changePrice);
router.patch("/:id/restock", validate({ params: idParamSchema, body: restockProductSchema }), productController.restock);
router.patch("/:id/reduce-stock",validate({ params: idParamSchema, body: reduceStockProductSchema }) , productController.reduceStock);
router.delete("/:id", validate({ params: idParamSchema }), productController.deleteById);

export default router;
