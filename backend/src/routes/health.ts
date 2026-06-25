import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'PT ITM AI Chatbot API',
    version: '1.0.0',
  });
});

export default router;
