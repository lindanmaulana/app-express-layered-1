import app from "./src/app";
import pool from "./src/config/db";
import env from "./src/config/env";

async function startServer() {
  try {
    await pool.query("SELECT NOW()");

    console.log("DB Connected");

    app.listen(env.port, () => {
      console.log("Server running on port: ", env.port);
    });
  } catch (err) {
    console.error(err);
    console.error("Database connection failed!");
  }
}

startServer();