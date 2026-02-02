import type { Request, Response } from "express";
import { env } from "../env.js";

const { NODE_ENV } = env;

export const getServerHealth = (_req: Request, res: Response): void => {
    res.json({
        success: true,
        data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            environment: NODE_ENV
        }
    });
}