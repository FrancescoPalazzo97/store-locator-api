import type { Response } from "express"
import type { ApiResponse } from "../types/store.types.js"

export const successHandler = <T>(
    res: Response,
    data: T,
    status: number = 200
): void => {
    const response: ApiResponse<T> = {
        success: true,
        data
    };

    res.status(status).json(response);
}