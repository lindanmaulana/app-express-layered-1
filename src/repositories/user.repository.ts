import pool from "../config/db.js";
import type {
  CreateUserDTO,
  UpdateUserDTO,
  User,
} from "../models/user.model.js";

export const userRepository = {
  findAll: async (): Promise<User[]> => {
    const result = await pool.query<User>("SELECT * FROM users");

    return result.rows;
  },

  findById: async (id: number): Promise<User | null> => {
    const query = "SELECT * FROM users WHERE id = $1";
    const result = await pool.query<User>(query, [id]);

    return result.rows[0] ?? null;
  },

  existsByEmail: async (email: string): Promise<boolean> => {
    const query = "SELECT 1 FROM users WHERE email = $1";
    const result = await pool.query<User>(query, [email]);

    return (result.rowCount ?? 0) > 0;
  },

  create: async (dto: CreateUserDTO): Promise<User> => {
    const query = "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *";
    const result = await pool.query<User>(query, [dto.name, dto.email]);

    const createdUser = result.rows[0];

    if (!createdUser) throw new Error("Gagal membuat user baru!");

    return createdUser;
  },

  updateById: async (id: number, dto: UpdateUserDTO): Promise<User | null> => {
    const query =
      "UPDATE users SET name = COALESCE($1, name) WHERE id = $2 RETURNING *";
    const result = await pool.query<User>(query, [dto.name ?? null, id]);

    return result.rows[0] ?? null;
  },

  deleteById: async (id: number): Promise<boolean> => {
    const query = "DELETE FROM users WHERE id = $1";

    const result = await pool.query<User>(query, [id]);

    return (result.rowCount ?? 0) > 0;
  },
};
