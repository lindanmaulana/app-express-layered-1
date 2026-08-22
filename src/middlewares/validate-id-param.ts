import type {Request, Response, NextFunction} from "express"

export const validateIdParam = (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params.id)

    if (Number.isNaN(id) || id <= 0) {
        return res.status(400).json({
            success: false,
            message: "Parameter ID tidak valid"
        })
    }

    next();
}