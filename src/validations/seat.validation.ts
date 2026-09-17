import z from "zod";
import { idSchema } from "./base.validation.js";
import { SEAT_STATUS, SEAT_STATUS_VALUES } from "../constants/seat-status.constant.js";

export const seatSchema = z.object({
    id: idSchema,
    showtime_id: z.coerce.number().int().min(1, 'Showtime ID tidak boleh kosong'),
    seat_number: z.string().trim().min(2, "Nomor kursi minimal 2 karakter").max(10, "Nomor kursi maksimal 10 karakter"),
    status: z.enum(SEAT_STATUS_VALUES).default(SEAT_STATUS.available),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime()
})