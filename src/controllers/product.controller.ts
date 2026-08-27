import type { NextFunction, Request, Response } from "express";
import type { Product } from "../models/product.model.js";
import { productService } from "../services/product.service.js";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../utils/response.util.js";
import type {
  BulkDeleteProductsDTO,
  BulkRestockProductDTO,
  ChangePriceProductDTO,
  CreateProductDTO,
  GetProductsQueryDTO,
  ReduceStockProductDTO,
  RestockProductDTO,
  UpdateProductDTO,
} from "../validations/product.validation.js";

export const productController = {
  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query as unknown as GetProductsQueryDTO

      const result = await productService.getAll(query);

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Daftar Produk berhasil di ambil",
        data: result.data,
        meta: result.meta,
      });
    } catch (err) {
      next(err);
    }
  },



  getLowStock: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await productService.getLowStock();

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Berhasil memuat data produk dengan stok menipis",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  getHighStock: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await productService.getHighStock();

      sendResponse<Product[]>(
        res,
        StatusCodes.OK,
        "Berhasil memuat data produk dengan stok banyak",
        result,
      );
    } catch (err) {
      next(err);
    }
  },


};
