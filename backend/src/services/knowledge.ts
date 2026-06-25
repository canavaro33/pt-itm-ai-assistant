import prisma from '../lib/prisma';

interface KnowledgeEntry {
  category: string;
  topic: string;
  content: string;
}

// Words to skip during keyword extraction (Indonesian + English common words)
const STOP_WORDS = new Set([
  'dan', 'atau', 'di', 'ke', 'dari', 'yang', 'untuk', 'dengan', 'ini',
  'itu', 'ada', 'pada', 'adalah', 'akan', 'juga', 'sudah', 'tidak',
  'bisa', 'saya', 'apa', 'bagaimana', 'dimana', 'kapan', 'siapa',
  'mengapa', 'kenapa', 'the', 'and', 'or', 'in', 'at', 'to', 'for',
  'of', 'is', 'are', 'was', 'were', 'be', 'been', 'has', 'have',
  'what', 'how', 'where', 'when', 'who', 'why', 'can', 'could',
  'tentang', 'apakah', 'berapa', 'tolong', 'mohon', 'beri', 'tahu',
]);

export async function searchKnowledge(
  message: string
): Promise<KnowledgeEntry[]> {
  // Extract keywords: split by spaces/punctuation, filter short and stop words
  const keywords = message
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length >= 3 && !STOP_WORDS.has(word));

  if (keywords.length === 0) {
    // If no keywords extracted, return a general set of results
    const results = await prisma.companyKnowledge.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    });

    return results.map((r) => ({
      category: r.category,
      topic: r.topic,
      content: r.content,
    }));
  }

  // Search using OR conditions with case-insensitive contains
  const results = await prisma.companyKnowledge.findMany({
    where: {
      OR: keywords.map((keyword) => ({
        content: {
          contains: keyword,
          mode: 'insensitive' as const,
        },
      })),
    },
    take: 5,
    orderBy: { createdAt: 'desc' },
  });

  console.log(
    `🔍 Knowledge search: keywords=[${keywords.join(', ')}] → ${results.length} results`
  );

  return results.map((r) => ({
    category: r.category,
    topic: r.topic,
    content: r.content,
  }));
}
