import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "./index.js";

export class NotFoundError extends CustomAPIError {
    constructor(message: string = "Resource tidak ditemukan") {
        super(message, StatusCodes.NOT_FOUND)
    }
}