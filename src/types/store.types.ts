export type Store = {
    id: number;
    nome: string;
    indirizzo: string;
    città: string;
    latitudine: number;
    longitudine: number;
    telefono: string | null;
    totem: boolean;
}

export type City = {
    città: string;
    count: number;
}

export type PaginationParams = {
    page: number;
    limit: number;
}

export type StoreFilters = {
    città?: string;
    nome?: string;
    totem?: boolean;
}

export type PaginatedResponse<T> = {
    stores: T[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    };
}

//TODO:  Ottimizzare questo tipo!
export type ApiResponse<T> = {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: Array<{ field: string; message: string }>;
    };
}