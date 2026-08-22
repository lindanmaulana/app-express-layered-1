import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "./index.js";

export class InternalServerError extends CustomAPIError {
    constructor(message: string = "Terjadi kesalahan tidak terduga") {
        super(message, StatusCodes.INTERNAL_SERVER_ERROR)
    }
}