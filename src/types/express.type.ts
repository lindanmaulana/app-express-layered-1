import type {Request} from "express"
import type { JwtPayload } from "./jwt.type.js"

export interface AuthenticatedRequest extends Request {
    user: JwtPayload
}