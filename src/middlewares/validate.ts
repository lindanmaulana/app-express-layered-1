import type { ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";

interface RequestValidators {
  body?: ZodType<unknown>;
  query?: ZodType<unknown>;
  params?: ZodType<unknown>;
}

export const validate = (validators: RequestValidators) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (validators.params) {
        req.params = (await validators.params.parseAsync(req.params)) as any;
      }

      if (validators.query) {
        const parsedQuery = (await validators.query.parseAsync(req.query)) as any;

        for (const key in req.query) {
          delete (req.query as any)[key]
        }

        Object.assign(req.query, parsedQuery)
      }

      if (validators.body) {
        req.body = await validators.body.parseAsync(req.body);
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
