import express from 'express';
import { PrismaClient, KnowledgeCategory } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/knowledge
router.get('/', async (req, res) => {
  const { category } = req.query;

  if (!category || typeof category !== 'string') {
    return res.status(400).json({ error: 'Category query parameter is required' });
  }

  // Ensure category is valid
  const validCategories = Object.values(KnowledgeCategory) as string[];
  if (!validCategories.includes(category)) {
    return res.status(400).json({ error: `Invalid category. Must be one of: ${validCategories.join(', ')}` });
  }

  try {
    const entries = await prisma.companyKnowledge.findMany({
      where: {
        category: category as KnowledgeCategory,
      },
      select: {
        topic: true,
        content: true,
      },
    });

    res.status(200).json({ entries });
  } catch (error) {
    console.error('Error fetching knowledge:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
