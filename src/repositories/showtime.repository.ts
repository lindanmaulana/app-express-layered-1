import type { PoolClient } from "pg";
import pool from "../config/db.js";
import type { CreateShowtimeData, Showtime, ShowtimeFilterParams, UpdateShotimeData } from "../models/showtime.model.js";
import type { SortType } from "../types/api.type.js";
import { SORTABLE_COLUMNS } from "../constants/showtime.constant.js";

export const showtimeRepository = {
    buildWhereClause: (filters: ShowtimeFilterParams): { whereSQL: string, values: (string | SortType | number)[] } => {
        let condition: string[] = []
        let values: (string | SortType | number)[] = []

        if (filters.search !== undefined) {
            values.push(`%${filters.search}%`)
            condition.push(`(movie_title ILIKE $${values.length} OR studio_name ILIKE $${values.length})`)
            // condition.push(`(movie_title ILIKE $${values.length})`)
        }

        if (filters.date !== undefined) {
            values.push(filters.date)
            condition.push(`broadcast_time = $${values.length}`)
        }

        if (filters.startDate !== undefined) {
            values.push(filters.startDate)
            condition.push(`broadcast_time >= $${values.length}`)
        }

        if (filters.endDate !== undefined) {
            values.push(filters.endDate)
            condition.push(`broadcast_time <= $${values.length}`)
        }

        const whereSQL = condition.length > 0 ? `WHERE ${condition.join(" AND ")}` : ""

        return { whereSQL, values }
    },

    findAll: async (filters: ShowtimeFilterParams): Promise<Showtime[]> => {
        const {whereSQL, values} = showtimeRepository.buildWhereClause(filters)
        const queryValues = [...values]

        const sortColumn: string = SORTABLE_COLUMNS[filters.sortBy as keyof typeof SORTABLE_COLUMNS ?? SORTABLE_COLUMNS.createdAt] ?? SORTABLE_COLUMNS.createdAt
        const sortOrder = filters.sortOrder?.toUpperCase() === "DESC" ? "DESC" : "ASC"
        let sortClause: string = `ORDER BY ${sortColumn} ${sortOrder}`

        let paginationClause = ''
        if (filters.limit) {
            queryValues.push(filters.limit)
            paginationClause += ` LIMIT $${queryValues.length}`
        }

        if (filters.offset) {
            queryValues.push(filters.offset)
            paginationClause += ` OFFSET $${queryValues.length}`
        }

        const query = `SELECT id, movie_title, studio_name, broadcast_time, created_at, updated_at FROM showtimes ${whereSQL} ${sortClause} ${paginationClause}`
        const result = await pool.query<Showtime>(query, queryValues)

        return result.rows
    },

    findById: async (id: number): Promise<Showtime | null> => {
        const query = "SELECT id, movie_title, studio_name, broadcast_time, created_at, updated_at FROM showtimes WHERE id = $1"
        const values = [id]

        const result = await pool.query<Showtime>(query, values)

        return result.rows[0] ?? null
    },

    countAll: async (filters: ShowtimeFilterParams) => {
        const { whereSQL, values } = showtimeRepository.buildWhereClause(filters)

        const query = `SELECT COUNT(id) AS total FROM showtimes ${ whereSQL }`
        const result = await pool.query(query, values)
        
        return parseInt(result.rows[0].total ?? "0", 10)
    },

    existsByStudioNameAndBroadcastTime: async (studioName: string, broadcastTime: string): Promise<boolean> => {
        const query = "SELECT 1 FROM showtimes WHERE studio_name = $1 AND broadcast_time = $2 LIMIT 1"
        const values = [studioName, broadcastTime]

        const result = await pool.query(query, values)

        return result.rows.length > 0
    },

    create: async (data: CreateShowtimeData): Promise<Showtime> => {
        const query = "INSERT INTO showtimes (movie_title, studio_name, broadcast_time) VALUES ($1, $2, $3) RETURNING id, movie_title, studio_name, broadcast_time, created_at, updated_at"
        const values = [data.movie_title, data.studio_name, data.broadcast_time]

        const result = await pool.query<Showtime>(query, values)
        const createdShowtime = result.rows[0]
        if (!createdShowtime) throw new Error("Gagal membuat judul film baru")

        return createdShowtime
    },

    existsByStudioNameAndBroadcastTimeWithTrx: async (id: number, studioName: string, broadcastTime: string, client: PoolClient): Promise<boolean> => {
        const query = "SELECT 1 FROM showtimes WHERE studio_name = $1 AND broadcast_time = $2 AND id != $3 LIMIT 1"
        const values = [studioName, broadcastTime, id]

        const result = await client.query(query, values)

        return result.rows.length > 0
    },

    createWithTrx: async (data: CreateShowtimeData, client: PoolClient): Promise<Showtime> => {
        const query = "INSERT INTO showtimes (movie_title, studio_name, broadcast_time) VALUES ($1, $2, $3) RETURNING id, movie_title, studio_name, broadcast_time, created_at, updated_at"
        const values = [data.movie_title, data.studio_name, data.broadcast_time]

        const result = await client.query<Showtime>(query, values)
        const createdShowtime = result.rows[0]

        if (!createdShowtime) throw new Error('Gagal membuat jadwal film baru')

        return createdShowtime
    },

    updateWithTrx: async (id: number, data: UpdateShotimeData, client: PoolClient): Promise<boolean> => {
        const query = "UPDATE showtimes SET movie_title = COALESCE($1, movie_title), studio_name = COALESCE($2, studio_name), broadcast_time = COALESCE($3, broadcast_time) WHERE id = $4"
        const values = [data.movie_title, data.studio_name, data.broadcast_time, id]

        const result = await client.query(query, values)

        return (result.rowCount ?? 0) > 0
    },

    deleteByIdWithTrx: async (id: number, client: PoolClient): Promise<Showtime | null> => {
        const query = "DELETE FROM showtimes WHERE id = $1 RETURNING id, movie_title, studio_name, broadcast_time, created_at, updated_at"
        const values = [id]

        const result = await client.query<Showtime>(query, values)

        return result.rows[0] ?? null
    },

    findByIdWithTrxAndLock: async (id: number, client: PoolClient): Promise<Showtime | null> => {
        const query = "SELECT id, movie_title, studio_name, broadcast_time, created_at, updated_at FROM showtimes WHERE id = $1 FOR UPDATE"
        const values = [id]

        const result = await client.query<Showtime>(query, values)

        return result.rows[0] ?? null
    },
}