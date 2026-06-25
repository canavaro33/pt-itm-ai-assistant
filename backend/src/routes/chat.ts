import { Router, Request, Response } from 'express';
import { searchKnowledge } from '../services/knowledge';
import { sendToLLM } from '../services/llm';
import prisma from '../lib/prisma';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { message, employee_id } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({ error: 'Message is required and must be a non-empty string.' });
      return;
    }

    const employeeId = employee_id || req.employeeId || null;

    console.log(`💬 Chat request from ${employeeId || 'anonymous'}: "${message.substring(0, 80)}..."`);

    // Step 1: Search knowledge base
    const knowledgeEntries = await searchKnowledge(message);

    // Step 2: Classify context availability
    const hasRelevantContext = knowledgeEntries.length > 0;

    const knowledgeContext = hasRelevantContext
      ? knowledgeEntries
          .map(
            (entry) =>
              `[${entry.category.toUpperCase()}] ${entry.topic}: ${entry.content}`
          )
          .join('\n\n')
      : 'Tidak ada informasi spesifik yang ditemukan dalam basis pengetahuan perusahaan.';

    // Step 3: Build adaptive system prompt
    const systemPrompt = `Anda adalah asisten AI untuk PT ITM (Indo Tambangraya Megah), perusahaan pertambangan batubara di Kalimantan, Indonesia.

=== KONTEKS PERUSAHAAN (dari basis pengetahuan internal) ===
${knowledgeContext}

=== PEDOMAN MENJAWAB ===

ATURAN UTAMA: Selalu jawab dalam Bahasa Indonesia yang profesional dan ramah. Gunakan format yang rapi dengan poin-poin atau numbered list jika diperlukan.

${hasRelevantContext ? `TIER 1 — Pertanyaan tentang kebijakan, prosedur, atau data perusahaan:
Jika jawaban terdapat dalam konteks perusahaan di atas, berikan jawaban yang LENGKAP dan INFORMATIF berdasarkan data tersebut. Kutip informasi spesifik dari basis pengetahuan (misalnya nama sistem, departemen, atau prosedur yang disebutkan).

TIER 2 — Pertanyaan tentang istilah umum, definisi medis/teknis, atau penjelasan konsep yang berkaitan dengan konteks perusahaan:
Jika pengguna menanyakan definisi, penjelasan istilah (seperti spirometri, audiometri, EKG, APD, confined space, dll.), atau konsep umum yang terkait dengan informasi dalam basis pengetahuan di atas, Anda DIPERBOLEHKAN menggunakan pengetahuan umum Anda untuk menjawab dengan jelas dan informatif. NAMUN, Anda HARUS mengaitkannya kembali dengan konteks pekerjaan di PT ITM. Contoh: jelaskan apa itu spirometri, lalu tambahkan bahwa tes ini merupakan bagian dari Medical Check-Up tahunan karyawan PT ITM sebagaimana tercantum dalam data perusahaan.

TIER 3 — Pertanyaan umum seputar K3, kesehatan kerja, atau pertambangan yang tidak secara eksplisit ada di basis pengetahuan:
Anda DIPERBOLEHKAN menjawab menggunakan pengetahuan umum Anda tentang keselamatan kerja (K3), kesehatan okupasi, dan industri pertambangan. Hubungkan jawaban dengan konteks operasional tambang PT ITM di Kalimantan jika relevan.

TIER 4 — Pertanyaan di luar semua kategori di atas:
Jika pertanyaan sama sekali tidak berkaitan dengan konteks perusahaan, K3, kesehatan kerja, atau pertambangan, sampaikan dengan sopan bahwa Anda adalah asisten khusus PT ITM dan sarankan karyawan menghubungi departemen terkait untuk pertanyaan di luar bidang tersebut.` : `TIER 1 — Pertanyaan umum seputar K3, kesehatan kerja, istilah medis/teknis, atau pertambangan:
Tidak ada informasi spesifik yang ditemukan di basis pengetahuan perusahaan, namun Anda DIPERBOLEHKAN menjawab menggunakan pengetahuan umum Anda tentang keselamatan kerja (K3), kesehatan okupasi, istilah medis, dan industri pertambangan. Berikan jawaban yang informatif dan hubungkan dengan konteks operasional tambang jika memungkinkan.

TIER 2 — Pertanyaan tentang kebijakan atau prosedur spesifik perusahaan:
Jika pertanyaan menanyakan kebijakan, prosedur, atau data internal PT ITM yang spesifik dan Anda tidak menemukannya dalam konteks di atas, sampaikan dengan sopan bahwa informasi tersebut tidak tersedia dan sarankan karyawan menghubungi departemen terkait (HR, EHS, atau Operations).`}

Jangan pernah menyebutkan bahwa Anda menggunakan "basis pengetahuan" atau "konteks perusahaan" secara eksplisit. Jawablah secara natural seolah Anda memang menguasai informasi tersebut.`;

    // Step 4: Send to LLM
    const aiReply = await sendToLLM(systemPrompt, message);

    // Step 5: Save chat history
    await prisma.chatHistory.create({
      data: {
        employeeId: employeeId,
        userMessage: message,
        aiResponse: aiReply,
      },
    });

    console.log(`✅ Chat response saved to history`);

    // Step 6: Return response
    res.json({ reply: aiReply });
  } catch (error) {
    console.error('❌ Chat error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'An unexpected error occurred';

    res.status(500).json({
      error: `Failed to process chat message: ${errorMessage}`,
    });
  }
});

export default router;
