import express from "express";
import cookieParser from "cookie-parser"
import apiRoutes from "./routes/api.route.js"
import { errorHandler } from "./middlewares/error-handler.js";
import { notfoundHandler } from "./middlewares/not-found.js";

const app = express();
app.use(express.json());
app.use(cookieParser())

app.use("/api/v1", apiRoutes);

app.use(notfoundHandler);
app.use(errorHandler);

export default app;
