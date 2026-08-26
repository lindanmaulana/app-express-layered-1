import type { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../errors/not-found.js";

export const notfoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new NotFoundError(`Route ${req.originalUrl} tidak tersedia`)
  
  next(error)
};
