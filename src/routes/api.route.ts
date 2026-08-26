import { Router } from "express";
import authRoutes from "./auth.route.js"
import userRoutes from "./user.routes.js"
import categoryRoutes from "./category.route.js"
import productRoutes from "./product.route.js"

import adminUserRoutes from "./admin-user.route.js"
import adminCategoryRoutes from "./admin-category.route.js"

const apiRouter = Router()

    apiRouter.use("/admin/users", adminUserRoutes)
    apiRouter.use("/admin/categories", adminCategoryRoutes)

    apiRouter.use("/auth", authRoutes)
    apiRouter.use("/users", userRoutes)
    apiRouter.use("/categories", categoryRoutes)
    apiRouter.use("/products", productRoutes)

export default apiRouter