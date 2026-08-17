import { Pool } from "pg";
import env from "./env.js";

const pool = new Pool({
  user: env.db.user,
  host: env.db.host,
  database: env.db.name,
  password: env.db.password,
  port: Number(env.db.port),
});

export default pool;
