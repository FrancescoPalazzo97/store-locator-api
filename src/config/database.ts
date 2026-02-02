import mysql, { type Pool, type PoolOptions } from 'mysql2/promise';
import { env } from '../env.js';

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = env;

const poolConfig: PoolOptions = {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
};

export const pool: Pool = mysql.createPool(poolConfig);

export const testConnection = async (): Promise<boolean> => {
    try {
        const connection = await pool.getConnection();
        console.log('Database connesso con successo!');
        connection.release();
        return true;
    } catch (error) {
        console.log('Connessione fallita con il Database');
        return false;
    }
}