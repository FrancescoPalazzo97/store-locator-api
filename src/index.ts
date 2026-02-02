import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { success } from 'zod';
import { timeStamp } from 'node:console';

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Logging
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('api/health', (req, res) => {
    res.json({
        success: true,
        data: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            environment: NODE_ENV
        }
    });
});

app.get('/', (req, res) => {
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});