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

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const result = await productService.getById(id);

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

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload: CreateProductDTO = req.body;
      const result = await productService.create(payload);

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

      await productService.updateById(id, payload);

      sendResponse<void>(res, StatusCodes.OK, "Berhasil memperbarui produk");
    } catch (err) {
      next(err);
    }
  },

  changePrice: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: number = Number(req.params.id);
      const payload: ChangePriceProductDTO = req.body;

      await productService.changePrice(id, payload);

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

      await productService.restock(id, payload);

      sendResponse<void>(res, StatusCodes.OK, "Berhasil menambah stok produk");
    } catch (err) {
      next(err);
    }
  },

  reduceStock: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = Number(req.params.id);
      const payload: ReduceStockProductDTO = req.body;

      await productService.reduceStock(id, payload);

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

      await productService.bulkRestock(payload);

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
      await productService.deleteById(id);

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

      const result = await productService.bulkDelete(ids);

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
