import { Router } from "express";

import authRoutes from "./auth.route.js";
import categoryRoutes from "./category.route.js";
import productRoutes from "./product.route.js";
import userRoutes from "./user.routes.js";
import orderRoutes from "./order.route.js";
import orderItemRoutes from "./order-item.route.js"
import showtimeRoutes from "./showtime.route.js"

import adminCategoryRoutes from "./admin-category.route.js";
import adminProductRoutes from "./admin-product.route.js";
import adminUserRoutes from "./admin-user.route.js";
import adminOrderRoutes from "./admin-order.route.js";
import adminOrderItemRoutes from "./admin-order-item.route.js"
import adminShowtimeRoutes from "./admin-showtime.route.js"

import orderPlaygroundRoutes from "./order-playground.route.js"

const apiRouter = Router()

    apiRouter.use("/admin/users", adminUserRoutes)
    apiRouter.use("/admin/categories", adminCategoryRoutes)
    apiRouter.use("/admin/products", adminProductRoutes)
    apiRouter.use("/admin/orders", adminOrderRoutes)
    apiRouter.use("/admin/order-items", adminOrderItemRoutes)
    apiRouter.use("/admin/showtimes", adminShowtimeRoutes)

    apiRouter.use("/auth", authRoutes)
    apiRouter.use("/users", userRoutes)
    apiRouter.use("/categories", categoryRoutes)
    apiRouter.use("/products", productRoutes)
    apiRouter.use("/orders", orderRoutes)
    apiRouter.use("/order-items", orderItemRoutes)
    apiRouter.use("/showtimes", showtimeRoutes)


    apiRouter.use("/order-playgrounds", orderPlaygroundRoutes)
    
export default apiRouter