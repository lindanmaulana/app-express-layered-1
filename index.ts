import app from "./src/app";
import pool from "./src/config/db";
import { env } from "./src/config/env";

async function startServer() {
  try {
    await pool.query("SELECT NOW()");

    console.log("DB Connected");

    app.listen(env.APP_PORT, () => {
      console.log("Server running on port: ", env.APP_PORT);
    });
  } catch (err) {
    console.error(err);
    console.error("Database connection failed!");
  }
}

startServer();
