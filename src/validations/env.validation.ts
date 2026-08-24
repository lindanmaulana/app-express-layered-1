import z from "zod";
import { JWT_DEFAULT } from "../constants/jwt.constant.js";

export const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    APP_PORT: z.coerce.number("Port tidak valid").int("Port harus berupa bilangan bulat").positive("Port tidak boleh negatif"),
    
    DB_USER: z.string("DB User tidak valid").min(1, "DB User tidak boleh kosong"),
    DB_HOST: z.string("DB Host tidak valid").min(1, "DB Host tidak boleh kosong"),
    DB_NAME: z.string("DB Name tidak valid").min(1, "DB Name tidak boleh kosong"),
    DB_PASSWORD: z.string("DB Password tidak valid").min(1, "DB Password tidak boleh kosong"),
    DB_PORT: z.coerce.number("DB Port tidak valid").min(1, "DB Port tidak boleh kosong"),

    PASSWORD_SALT_ROUNDS: z.coerce.number("Password salt rounds harus berupa angka").int("Password salt rounds harus bilangan bulat").min(8, "Password salt rounds minimal 8 demi keamanan").max(14, "Password salt rounds maksimal 14 agar tidak membebani server").default(10),

    JWT_ACCESS_TOKEN: z.string("JWT ACCESS TOKEN tidak valid").min(32, "JWT ACCESS TOKEN minimal 32 karakter demi keamanan"),
    JWT_REFRESH_TOKEN: z.string("JWT REFRESH TOKEN tidak valid").min(32, "JWT REFRESH TOKEN minimal 32 karakter demi keamanan"),
    JWT_ACCESS_EXPIRES_IN: z.string("JWT ACCESS EXPIRES IN tidak valid").default(JWT_DEFAULT.ACCESS_EXPIRES_IN),
    JWT_REFRESH_EXPIRES_IN: z.string("JWT REFRESH EXPIRES IN tidak valid").default(JWT_DEFAULT.REFRESH_EXPIRES_IN)
})


export type EnvConfig = z.infer<typeof envSchema>