import type { Request, Response } from "express";
import { storeQuerySchema, storeIdSchema } from "../schemas/store.schema.js";
import type { Store, City, PaginatedResponse } from "../types/store.types.js";
import { successHandler } from "../utils/successHandler.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2";
import { pool } from "../config/database.js";

type StoreRow = RowDataPacket & Store;
type CityRow = RowDataPacket & City;
type CountRow = RowDataPacket & { total: number };

// GET api/stores
export const getStores = async (req: Request, res: Response): Promise<void> => {
    const { città, nome, totem, page, limit } = storeQuerySchema.parse(
        req.query,
    );

    let whereClause = "WHERE 1=1";
    const queryParams: (string | number | boolean)[] = [];

    if (città) {
        whereClause += " AND città = ?";
        queryParams.push(città);
    }

    if (nome) {
        whereClause += " AND nome LIKE ?";
        queryParams.push(`%${nome}%`);
    }

    if (totem !== undefined) {
        whereClause += " AND totem = ?";
        queryParams.push(totem);
    }

    const countQuery = `SELECT COUNT(*) as total FROM punti_vendita ${whereClause}`;
    const [countResult] = await pool.execute<CountRow[]>(
        countQuery,
        queryParams,
    );
    const totalItems = countResult[0]?.total ?? 0;

    const totalPages = Math.ceil(totalItems / limit);
    const offset = (page - 1) * limit;

    const dataQuery = `
        SELECT id, nome, indirizzo, città, latitudine, longitudine, telefono, totem
        FROM punti_vendita
        ${whereClause}
        ORDER BY città, nome
        LIMIT ? OFFSET ?
    `;

    const [stores] = await pool.execute<StoreRow[]>(dataQuery, [
        ...queryParams,
        String(limit),
        String(offset),
    ]);

    const data: PaginatedResponse<Store> = {
        stores,
        pagination: {
            currentPage: page,
            totalPages,
            totalItems,
            itemsPerPage: limit,
        },
    };

    successHandler(res, data);
};

// GET api/stores/cities
export const getCities = async (
    _req: Request,
    res: Response,
): Promise<void> => {
    //TODO: logica ancora da implementare
    //placeholder
    const cities: City[] = [];
    successHandler(res, { cities });
};

export const getStoreById = async (
    req: Request,
    res: Response,
): Promise<void> => {
    const { id } = storeIdSchema.parse(req.params);
    //TODO: logica ancora da implementare
    //placeholder
    successHandler(res, { store: { id } as Store });
};
