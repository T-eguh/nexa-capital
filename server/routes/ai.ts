import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import { authenticateJwt, AuthenticatedRequest } from '../middleware';

const router = Router();

// Store conversations in-memory for Phase 9
export interface AiChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface AiConversationSession {
  id: string;
  userId: string;
  title: string;
  messages: AiChatMessage[];
  createdAt: string;
}

export const aiSessionsStore: Record<string, AiConversationSession[]> = {};

const SYSTEM_INSTRUCTION = `Anda adalah NexaAI, Asisten Finansial & Edukasi Resmi dari platform Nexa Capital.
Tugas utama Anda:
1. Membimbing pengguna baru & lama dalam menjelajahi dashboard, produk investasi (Fast Yield, Dividend Stocks, Corporate Bonds, Mutual Funds), laporan portofolio, serta metode deposit & withdrawal.
2. Menjelaskan konsep finansial seperti ROI, CAGR, Dividend Yield, Portfolio Allocation, Compound Interest, dan Risk Management dengan bahasa yang mudah dipahami.
3. Membantu pengguna memahami laporan analitik & grafik kinerja investasi di platform.
4. Menjelaskan program Referral 3-Level dan sistem poin reward.

Aturan Penting:
- Jangan memberikan jaminan imbal hasil pasti (guaranteed return) atau keputusan jual/beli saham spesifik.
- Selalu utamakan edukasi finansial dan manajemen risiko.
- Gunakan bahasa Indonesia yang ramah, sopan, profesional, dan terstruktur dengan Markdown yang rapi (bolding, bullet points, ringkasan).`;

// POST /api/ai/chat
router.post('/chat', authenticateJwt, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { prompt, conversationId } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ success: false, message: 'Pesan / prompt tidak boleh kosong.' });
    }

    // Initialize user session
    if (!aiSessionsStore[userId]) {
      aiSessionsStore[userId] = [];
    }

    let session = aiSessionsStore[userId].find((s) => s.id === conversationId);
    if (!session) {
      session = {
        id: conversationId || `conv-${Date.now()}`,
        userId,
        title: prompt.slice(0, 30) + (prompt.length > 30 ? '...' : ''),
        messages: [],
        createdAt: new Date().toISOString(),
      };
      aiSessionsStore[userId].unshift(session);
    }

    // Add user message
    const userMsg: AiChatMessage = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toISOString(),
    };
    session.messages.push(userMsg);

    // Call Gemini API using @google/genai
    let aiResponseText = '';
    try {
      const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyDummyFallbackKey';
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const contentsHistory = session.messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: contentsHistory as any,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      aiResponseText = response.text || 'Maaf, NexaAI sedang memproses data. Silakan coba pertanyaan lain.';
    } catch (geminiErr: any) {
      console.warn('Gemini API call fallback:', geminiErr?.message);
      aiResponseText = `Halo! Terima kasih telah menghubungi NexaAI.

Sebagai asisten pintar Nexa Capital, saya dapat membantu Anda memahami:
- **Portofolio & Produk Investasi**: Paket Fast Yield 30 hari, Saham Dividen Harian, dan Sukuk Obligasi.
- **Deposit & Penarikan Saldo**: Panduan pembayaran Virtual Account, QRIS, E-Wallet, dan Rekening Bank.
- **Laporan & Analitik Keuangan**: Membaca grafik ROI, Riwayat Transaksi, dan Ledger Keuangan.

Ada yang bisa saya bantu jelaskan secara rinci hari ini?`;
    }

    const aiMsg: AiChatMessage = {
      id: `msg-${Date.now()}-a`,
      sender: 'ai',
      text: aiResponseText,
      timestamp: new Date().toISOString(),
    };
    session.messages.push(aiMsg);

    return res.status(200).json({
      success: true,
      conversationId: session.id,
      reply: aiMsg,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Gagal memproses pertanyaan AI.' });
  }
});

// GET /api/ai/history
router.get('/history', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const sessions = aiSessionsStore[userId] || [];

  return res.status(200).json({
    success: true,
    sessions,
  });
});

export default router;
