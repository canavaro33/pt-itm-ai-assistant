import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateJWT } from './auth';

const router = Router();

// All routes require JWT authentication
router.use(authenticateJWT);

// POST /api/chat/session — Create a new chat session
router.post('/session', async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const session = await prisma.chatSession.create({
      data: {
        userId,
        title: 'New Chat',
      },
    });

    res.status(201).json({
      sessionId: session.id,
      title: session.title,
      createdAt: session.createdAt,
    });
  } catch (error) {
    console.error('❌ Create session error:', error);
    res.status(500).json({ error: 'Failed to create chat session' });
  }
});

// GET /api/chat/sessions — Get all sessions for authenticated user
router.get('/sessions', async (req: any, res: Response) => {
  try {
    const userId = req.user.id;

    const sessions = await prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(sessions);
  } catch (error) {
    console.error('❌ Get sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch chat sessions' });
  }
});

// GET /api/chat/session/:sessionId/messages — Get messages for a session
router.get('/session/:sessionId/messages', async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;

    // Validate session belongs to user
    const session = await prisma.chatSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      res.status(404).json({ error: 'Session not found or access denied' });
      return;
    }

    const messages = await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        role: true,
        content: true,
        createdAt: true,
      },
    });

    res.json(messages);
  } catch (error) {
    console.error('❌ Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST /api/chat/session/:sessionId/message — Save a message to a session
router.post('/session/:sessionId/message', async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;
    const { role, content } = req.body;

    if (!role || !content || !['user', 'assistant'].includes(role)) {
      res.status(400).json({ error: 'role must be "user" or "assistant", and content is required' });
      return;
    }

    // Validate session belongs to user
    const session = await prisma.chatSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      res.status(404).json({ error: 'Session not found or access denied' });
      return;
    }

    // Create the message
    const message = await prisma.chatMessage.create({
      data: {
        sessionId,
        role,
        content,
      },
    });

    // Auto-update session title if this is the first user message
    if (role === 'user') {
      const userMessageCount = await prisma.chatMessage.count({
        where: { sessionId, role: 'user' },
      });

      if (userMessageCount === 1) {
        const title = content.length > 40 ? content.substring(0, 40) + '...' : content;
        await prisma.chatSession.update({
          where: { id: sessionId },
          data: { title },
        });
      }
    }

    // Touch updatedAt on session (happens automatically via @updatedAt)
    // but also explicitly update it when assistant messages arrive
    if (role === 'assistant') {
      await prisma.chatSession.update({
        where: { id: sessionId },
        data: { updatedAt: new Date() },
      });
    }

    res.status(201).json({
      id: message.id,
      role: message.role,
      content: message.content,
      createdAt: message.createdAt,
    });
  } catch (error) {
    console.error('❌ Save message error:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// PATCH /api/chat/session/:sessionId/title — Rename a session
router.patch('/session/:sessionId/title', async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;
    const { title } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      res.status(400).json({ error: 'Title is required and must be a non-empty string' });
      return;
    }

    if (title.length > 60) {
      res.status(400).json({ error: 'Title must be 60 characters or fewer' });
      return;
    }

    // Validate session belongs to user
    const session = await prisma.chatSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      res.status(404).json({ error: 'Session not found or access denied' });
      return;
    }

    const updated = await prisma.chatSession.update({
      where: { id: sessionId },
      data: { title: title.trim() },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('❌ Rename session error:', error);
    res.status(500).json({ error: 'Failed to rename session' });
  }
});

// DELETE /api/chat/session/:sessionId — Delete a session and its messages
router.delete('/session/:sessionId', async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;

    // Validate session belongs to user
    const session = await prisma.chatSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) {
      res.status(404).json({ error: 'Session not found or access denied' });
      return;
    }

    // Delete session (messages cascade delete via schema)
    await prisma.chatSession.delete({
      where: { id: sessionId },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('❌ Delete session error:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

export default router;
