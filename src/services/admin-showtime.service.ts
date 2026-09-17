import pool from "../config/db.js";
import { ConflictError } from "../errors/conflict.js";
import { BadRequestError, InternalServerError, NotFoundError } from "../errors/index.js";
import type { ShowtimeResponse } from "../models/showtime.model.js";
import { seatRepository } from "../repositories/seat.repository.js";
import { showtimeRepository } from "../repositories/showtime.repository.js";
import { generateSeatShowtime } from "../utils/generate-seat-showtime.js";
import type { CreateShowtimeDTO, UpdateShowtimeDTO } from "../validations/showtime.validation.js";

export const adminShowtimeService = {
    // create: async (dto: CreateShowtimeDTO): Promise<ShowtimeResponse> => {
    //     const isStudioConflict = await showtimeRepository.existsByStudioNameAndBroadcastTime(dto.studio_name, dto.broadcast_time)
    //     if (isStudioConflict) throw new ConflictError(`Studio ${dto.studio_name} sedang digunakan pada rentang waktu tersebut.`)

    //     const result = await showtimeRepository.create(dto)

    //     return result
    // },

    create: async (dto: CreateShowtimeDTO): Promise<void> => {
        const isStudioConflict = await showtimeRepository.existsByStudioNameAndBroadcastTime(dto.studio_name, dto.broadcast_time)
        if (isStudioConflict) throw new ConflictError(`Studio ${dto.studio_name} sedang digunakan pada rentang waktu tersebut.`)

        const client = await pool.connect()
        try {
            await client.query('BEGIN')

            const showtime = await showtimeRepository.createWithTrx(dto, client)
            
            const seatsGenerated = generateSeatShowtime(5)
            if (!seatsGenerated) throw new BadRequestError("Nomor kursi tidak tergenerate")

            await seatRepository.createManyWithTrx(showtime.id, seatsGenerated, client)

            await client.query("COMMIT")
        } catch (err) {
            await client.query("ROLLBACK")

            throw err
        } finally {
            client.release()
        }
    },

    updateById: async (id: number, dto: UpdateShowtimeDTO): Promise<void> => {
        if (dto.movie_title === undefined && dto.studio_name === undefined && dto.broadcast_time === undefined) throw new BadRequestError("Perubahan data tidak valid")

        const client = await pool.connect()
        try {
            await client.query("BEGIN")

                const showtime = await showtimeRepository.findByIdWithTrxAndLock(id, client)
                if (!showtime) throw new NotFoundError(`Film dengan ID ${id} tidak ditemukan`)

                    const targetStudio = dto.studio_name ?? showtime.studio_name
                    const targetTime = dto.broadcast_time ?? showtime.broadcast_time

                    if (dto.studio_name !== undefined || dto.broadcast_time !== undefined) {
                        const isStudioConflict = await showtimeRepository.existsByStudioNameAndBroadcastTimeWithTrx(id, targetStudio, targetTime, client)
                        if (isStudioConflict) throw new ConflictError(`Studio ${dto.studio_name} sedang digunakan pada rentang waktu tersebut.`)
                    }

                const result = await showtimeRepository.updateWithTrx(showtime.id, { movie_title: dto.movie_title, studio_name: dto.studio_name, broadcast_time: dto.broadcast_time }, client)
                if (!result) throw new InternalServerError("Gagal memperbarui film, silahkan coba lagi")

            await client.query("COMMIT")
        } catch (err) {
            await client.query("ROLLBACK")

            throw err
        } finally {
            client.release()
        }
    },

    deleteById: async (id: number): Promise<ShowtimeResponse> => {
        const client = await pool.connect()

        try {
            await client.query("BEGIN")

                const showtime = await showtimeRepository.findByIdWithTrxAndLock(id, client)
                if (!showtime) throw new NotFoundError(`Film dengan ID ${id} tidak ditemukan`)

                const result = await showtimeRepository.deleteByIdWithTrx(id, client)
                if (!result) throw new InternalServerError("Gagal menghapus film, silahkan coba lagi")

            await client.query("COMMIT")
            
            return result
        } catch (err) {
            await client.query("ROLLBACK")

            throw err
        } finally {
            client.release()
        }
    }
}