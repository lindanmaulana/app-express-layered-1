import z from "zod";

export const idempotencyKeySchema = z.object({
    "idempotency-key": z.uuid("Kode Idempotency-Key tidak valid")
})


export type IdempotencyKeyDTO = z.infer<typeof idempotencyKeySchema>