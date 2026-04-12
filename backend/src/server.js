import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import authRoutes from './routes/authRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import recyclingRoutes from './routes/recyclingRoutes.js';

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.resolve('uploads')));

app.get('/api/health', (_req, res) => res.json({ ok: true, app: 'Ecoamigos API' }));
app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/recycling', recyclingRoutes);

app.use((err, _req, res, _next) => {
  res.status(500).json({ message: err.message || 'Error interno del servidor' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor Ecoamigos escuchando en http://localhost:${port}`);
});
