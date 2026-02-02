import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';

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

app.get('/api/health', (req, res) => {
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

//! 404 | not found handler basico
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: `Route ${req.method} ${req.url} not found`
        }
    })
})

//! Error handler basico
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err.message);
    res.status(500).json({
        success: false,
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: NODE_ENV === 'production' ? 'Internal server error' : err.message
        }
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${NODE_ENV}`);
    console.log(`🔗 CORS origin: ${CORS_ORIGIN}`);
});