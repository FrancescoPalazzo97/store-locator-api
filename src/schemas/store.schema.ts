import z from "zod";

// Schema per i query parameters della lista stores
export const storeQuerySchema = z.object({
    città: z.string().optional(),
    nome: z.string().optional(),
    totem: z
        .string()
        .optional()
        .transform((val) => {
            if (val === undefined) return undefined;
            return val === 'true'; // I valori arrivano come stringa quindi li convertiamo in booleani
        }),
    page: z
        .string()
        .optional()
        .default('1')
        .transform((val) => parseInt(val, 10))
        .refine((val) => val > 0, { message: 'Page deve essere maggiore di 0' }),
    limit: z
        .string()
        .optional()
        .default('20')
        .transform((val) => parseInt(val, 10))
        .refine((val) => val > 0 && val <= 100, {
            message: 'Limit deve essere tra 1 e 100'
        })
});

// Schema per il parametro ID
export const storeIdSchema = z.object({
    id: z
        .string()
        .transform((val) => parseInt(val, 10))
        .refine((val) => val > 0, { message: 'ID deve essere un numero positivo' })
});

// Schema per validazione dati CSV durante import
export const storeCsvRowSchema = z.object({
    id: z.number().int().positive(),
    nome: z.string().min(1, 'Nome è obbligatorio'),
    indirizzo: z.string().min(1, 'Indirizzo è obbligatorio'),
    città: z.string().min(1, 'Città è obbligatoria'),
    latitudine: z.number().min(-90).max(90),
    longitudine: z.number().min(-180).max(180),
    telefono: z.string().nullable().optional(),
    totem: z.boolean()
});

// Types derivati dagli schemas
export type StoreQueryParams = z.infer<typeof storeQuerySchema>;
export type StoreIdParams = z.infer<typeof storeIdSchema>;
export type StoreCsvRow = z.infer<typeof storeCsvRowSchema>;