import z from "zod";
import { idSchema, paginationQuerySchema } from "./base.validation.js";

export const showtimeSchema = z.object({
    id: idSchema,
    movie_title: z.string().trim().min(1, "Judul film tidak boleh kosong").max(255, "Judul film maksimal 255 karakter"),
    studio_name: z.string().trim().min(1, "Nama studio tidak boleh kosong").max(100, "Nama studio maksimal 100 karakter"),
    broadcast_time: z.iso.datetime(),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime()
})

export const getShowtimesQuerySchema = paginationQuerySchema.extend({
    search: z.string().trim(),
    date: z.iso.datetime(), 
    startDate: z.iso.datetime(), 
    endDate: z.iso.datetime(), 
}).partial()


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