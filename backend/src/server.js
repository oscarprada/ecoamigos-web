import { logInfo, loggerOptions } from './utils/logger.js';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { corsOptions, configureProxy, controlledError } from './middleware/httpConfig.js';

import authRoutes from './routes/authRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import recyclingRoutes from './routes/recyclingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

loggerOptions(); // Fail early on invalid logging configuration, before listening.
const app = express();

configureProxy(app);
app.use(cors(corsOptions()));

app.use(express.json());
// No static uploads: every file is resolved through its current database relation.
app.use('/api/files', fileRoutes);

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/recycling', recyclingRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/', (_req, res) => {
  res.send('Servidor Ecoamigos funcionando 🚀');
});

app.use(controlledError);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logInfo('SERVER_STARTED');
});

