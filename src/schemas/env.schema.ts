import z from "zod";

export const envSchema = z.object({
    PORT: z
        .string()
        .default("3000")
        .transform(Number),

    NODE_ENV: z
        .literal(['development', 'production'])
        .default('development'),

    DB_HOST: z
        .string()
        .default('localhost'),

    DB_PORT: z
        .string()
        .default("3306")
        .transform(Number),

    DB_USER: z
        .string()
        .default('root'),

    DB_PASSWORD: z
        .string(),

    DB_NAME: z
        .string(),

    CORS_ORIGIN: z
        .url()
        .default('http://localhost:5173')
})