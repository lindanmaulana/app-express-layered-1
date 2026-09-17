import { NotFoundError } from "../errors/not-found.js";
import type { Seat } from "../models/seat.model.js";
import { seatRepository } from "../repositories/seat.repository.js";
import { showtimeRepository } from "../repositories/showtime.repository.js";

export const seatService = {
    getAllByShowtimeId: async (showtimeID: number): Promise<Seat[]> => {
        const showtime = await showtimeRepository.findById(showtimeID)
        if (!showtime) throw new NotFoundError(`Film dengan ID ${showtimeID} tidak ditemukan`)

        const result = await seatRepository.findAllByShowtimeId(showtime.id)

        return result
    }
}