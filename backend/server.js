import dns from 'node:dns';

dns.setServers(['1.1.1.1', '8.8.8.8']);

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Server } from 'socket.io';
import http from 'node:http';
import { connectDatabase, closeDatabase } from './src/config/db.js';
import { env } from './src/config/env.js';
import authRoutes from './src/routes/authRoutes.js';
import gameRoutes from './src/routes/gameRoutes.js';
import scoreRoutes from './src/routes/scoreRoutes.js';
import leaderboardRoutes from './src/routes/leaderboardRoutes.js';
import { apiLimiter } from './src/middleware/rateLimitMiddleware.js';
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';

const app = express();
const server = http.createServer(app);
const allowedOrigins = env.clientUrl.split(',').map((x) => x.trim()).filter(Boolean);
const io = new Server(server, { cors: { origin: allowedOrigins, methods: ['GET', 'POST'] }, transports: ['websocket', 'polling'] });

app.set('io', io);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: allowedOrigins, credentials: false }));
app.use(express.json({ limit: '128kb' }));
app.use(apiLimiter);
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'tech-runner-backend', database: 'mongodb' }));
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use(notFound);
app.use(errorHandler);

io.on('connection', (socket) => {
  socket.on('leaderboard:join', () => socket.join('leaderboard'));
});

await connectDatabase(env.mongoUri, env.dbName);
server.listen(env.port, () => console.log(`Tech Runner backend listening on http://localhost:${env.port}`));

async function shutdown() { await closeDatabase(); server.close(() => process.exit(0)); }
process.on('SIGINT', shutdown); process.on('SIGTERM', shutdown);
