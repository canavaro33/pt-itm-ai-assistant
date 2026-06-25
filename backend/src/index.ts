import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { logger } from './middleware/logger';
import { authMiddleware } from './middleware/auth';
import chatRouter from './routes/chat';
import chatHistoryRouter from './routes/chatHistory';
import healthRouter from './routes/health';
import authRouter from './routes/auth';
import knowledgeRouter from './routes/knowledge';
import userRouter from './routes/user';

const app = express();
const PORT = process.env.PORT || 4000;

// CORS: accept comma-separated origins from env, fallback to localhost
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000,http://127.0.0.1:3000')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'x-employee-id', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(logger);
// app.use(authMiddleware); // We have our own authentication for routes that need it now, so removing global auth middleware

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes
app.use('/api/chat', authMiddleware, chatRouter); // Keep legacy auth on chat route
app.use('/api/chat', chatHistoryRouter); // Chat history uses its own JWT auth
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/knowledge', knowledgeRouter);
app.use('/api/user', userRouter);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    message: 'PT ITM Corporate AI Chatbot API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      chat: 'POST /api/chat',
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('  ⛏️  ════════════════════════════════════════════');
  console.log('  ⛏️   PT ITM Corporate AI Chatbot API');
  console.log(`  ⛏️   Server running on http://localhost:${PORT}`);
  console.log(`  ⛏️   AI Provider: ${process.env.AI_PROVIDER || 'anthropic'}`);
  console.log('  ⛏️  ════════════════════════════════════════════');
  console.log('');
});

export default app;
