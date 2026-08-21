import type { Request, Response } from "express";
import type {
  CreateUserDTO,
  GetByIdUserDTO,
  UpdateUserDTO,
} from "../models/user.model.js";
import { userService } from "../services/user.service.js";

export const userController = {
  getAll: async (req: Request, res: Response) => {
    const users = await userService.getAll();

    res.json(users);
  },

  getById: async (req: Request, res: Response) => {
    const { id }: GetByIdUserDTO = { id: req.params.id as string };

    const user = await userService.getById(Number(id));

    res.json(user);
  },

  create: async (req: Request, res: Response) => {
    const payload: CreateUserDTO = req.body;

    const newUser = await userService.create(payload);

    res.json(newUser);
  },

  update: async (req: Request, res: Response) => {
    const { id } = { id: req.params.id as string };
    const payload: UpdateUserDTO = req.body;

    const user = await userService.update(Number(id), payload);

    res.json(user);
  },

  delete: async (req: Request, res: Response) => {
    const { id } = { id: req.params.id as string };

    const user = await userService.delete(Number(id));

    res.json(user);
  },
};
