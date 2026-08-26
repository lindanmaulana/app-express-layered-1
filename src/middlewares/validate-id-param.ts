import type {Request, Response, NextFunction} from "express"
import { BadRequestError } from "../errors/bad-request.js"

export const validateIdParam = (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id)

    if (Number.isNaN(id) || id <= 0) {
        const error = new BadRequestError(`Parameter ID: ${id} tidak valid`)
        
        next(error)
    }

    next();
}