import z from "zod";
import { SORTABLE_COLUMNS, SORTABLE_COLUMNS_VALUE } from "../constants/showtime.constant.js";
import { idSchema, paginationQuerySchema } from "./base.validation.js";

export const showtimeSchema = z.object({
    id: idSchema,
    movie_title: z.string().trim().min(1, "Judul film tidak boleh kosong").max(255, "Judul film maksimal 255 karakter"),
    studio_name: z.string().trim().min(1, "Nama studio tidak boleh kosong").max(100, "Nama studio maksimal 100 karakter"),
    broadcast_time: z.iso.datetime(),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime()
})


const advancedQuerySchema = paginationQuerySchema.extend({
    sortBy: z.enum(SORTABLE_COLUMNS_VALUE).default(SORTABLE_COLUMNS.createdAt)
})

export const getShowtimesQuerySchema = advancedQuerySchema.extend({
    search: z.string().trim().optional(),
    date: z.iso.datetime().optional(), 
    startDate: z.iso.datetime().optional(), 
    endDate: z.iso.datetime().optional(), 
})


export const createShowtimeSchema = showtimeSchema.pick({
    movie_title: true,
    studio_name: true,
    broadcast_time: true
})

export const updateShowtimeSchema = showtimeSchema.pick({
    movie_title: true,
    studio_name: true,
    broadcast_time: true
}).partial()


export type ShowtimeDTO = z.infer<typeof showtimeSchema>
export type GetShowtimesQueryDTO = z.infer<typeof getShowtimesQuerySchema>
export type CreateShowtimeDTO = z.infer<typeof createShowtimeSchema>
export type UpdateShowtimeDTO = z.infer<typeof updateShowtimeSchema>