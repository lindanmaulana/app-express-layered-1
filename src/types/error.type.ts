import type { DatabaseError } from "pg";
import type { CustomAPIError } from "../errors/custom-api-error.js";
import type { ZodError } from "zod";

export type AppKnownError = CustomAPIError | DatabaseError | ZodError