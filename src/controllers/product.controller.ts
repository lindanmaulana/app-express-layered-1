import type { Request, Response } from "express";
import type {
  BulkDeleteProductsDTO,
  BulkRestockProductDTO,
  ChangePriceProductDTO,
  CreateProductDTO,
  ReduceStockProductDTO,
  RestockProductDTO,
  UpdateProductDTO,
} from "../models/product.model.js";
import { productService } from "../services/product.service.js";

export const productController = {
  getAll: async (req: Request, res: Response) => {
    const minPrice = req.query.minPrice
      ? Number(req.query.minPrice)
      : undefined;
    const maxPrice = req.query.maxPrice
      ? Number(req.query.maxPrice)
      : undefined;

    const result = await productService.getAll({ minPrice, maxPrice });

    res.json(result);
  },

  getById: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await productService.getById(id);

    res.json(result);
  },

  getLowStock: async (req: Request, res: Response) => {
    const result = await productService.getLowStock();

    res.json(result);
  },

  getHighStock: async (req: Request, res: Response) => {
    const result = await productService.getHighStock();

    res.json(result);
  },

  create: async (req: Request, res: Response) => {
    const payload: CreateProductDTO = req.body;

    const result = await productService.create(payload);

    res.json(result);
  },

  updateById: async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const payload: UpdateProductDTO = req.body;

    const result = await productService.updateById(id, payload);

    res.json(result);
  },

  changePrice: async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const payload: ChangePriceProductDTO = req.body;

    const result = await productService.changePrice(id, payload);

    res.json(result);
  },

  restock: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const payload: RestockProductDTO = req.body;

    const result = await productService.restock(id, payload);

    res.json(result);
  },

  reduceStock: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const payload: ReduceStockProductDTO = req.body;

    const result = await productService.reduceStock(id, payload);

    res.json(result);
  },

  bulkRestock: async (req: Request, res: Response) => {
    const payload: BulkRestockProductDTO = req.body

    const result = await productService.bulkRestock(payload)

    res.json(result)
  },

  deleteById: async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await productService.deleteById(id);

    res.json(result);
  },

  bulkDelete: async (req: Request, res: Response) => {
    const ids: BulkDeleteProductsDTO = req.body

    const result = await productService.bulkDelete(ids)

    res.json(result)
  }
};
