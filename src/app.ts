import express from "express";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.route.js";

const app = express();
app.use(express.json());

app.use("/api", userRoutes);
app.use("/api", productRoutes);

export default app;
