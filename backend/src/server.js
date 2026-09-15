import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { corsOptions, configureProxy, controlledError } from './middleware/httpConfig.js';

import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import recyclingRoutes from './routes/recyclingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();

configureProxy(app);
app.use(cors(corsOptions()));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

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
  console.log(`Servidor Ecoamigos escuchando en http://localhost:${PORT}`);
});

