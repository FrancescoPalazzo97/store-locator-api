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
// Dal CSV parser arrivano tutte stringhe, quindi trasformiamo i tipi
export const storeCsvRowSchema = z.object({
    id: z.string({ error: 'ID mancante!' })
        .transform((val) => parseInt(val, 10))
        .refine((val) => Number.isInteger(val) && val > 0, {
            error: 'ID deve essere un numero intero positivo!'
        }),

    nome: z.string({ error: 'Nome non valido!' })
        .trim()
        .min(1, { error: 'Nome mancante!' }),

    indirizzo: z.string({ error: 'Indirizzo non valido!' })
        .trim()
        .min(1, { error: 'Indirizzo mancante!' }),

    città: z.string({ error: 'Città non valida!' })
        .trim()
        .min(1, { error: 'Città mancante!' }),

    latitudine: z.string({ error: 'Latitudine mancante!' })
        .transform((val) => parseFloat(val))
        .refine((val) => !isNaN(val) && val >= -90 && val <= 90, {
            error: 'Latitudine deve essere un numero compreso tra -90 e 90'
        }),

    longitudine: z.string({ error: 'Longitudine mancante!' })
        .transform((val) => parseFloat(val))
        .refine((val) => !isNaN(val) && val >= -180 && val <= 180, {
            error: 'Longitudine deve essere un numero compreso tra -180 e 180'
        }),

    telefono: z.string()
        .trim()
        .transform((val) => val === '' ? null : val)
        .optional()
        .default(''),

    totem: z.string({ error: 'Totem mancante!' })
        .trim()
        .refine((val) => val === 'TRUE' || val === 'FALSE', {
            error: 'Totem deve essere "TRUE" o "FALSE"'
        })
        .transform((val) => val === 'TRUE'),
});

// Types derivati dagli schemas
export type StoreQueryParams = z.infer<typeof storeQuerySchema>;
export type StoreIdParams = z.infer<typeof storeIdSchema>;
export type StoreCsvRow = z.infer<typeof storeCsvRowSchema>;