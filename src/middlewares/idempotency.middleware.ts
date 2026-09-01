import type { Request, Response, NextFunction } from "express"
import { BadRequestError } from "../errors/index.js"

export const idempotency = async (req: Request, res: Response, next: NextFunction) => {
    const idempotencyKey = req.idempotencyKey
    
    if (!idempotencyKey) {
        console.error('💥[WARN] Missing idempotency-key header for request from user')
        throw new BadRequestError('Terjadi kesalahan pada permintaan Anda. Silahkan coba beberapa saat lagi')
    }

    next()
}