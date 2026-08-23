import type { NextFunction, Request, Response } from "express";
import { CustomAPIError } from "../errors/index.js";
import { StatusCodes } from "http-status-codes";
import type { DatabaseError } from "../types/index.js";
import { ZodError } from "zod";

export const errorHandler = (
  err: Error | DatabaseError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "Validasi data gagal",
      errors: formattedErrors,
    });
  }

  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if ("code" in err && err.code) {
    switch (err.code) {
      case "23505":
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          message: "Data yang dimasukan sudah terdaftar (duplikasi data)",
        });

      case "23503":
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Data relasi tidak ditemukan",
        });

      case "22P02":
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Format tipe data input tidak valid",
        });
    }
  }

  if ("type" in err && err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Format JSON pada request body tidak valid",
    });
  }

  console.error("💥 UNEXPECTED SERVER ERROR:", err);

  return res.status(500).json({
    success: false,
    message: "Terjadi kesalahan tidak terduga, coba lagi nanti",
  });
};
