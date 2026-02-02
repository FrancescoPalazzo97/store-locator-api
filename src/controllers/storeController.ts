import type { Request, Response } from "express";
import { pool } from "../config/database.js";
import { storeQuerySchema, storeIdSchema } from "../schemas/store.schema.js";
import type { Store, City, PaginatedResponse } from "../types/store.types.js";
import { successHandler } from "../utils/successHandler.js";

// GET api/stores
export const getStores = async (req: Request, res: Response): Promise<void> => {
    const params = storeQuerySchema.parse(req.query);

    //TODO: logica ancora da implementare
    //placeholder
    const data: PaginatedResponse<Store> = {
        stores: [],
        pagination: {
            currentPage: params.page,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: params.limit
        }
    }

    successHandler(res, data);
}

// GET api/stores/cities
export const getCities = async (_req: Request, res: Response): Promise<void> => {
    //TODO: logica ancora da implementare
    //placeholder
    const cities: City[] = [];
    successHandler(res, { cities });
}

export const getStoreById = async (req: Request, res: Response): Promise<void> => {
    const { id } = storeIdSchema.parse(req.params);
    //TODO: logica ancora da implementare
    //placeholder
    successHandler(res, { store: { id } as Store });
}