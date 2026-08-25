import pool from "../config/db.js";
import type {
  CreateUserData,
  GetUsersQueryData,
  UpdateUserData,
  User,
  UserFilterParams,
} from "../models/user.model.js";

export const userRepository = {
  buildWhereClause: (filter: UserFilterParams) => {
    const condition: string[] = []
    const values: (string | number | boolean)[] = []

    if (filter.search) {
      values.push(`%${filter.search}%`)
      condition.push(`name ILIKE $${values.length}`)
    }

    if (filter.role) {
      values.push(filter.role)
      condition.push(`role = $${values.length}`)
    }

    const whereSQL = condition.length > 0 ? `WHERE ${condition.join(" AND ")}` : ""

    return {whereSQL, values}
  },

  findAll: async (filter: UserFilterParams): Promise<User[]> => {
    const {whereSQL, values} = userRepository.buildWhereClause(filter)
    const queryValues = [...values]

    let paginationClause = ""
    if (filter.limit) {
      queryValues.push(filter.limit)
      paginationClause = ` LIMIT $${queryValues.length}`
    }

    if (filter.offset) {
      queryValues.push(filter.offset)
      paginationClause = ` OFFSET $${queryValues.length}`
    }

    const query = `SELECT id, name, email, role, created_at, updated_at FROM users ${whereSQL} ORDER BY id DESC ${paginationClause}`
    const result = await pool.query<User>(query, queryValues);

    return result.rows;
  },

  findById: async (id: number): Promise<User | null> => {
    const query = "SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = $1";
    const result = await pool.query<User>(query, [id]);

    console.log({result: result.rows[0]})

    return result.rows[0] ?? null;
  },

  findByEmail: async (email: string): Promise<User | null> => {
    const query = "SELECT id, name, email, password, role, created_at, updated_at FROM users WHERE email = $1";
    const result = await pool.query<User>(query, [email])

    return result.rows[0] ?? null
  },

  countAll: async (filter: UserFilterParams): Promise<number> => {
    const {whereSQL, values} = userRepository.buildWhereClause(filter)

    const query = `SELECT COUNT(id) AS total FROM users ${whereSQL}`
    const result = await pool.query(query, values)

    return parseInt(result.rows[0].total ?? 10)
  },

  existsByEmail: async (email: string): Promise<boolean> => {
    const query = "SELECT 1 FROM users WHERE email = $1";
    const result = await pool.query<User>(query, [email]);

    return (result.rowCount ?? 0) > 0;
  },

  create: async (dto: CreateUserData): Promise<User> => {
    const query = "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at, updated_at";
    const values = [dto.name, dto.email, dto.password, dto.role]

    const result = await pool.query<User>(query, values);

    const createdUser = result.rows[0];

    if (!createdUser) throw new Error("Gagal membuat user baru!");

    return createdUser;
  },

  updateById: async (id: number, dto: UpdateUserData): Promise<User | null> => {
    const query: string = "UPDATE users SET name = COALESCE($1, name), email = COALESCE($2, email), password = COALESCE($3, password), role = COALESCE($4, role) WHERE id = $5 RETURNING id, name, email, role, created_at, updated_at";
    const values: (string | number | null)[] = [dto.name ?? null, dto.email ?? null, dto.password ?? null, dto.role ?? null, id]
    const result = await pool.query<User>(query, values);

    return result.rows[0] ?? null;
  },

  deleteById: async (id: number): Promise<boolean> => {
    const query = "DELETE FROM users WHERE id = $1";

    const result = await pool.query<User>(query, [id]);

    return (result.rowCount ?? 0) > 0;
  },
};
