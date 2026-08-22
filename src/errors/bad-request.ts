import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "./index.js";

export class BadRequestError extends CustomAPIError {
    constructor(message: string = "Bad Request") {
        super(message, StatusCodes.BAD_REQUEST)
    }
}