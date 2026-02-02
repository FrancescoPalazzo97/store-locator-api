import type { Request, Response } from "express";

const NODE_ENV = process.env.NODE_ENV || 'development';

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