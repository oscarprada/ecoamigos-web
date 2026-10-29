import { logInfo, loggerOptions } from './utils/logger.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { corsOptions, csrfProtection, configureProxy, controlledError } from './middleware/httpConfig.js';
import { serverOptions } from './config/serverOptions.js';
import healthRoutes from './routes/healthRoutes.js';
import { createStorage } from './services/fileStore.js';

import authRoutes from './routes/authRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import recyclingRoutes from './routes/recyclingRoutes.js';
import gardenRoutes from './routes/gardenRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();
const { port: PORT } = serverOptions();
createStorage(); // Validate provider and production credentials before accepting requests.

loggerOptions(); // Fail early on invalid logging configuration, before listening.
const app = express();

configureProxy(app);
app.use(cors(corsOptions()));
app.use('/api', csrfProtection());

app.use(express.json());
app.use('/api/health', healthRoutes);
// No static uploads: every file is resolved through its current database relation.
app.use('/api/files', fileRoutes);

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/recycling', recyclingRoutes);
app.use('/api/garden', gardenRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/', (_req, res) => {
  res.send('Servidor Ecoamigos funcionando 🚀');
});

app.use(controlledError);

app.listen(PORT, () => {
  logInfo('SERVER_STARTED');
});
