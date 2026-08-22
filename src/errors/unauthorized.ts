import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "./index.js";

export class UnauthorizedError extends CustomAPIError {
    constructor(message: string = "Unauthorized") {
        super(message, StatusCodes.UNAUTHORIZED)
    }
}