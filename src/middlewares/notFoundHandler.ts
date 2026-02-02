import type { ApiResponse } from "../types/store.types.js";
import type { Response, Request } from "express";

export const notFoundHandler = (_req: Request, res: Response): void => {
    const response: ApiResponse<never> = {
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: '404 | Not Found'
        }
    };

    res.status(404).json(response);
}