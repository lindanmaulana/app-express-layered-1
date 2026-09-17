import { NotFoundError } from "../errors/not-found.js";
import type { paginatedShowtimesResult, ShowtimeResponse, ShowtimeWithSeatsResponse } from "../models/showtime.model.js";
import { showtimeRepository } from "../repositories/showtime.repository.js";
import { parsePagination } from "../utils/pagination.util.js";
import { type GetShowtimesQueryDTO } from "../validations/showtime.validation.js";

export const showtimeService = {
    getAll: async (query: GetShowtimesQueryDTO): Promise<paginatedShowtimesResult> => {
        const { page, limit, skip } = parsePagination(query)

        const [showtimes, totalData] = await Promise.all([ await showtimeRepository.findAll({...query, limit, offset: skip}), await showtimeRepository.countAll({ ...query, limit, offset: skip }) ])
        const totalPages = Math.ceil(totalData / limit)

        return {
            data: showtimes,
            meta: {
                page: page,
                limit: limit,
                totalData: totalData,
                totalPages: totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        }
    },

    getById: async (id: number): Promise<ShowtimeResponse> => {
        const showtime = await showtimeRepository.findById(id)
        if (!showtime) throw new NotFoundError(`Film dengan ID ${id} tidak ditemukan`)

        return showtime
    },

    getByIdWithSeats: async (id: number): Promise<ShowtimeWithSeatsResponse> => {
        const result = await showtimeRepository.findByIdWithSeats(id)

        if (!result) throw new NotFoundError(`Film dengan ID ${id} tidak ditemukan`)

        return result
    }
};
