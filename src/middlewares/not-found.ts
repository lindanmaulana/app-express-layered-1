import { StatusCodes } from "http-status-codes";
import type { Request, Response } from "express";

export const notfoundHandler = (req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "Route tidak tersedia",
  });
};
