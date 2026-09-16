import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { Product } from "../models/product.model.js";
import { adminProductService } from "../services/admin-product.service.js";
import { sendPaginationResponse, sendResponse } from "../utils/response.util.js";
import type { BulkDeleteProductsDTO, BulkRestockProductDTO, ChangePriceProductDTO, CreateProductDTO, ProductsCursorQueryDTO, ReduceStockProductDTO, RestockProductDTO, UpdateProductDTO } from "../validations/product.validation.js";

export const adminProductController = {
  getAllCursor: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payloadQuery = req.parsedQuery as ProductsCursorQueryDTO
      const result = await adminProductService.getAllCursor(payloadQuery)

      sendPaginationResponse(res, StatusCodes.OK, "Berhasil memuat data produk", result.data, result.meta)
    } catch (err) {
      next(err)
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const result = await adminProductService.getById(id);

      sendResponse<Product>(
        res,
        StatusCodes.OK,
        "Berhasil memuat data produk",
        result,
      );
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload: CreateProductDTO = req.body;
      const result = await adminProductService.create(payload);

      sendResponse<Product>(
        res,
        StatusCodes.CREATED,
        "Berhasil menambahkan produk baru",
        result,
      );
    } catch (err) {
      next(err);
    }
  },

  updateById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: number = Number(req.params.id);
      const payload: UpdateProductDTO = req.body;

      await adminProductService.updateById(id, payload);

      sendResponse<void>(res, StatusCodes.OK, "Berhasil memperbarui produk");
    } catch (err) {
      next(err);
    }
  },

  changePrice: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: number = Number(req.params.id);
      const payload: ChangePriceProductDTO = req.body;

      await adminProductService.changePrice(id, payload);

      sendResponse<void>(
        res,
        StatusCodes.OK,
        "Berhasil memperbarui harga produk",
      );
    } catch (err) {
      next(err);
    }
  },

  restock: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const payload: RestockProductDTO = req.body;

      await adminProductService.restock(id, payload);

      sendResponse<void>(res, StatusCodes.OK, "Berhasil menambah stok produk");
    } catch (err) {
      next(err);
    }
  },

  reduceStock: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const payload: ReduceStockProductDTO = req.body;

      await adminProductService.reduceStock(id, payload);

      sendResponse<void>(
        res,
        StatusCodes.OK,
        "Berhasil mengurangi stok produk",
      );
    } catch (err) {
      next(err);
    }
  },

  bulkRestock: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload: BulkRestockProductDTO = req.body;

      await adminProductService.bulkRestock(payload);

      sendResponse<void>(
        res,
        StatusCodes.OK,
        "Berhasil menambah stok beberapa produk",
      );
    } catch (err) {
      next(err);
    }
  },

  deleteById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      await adminProductService.deleteById(id);

      sendResponse<void>(
        res,
        StatusCodes.OK,
        "Berhasil menghapus produk dari sistem",
      );
    } catch (err) {
      next(err);
    }
  },

  bulkDelete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ids: BulkDeleteProductsDTO = req.body;

      const result = await adminProductService.bulkDelete(ids);

      sendResponse<void>(
        res,
        StatusCodes.OK,
        `Berhasil menghapus sebanyak ${result} produk dari sistem`,
      );
    } catch (err) {
      next(err);
    }
  },
};
