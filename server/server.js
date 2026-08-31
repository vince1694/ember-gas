import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to MongoDB
connectDB();

const app = express();

// Enable trust proxy for Vercel / Cloudflare / Serverless proxy deployment
app.set('trust proxy', true);

// Middleware
app.use(express.json());
app.use(cors());

// Serve frontend static files
app.use(express.static(ROOT));

// Security Headers (disable CSP to avoid blocking inline scripts)
app.use(helmet({ contentSecurityPolicy: false }));

// Rate Limiting — Bypass on Vercel Serverless (Vercel Edge Network handles rate limiting natively) to eliminate ERR_ERL validation crashes
if (!process.env.VERCEL) {
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 1000,
        standardHeaders: true,
        legacyHeaders: false,
        validate: false
    });
    app.use('/api', limiter);
}

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/sellers', sellerRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('EmberGas API is running...');
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

export default app;
