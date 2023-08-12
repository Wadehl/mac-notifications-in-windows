import path from 'node:path';
import { app } from 'electron';

process.env.DIST = path.join(__dirname, '../dist');
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public');

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
