import { Router } from "express";
import productRoutes from "./product.route.js"
import userRoutes from "./user.routes.js"
import authRoutes from "./auth.route.js"

import adminUserRoutes from "./admin-user.route.js"

const apiRouter = Router()

    apiRouter.use("/admin/users", adminUserRoutes)

    apiRouter.use("/auth", authRoutes)
    apiRouter.use("/products", productRoutes)
    apiRouter.use("/users", userRoutes)

export default apiRouter