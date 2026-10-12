import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { runMigrations } from './server/db/migrations.js';
import { seedInitialData } from './server/db/seed.js';
import { authMiddleware } from './server/middleware/auth.js';

// Route imports
import authRoutes from './server/routes/auth.js';
import donorRoutes from './server/routes/donors.js';
import requestRoutes from './server/routes/requests.js';
import hospitalRoutes from './server/routes/hospitals.js';
import notificationRoutes from './server/routes/notifications.js';
import reportRoutes from './server/routes/reports.js';
import adminRoutes from './server/routes/admin.js';
import aiRoutes from './server/routes/ai.js';
import cloudflareRoutes from './server/routes/cloudflare.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);
const isProduction = process.env.NODE_ENV === 'production';

// Initialize Database & Run Migrations & Seed Data
try {
  runMigrations();
  seedInitialData();
} catch (dbErr) {
  console.error('[DB] Initialization error:', dbErr);
}

// Basic security headers & parsing middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Auth session parser
app.use(authMiddleware);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Barishal Rokto API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount Standardized Versioned REST API v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/donors', donorRoutes);
app.use('/api/v1/requests', requestRoutes);
app.use('/api/v1/hospitals', hospitalRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/r2', cloudflareRoutes);
app.use('/api/v1/d1', cloudflareRoutes);

// Frontend integration: Vite middleware in dev, static files in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[DEV] Vite dev middleware mounted (HMR disabled).');
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
    console.log(`[PROD] Serving static files from ${distPath}`);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[SERVER] Barishal Rokto running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('[FATAL] Failed to start server:', err);
  process.exit(1);
});
