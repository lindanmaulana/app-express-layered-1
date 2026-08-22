import express from "express";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.route.js";
import { errorHandler } from "./middlewares/error-handler.js";
import { notfoundHandler } from "./middlewares/not-found.js";

const app = express();
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", productRoutes);

app.use(notfoundHandler);
app.use(errorHandler);

export default app;
