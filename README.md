# Store Locator API

Backend REST API per la gestione dei punti vendita (store locator).

## Tech Stack

| Tecnologia | Versione | Ruolo |
|------------|----------|-------|
| Node.js | 20+ | Runtime (usa `--env-file` nativo) |
| Express | 5.x | Web framework (async error handling nativo) |
| TypeScript | 5.9 | Linguaggio (tsconfig extra-strict) |
| MySQL | 8.x | Database (mysql2/promise) |
| Zod | 4.x | Validazione schema e derivazione tipi |
| Morgan | 1.x | HTTP request logging |
| CORS | 2.x | Cross-Origin Resource Sharing |
| tsx | 4.x | Dev runner con watch mode |

## Setup

1. Clona il repository
2. Installa le dipendenze: `npm install`
3. Copia `.env.example` in `.env` e configura le variabili d'ambiente
4. Crea il database MySQL e la tabella `punti_vendita` (vedi [Schema Database](#schema-database))
5. Importa i dati: `npm run import-csv`
6. Avvia il server: `npm run dev`

## Scripts

| Script | Comando | Descrizione |
|--------|---------|-------------|
| `dev` | `tsx watch --env-file=.env src/index.ts` | Dev server con hot reload (porta 3000) |
| `build` | `tsc` | Compila TypeScript in `dist/` |
| `start` | `node --env-file=.env dist/index.js` | Avvia in produzione |
| `import-csv` | `tsx --env-file=.env src/scripts/import-csv.ts` | Importa dati dal CSV |

> **Nota:** usa il flag nativo `--env-file=.env` di Node.js 20+ — nessun pacchetto dotenv necessario.

## Variabili d'Ambiente

| Variabile | Obbligatoria | Default | Descrizione |
|-----------|:------------:|---------|-------------|
| `DB_PASSWORD` | ✅ | — | Password MySQL |
| `DB_NAME` | ✅ | — | Nome database |
| `PORT` | | `3000` | Porta del server |
| `NODE_ENV` | | `development` | `development` \| `production` |
| `DB_HOST` | | `localhost` | Host MySQL |
| `DB_PORT` | | `3306` | Porta MySQL |
| `DB_USER` | | `root` | Utente MySQL |
| `CORS_ORIGIN` | | `http://localhost:5173` | Origin frontend (validato come URL) |

Tutte le variabili vengono validate con Zod all'avvio dell'applicazione (`src/env.ts`). Se mancano o non sono valide il server non parte.

## Struttura del Progetto

```
src/
├── index.ts                    # Entry point — setup Express, middleware, routes
├── env.ts                      # Validazione environment con Zod (crash-early)
├── config/
│   └── database.ts             # MySQL connection pool (mysql2/promise)
├── controllers/
│   ├── healthController.ts     # Handler health check
│   └── storeController.ts      # Handler CRUD stores (getStores, getCities, getStoreById)
├── middlewares/
│   ├── errorHandler.ts         # Error handler globale + classe AppError
│   └── notFoundHandler.ts      # Handler 404
├── routes/
│   ├── apiRoutes.ts            # Router principale (/stores, /health)
│   ├── healthRoutes.ts         # Route health check
│   └── storeRoutes.ts          # Route stores (/cities prima di /:id)
├── schemas/
│   ├── env.schema.ts           # Schema Zod per variabili d'ambiente
│   └── store.schema.ts         # Schema Zod per query params, path params, CSV
├── scripts/
│   └── import-csv.ts           # Script importazione CSV con validazione
├── types/
│   └── store.types.ts          # Interfacce TypeScript (Store, City, ApiResponse, etc.)
└── utils/
    └── successHandler.ts       # Wrapper risposte di successo standardizzate
```

## Schema Database

```sql
CREATE TABLE punti_vendita (
  id INT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  indirizzo VARCHAR(150) NOT NULL,
  città VARCHAR(100) NOT NULL,
  latitudine DECIMAL(9,6) NOT NULL,
  longitudine DECIMAL(9,6) NOT NULL,
  telefono VARCHAR(20),
  totem BOOLEAN NOT NULL
);
```

Il dataset contiene **60 punti vendita** importabili dal file `data/punti-vendita.csv`.

## API Endpoints

### `GET /api/health`

Health check del server.

**Risposta:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2026-02-07T10:30:00.000Z",
    "environment": "development"
  }
}
```

---

### `GET /api/stores`

Lista punti vendita con filtri e paginazione.

**Query Parameters:**

| Parametro | Tipo | Default | Descrizione |
|-----------|------|---------|-------------|
| `città` | string | — | Filtra per città (match esatto) |
| `nome` | string | — | Filtra per nome (match parziale, LIKE %nome%) |
| `totem` | `"true"` \| `"false"` | — | Filtra per disponibilità totem |
| `page` | number | `1` | Numero pagina (min: 1) |
| `limit` | number | `20` | Elementi per pagina (min: 1, max: 100) |

**Ordinamento:** `città ASC, nome ASC`

**Risposta:**
```json
{
  "success": true,
  "data": {
    "stores": [
      {
        "id": 1,
        "nome": "Red Signal",
        "indirizzo": "Corso Buenos Aires 33",
        "città": "Milano",
        "latitudine": 45.478100,
        "longitudine": 9.205600,
        "telefono": "0287654321",
        "totem": false
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalItems": 60,
      "itemsPerPage": 20
    }
  }
}
```

---

### `GET /api/stores/cities`

Lista città con conteggio punti vendita.

**Ordinamento:** per conteggio decrescente, poi nome città crescente.

**Risposta:**
```json
{
  "success": true,
  "data": {
    "cities": [
      { "città": "Napoli", "count": 4 },
      { "città": "Bologna", "count": 4 },
      { "città": "Milano", "count": 2 }
    ]
  }
}
```

---

### `GET /api/stores/:id`

Dettaglio singolo punto vendita.

**Path Parameter:** `id` — intero positivo (validato con Zod)

**Risposta (successo):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nome": "Red Signal",
    "indirizzo": "Corso Buenos Aires 33",
    "città": "Milano",
    "latitudine": 45.478100,
    "longitudine": 9.205600,
    "telefono": "0287654321",
    "totem": false
  }
}
```

**Risposta (non trovato — 404):**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Punto vendita non trovato!"
  }
}
```

## Gestione Errori

Tre livelli di error handling gestiti dal middleware globale `errorHandler`:

### 1. Errori di Validazione (Zod) — `400`

Scattano quando query params o path params non superano la validazione Zod.

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Parametri non validi",
    "details": [
      { "field": "page", "message": "Page deve essere maggiore di 0" }
    ]
  }
}
```

### 2. Errori Applicativi (AppError) — codice HTTP variabile

Lanciati esplicitamente nei controller tramite `throw new AppError(statusCode, message)`.

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Punto vendita non trovato!"
  }
}
```

### 3. Errori Generici — `500`

Errori imprevisti. In development il messaggio originale è visibile; in production viene mascherato.

```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "Errore generico del server!"
  }
}
```

> Express 5 gestisce automaticamente le Promise rejected nelle funzioni async — nessun try-catch necessario nei controller.

## Importazione CSV

Lo script `npm run import-csv` importa i dati da `data/punti-vendita.csv` nel database.

**Caratteristiche:**
- Parsing in streaming con `csv-parse`
- Validazione riga per riga con schema Zod dedicato (`storeCsvRowSchema`)
- Logica upsert: `INSERT ... ON DUPLICATE KEY UPDATE` (idempotente, eseguibile più volte)
- Conversione automatica dei tipi (stringhe → numeri, `"true"`/`"false"` → boolean, stringa vuota → `null` per telefono)
- Report finale con conteggio successi/errori e tempo di esecuzione

**Output esempio:**
```
Avvio importazione CSV!
Lettura dei file...
Importazione in corso...
Riga 1: Red Signal - importato
Riga 2: EasySIM Point - importato
...
═══════════════════════════════════════
📋 REPORT IMPORTAZIONE
═══════════════════════════════════════
✅ Righe importate: 60
⚠️  Righe con errori: 0
📊 Totale processate: 60
⏱️  Tempo di esecuzione: 1.23s
═══════════════════════════════════════
```

## Catena Middleware

Ordine di esecuzione in `index.ts`:

1. `cors()` — configurazione CORS (origin, metodi, headers)
2. `express.json()` — parser body JSON
3. `morgan()` — logging HTTP (`dev` in development, `combined` in production)
4. `/api` → route API (stores + health)
5. `GET /` → messaggio di benvenuto con lista endpoint
6. `notFoundHandler` — 404 per route non trovate
7. `errorHandler` — handler globale errori

## Pattern e Convenzioni

- **ES Modules con estensione `.js`:** tutti gli import usano `.js` anche per file `.ts` (richiesto da NodeNext)
- **`verbatimModuleSyntax`:** obbligatorio usare `import type` per import solo di tipi
- **tsconfig extra-strict:** `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noUnusedLocals`, `noUnusedParameters` abilitati
- **Risposte API standardizzate:** `{ success: true, data }` oppure `{ success: false, error: { code, message } }`
- **Tipi MySQL2:** intersection type `RowDataPacket & Store` per query tipizzate con `pool.execute<StoreRow[]>()`
- **Schema-driven:** tipi TypeScript derivati da schema Zod via `z.infer<typeof schema>` (single source of truth)
- **Pool MySQL:** max 10 connessioni concorrenti, keep-alive abilitato, coda illimitata

## Problemi Comuni

| Problema | Soluzione |
|----------|-----------|
| `Cannot find module` | Gli import devono usare estensione `.js` (es. `./config/database.js`) |
| Errori CORS | Verificare che `CORS_ORIGIN` nel `.env` corrisponda esattamente all'URL del frontend |
| Connessione DB fallita | Verificare che MySQL sia attivo e che il database `store_locator` esista con la tabella `punti_vendita` |
| Errori import di tipi | Con `verbatimModuleSyntax: true`, usare sempre `import type` per import solo di tipi |
