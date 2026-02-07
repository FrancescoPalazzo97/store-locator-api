import { createReadStream } from "fs";
import { parse } from "csv-parse";
import { pool } from "../config/database.js";
import { storeCsvRowSchema, type StoreCsvRow } from "../schemas/store.schema.js";
import { z, type ZodSafeParseResult } from "zod";

export const parseRow = (row: unknown): ZodSafeParseResult<StoreCsvRow> => {
    const parsedRow = storeCsvRowSchema.safeParse(row);
    return parsedRow;
};

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
        data.totem,
    ]);
};

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

    console.log("Avvio importazione CSV!");
    console.log("Lettura dei file...");

    const parser = createReadStream("data/punti-vendita.csv").pipe(
        parse({
            columns: true,
            skip_empty_lines: true,
            trim: true,
        }),
    );

    console.log("Importazione in corso...");

    for await (const row of parser) {
        rowIndex++;
        const validation = parseRow(row);

        if (!validation.success) {
            const prettifiedError = z.prettifyError(validation.error);
            console.log(
                `Riga ${rowIndex}: Errore validazione - ${prettifiedError}`,
            );
            results.push({
                success: false,
                row: rowIndex,
                error: prettifiedError,
            });
            continue;
        }

        try {
            await insertRow(validation.data);
            console.log(
                `Riga ${rowIndex}: ${validation.data.nome} - importato`,
            );
            results.push({
                success: true,
                row: rowIndex,
                nome: validation.data.nome,
            });
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Errore sconosciuto";
            console.log(
                `Riga ${rowIndex}: ${validation.data.nome} - Errore DB: ${errorMessage}`,
            );
            results.push({
                success: false,
                row: rowIndex,
                nome: validation.data.nome,
                error: errorMessage,
            });
        }
    }

    const successCount = results.filter((r) => r.success).length;
    const errorCount = results.filter((r) => !r.success).length;
    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log("\n═══════════════════════════════════════");
    console.log("📋 REPORT IMPORTAZIONE");
    console.log("═══════════════════════════════════════");
    console.log(`✅ Righe importate: ${successCount}`);
    console.log(`⚠️  Righe con errori: ${errorCount}`);
    console.log(`📊 Totale processate: ${rowIndex}`);
    console.log(`⏱️  Tempo di esecuzione: ${elapsedTime}s`);
    console.log("═══════════════════════════════════════\n");

    await pool.end();
    process.exit(0);
};

importCsv().catch((error) => {
    console.error("Errore durante l'importazione:", error);
    process.exit(1);
});
