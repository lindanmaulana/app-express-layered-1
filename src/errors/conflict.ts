import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "./index.js";

export class ConflictError extends CustomAPIError {
  constructor(message: string = "Data sudah ada (konflik)") {
    super(message, StatusCodes.CONFLICT);
  }
}
