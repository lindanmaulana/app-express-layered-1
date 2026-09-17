import type { PoolClient } from "pg";
import pool from "../config/db.js";
import type { Seat, UpdateSeatData } from "../models/seat.model.js";

export const seatRepository = {
    findById: async (id: number): Promise<Seat | null> => {
        const query = "SELECT id, showtime_id, seat_number FROM seats WHERE id = $1"
        const values = [id]

        const result = await pool.query<Seat>(query, values)

        return result.rows[0] ?? null
    },

    findAllByShowtimeId: async (showtimeID: number): Promise<Seat[]> => {
        const query = "SELECT id, showtime_id, seat_number FROM seats WHERE showtime_id = $1 ORDER BY seat_number ASC"
        const values = [showtimeID]

        const result = await pool.query<Seat>(query, values)

        return result.rows
    },

    create: async () => {

    },

    createMany: async (showtimeID: number, seatNumbers: string[]): Promise<void> => {
        const query = "INSERT INTO seats (showtime_id, seat_number) SELECT $1, UNNEST($2::text[]) RETURNING id, showtime_id, seat_number, status"
        const values = [showtimeID, seatNumbers]

        const result = await pool.query<Seat>(query, values)
        const createdSeat = result.rows[0]

        if (!createdSeat) throw new Error("Gagal menambahkan kursi")
    },

    updateById: async (id: number, data: UpdateSeatData): Promise<boolean> => {
        const query = "UPDATE seats SET seat_number = COALESCE($1, seat_number), status = COALESCE($2, status), updated_at = NOW() WHERE id = $3"
        const values = [id, data.seat_number ?? null, data.status ?? null]

        const result = await pool.query(query, values)

        return (result.rowCount ?? 0) > 0
    },

    createManyWithTrx: async (showtimeID: number, seatNumbers: string[], client: PoolClient): Promise<void> => {
        const query = "INSERT INTO seats (showtime_id, seat_number) SELECT $1, UNNEST($2::text[]) RETURNING id"
        const values = [showtimeID, seatNumbers]

        const result = await client.query(query, values)

        const createdSeats = result.rows[0]
        if (!createdSeats) throw new Error("Gagal menambahkan kursi baru")
    },
}