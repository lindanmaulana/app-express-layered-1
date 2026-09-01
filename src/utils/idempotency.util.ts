import type { Request } from "express"
import { BadRequestError } from "../errors/index.js"

export const getIdempotencyKey = (req: Request): string => {
    if (!req.idempotencyKey) throw new BadRequestError("Terjadi kesalahan pada permintaan transaksi. Silahkan coba beberapa saat lagi")

    return req.idempotencyKey
}