import { createReadStream } from 'fs';
import { parse } from 'csv-parse';
import { pool } from '../config/database.js';
import type { StoreCsvRow } from '../schemas/store.schema.js';
import { storeCsvRowSchema } from '../schemas/store.schema.js';

export const parseRow = (row: unknown, rowIndex: number): StoreCsvRow => {
    //TODO: con safeParse ottengo l'errore che mi servirà!!!
    const parsedRow = storeCsvRowSchema.parse(row);
    return parsedRow;
}

const insertRow = async (data: StoreCsvRow): Promise<void> => {
    const sqlQuery = `
        INSERT INTO punti_vendita (id, nome, indirizzo, città, latitudine, longitudine, telefono, totem)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            nome = VALUES(nome),
            indirizzo = VALUES(indirizzo),
            città = VALUES(città),
            latitudine = VALUES(latitudine),
            longitudine = VALUES(longitudine),
            telefono = VALUES(telefono),
            totem = VALUES(totem)
    `;

    await pool.execute(sqlQuery, [
        data.id,
        data.nome,
        data.indirizzo,
        data.città,
        data.latitudine,
        data.longitudine,
        data.telefono,
        data.totem
    ]);
}

type ImportResult = {
    success: boolean;
    row: number;
    nome?: string;
    error?: string;
};

const importCsv = async (): Promise<void> => {
    const startTime = Date.now();
    const results: ImportResult[] = [];
    let rowIndex = 0;

    console.log('Avvio importazione CSV!');
    console.log('Lettura dei file...');

    const parser = createReadStream('data/punti-vendita.csv')
        .pipe(
            parse({
                columns: true,
                skip_empty_lines: true,
                trim: true
            })
        );

    console.log('Importazine in corso...');

    for await (const row of parser) {
        rowIndex++;
        const parsedRow = parseRow(row, rowIndex);

        if ('error' in parsedRow) {
            console.log(`⚠️  Riga ${rowIndex}: Errore validazione - ${parseRow.error}`);

        }
    }
}
