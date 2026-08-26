import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import { CustomAPIError } from "../errors/index.js";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  const isOperationalError = err instanceof CustomAPIError || Boolean((err as any)?.isOperational)

  if (!isOperationalError) {
    console.error("💥 Unhandle Programmer Error / System Crash")
  } else {
    console.error("💥 Expected Bussiness Error")
  }

  // App Error
  if (isOperationalError) {
    const operationalErr = err as CustomAPIError
    const statusCode = typeof operationalErr.statusCode === "number" && operationalErr.statusCode >= 400 ? operationalErr.statusCode : StatusCodes.BAD_REQUEST

    return res.status(statusCode).json({
      success: false,
      message: operationalErr.message,
    });
  }


  // Validate Error ZOD
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

  // Json Parse Error
  if (typeof err === "object" && err !== null && "type" in err && err.type === "entity.parse.failed") {
    console.log({err})
    return res.status(400).json({
      success: false,
      message: "Format JSON pada request body tidak valid",
    });
  }

  // DB Error
  if (typeof err === "object" && err !== null && "code" in err) {
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

      case "23502": 
      console.log({err})
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Kolom wajib pada database tidak boleh bernilai null",
        });
    }
  }

  console.error("💥 UNEXPECTED SERVER ERROR:", err);

  // Error tidak diketahui
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Terjadi kesalahan tidak terduga pada server, coba lagi nanti",
  });
};
