import pg from 'pg';
import dotenv from 'dotenv';
import { databaseOptions } from './databaseOptions.js';
import { logError } from '../utils/logger.js';

dotenv.config();

const { Pool } = pg;

export const pool = new Pool(databaseOptions());

pool.on('error', () => logError('DATABASE_POOL_ERROR'));

export const query = (text, params) => pool.query(text, params);

