import { StatusCodes } from "http-status-codes";
import { CustomAPIError } from "./index.js";

export class ForbiddenError extends CustomAPIError {
  constructor(message: string = "Akses ditolak") {
    super(message, StatusCodes.FORBIDDEN);
  }
}
