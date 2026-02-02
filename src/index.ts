import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { testConnection } from './config/database.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import apiRoutes from './routes/apiRoutes.js';
import { env } from './env.js';

//TODO 1: Dividere app da index
//TODO 2: Creare config.env.ts per il .env
const app = express();
const { PORT, NODE_ENV, CORS_ORIGIN } = env;

app.use(cors({
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Logging
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use('/api', apiRoutes);

app.get('/', (_req, res) => {
    res.json({
        message: 'Store locator API is running!!!',
        endpoints: {
            health: '/api/health',
            stores: '/api/stores',
            storeDetail: '/api/stores/:id',
            cities: '/api/stores/cities'
        }
    });
});

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
    const dbConnected = await testConnection();

    if (!dbConnected) {
        console.error('Database Non connesso!');
    }

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📝 Environment: ${NODE_ENV}`);
        console.log(`🔗 CORS origin: ${CORS_ORIGIN}`);
    });
}

startServer();