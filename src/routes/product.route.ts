import { Router } from "express";
import { productController } from "../controllers/product.controller.js";
import { validateIdParam } from "../middlewares/validate-id-param.js";

const router = Router();

router.param("id", validateIdParam)

router.get("/products", productController.getAll);
router.get("/products/low-stock", productController.getLowStock);
router.get("/products/high-stock", productController.getHighStock);
router.post("/products", productController.create);

router.patch("/products/bulk/restock", productController.bulkRestock);
router.delete("/products/bulk", productController.bulkDelete);

router.get("/products/:id", productController.getById);
router.patch("/products/:id", productController.updateById);
router.patch("/products/:id/change-price", productController.changePrice);
router.patch("/products/:id/restock", productController.restock);
router.patch("/products/:id/reduce-stock", productController.reduceStock);
router.delete("/products/:id", productController.deleteById);

export default router;
