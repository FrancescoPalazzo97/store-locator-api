import mysql, { type Pool, type PoolOptions } from 'mysql2/promise';

const poolConfig: PoolOptions = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Your_Password_Here!',
    database: process.env.DB_NAME || 'store_locator',
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