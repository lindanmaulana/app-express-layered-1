import "dotenv/config";

const env = {
  db: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    name: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
  },

  port: Number(process.env.APP_PORT),
};

export default env;
