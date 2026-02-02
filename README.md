# Store Locator API

Backend REST API per la gestione dei punti vendita.

## Tech Stack

- Node.js 20.x
- Express 4.x
- TypeScript 5.x
- MySQL 8.x
- Zod (validazione)

## Setup

1. Clona il repository
2. Installa le dipendenze: `npm install`
3. Copia `.env.example` in `.env` e configura le variabili
4. Avvia il server: `npm run dev`

## Scripts

- `npm run dev` - Avvia il server in modalità development
- `npm run build` - Compila TypeScript
- `npm run start` - Avvia il server in produzione
- `npm run import-csv` - Importa i dati dal CSV

## API Endpoints

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| GET | /api/stores | Lista punti vendita |
| GET | /api/stores/:id | Dettaglio punto vendita |
| GET | /api/stores/cities | Lista città disponibili |
| GET | /api/health | Health check |