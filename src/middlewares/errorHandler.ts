import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import type { ApiResponse } from "../types/store.types.js";

export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public details?: Array<{ field: string; message: string }>,
    ) {
        super(message);
        this.name = "AppError";
    }
}

export function errorHandler(
    err: Error | AppError | ZodError,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void {
    console.error("Errore: ", err);

    // Gestione errori di validazione Zod
    if (err instanceof ZodError) {
        const details = err.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message
        }));

        const response: ApiResponse<never> = {
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Parametri non validi',
                details
            }
        };

        res.status(400).json(response);
        return;
    }

    // Gestione errori personalizzati AppError
    if (err instanceof AppError) {
        const response: ApiResponse<never> = {
            success: false,
            error: {
                code: 'APP_ERROR',
                message: err.message,
                ...(err.details && { details: err.details })
            }
        };

        res.status(err.statusCode).json(response);
        return;
    }

    // Gestione errori generici
    const response: ApiResponse<never> = {
        success: false,
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Errore generico del server!'
        }
    };

    res.status(500).json(response);
}