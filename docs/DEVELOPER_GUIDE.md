# NEXA CAPITAL — DEVELOPER & ENGINEERING GUIDE

Panduan pengkodean dan arsitektur pengembangan untuk pengembang (software engineer) platform **Nexa Capital**.

---

## 1. STRUKTUR PROYEK & KONVENSI FILE

```
/
├── public/                 # Static assets, PWA manifest, service worker
├── server/                 # Express backend server logic
│   ├── db/                 # Database seeders, in-memory store, Prisma interface
│   ├── middleware.ts       # JWT authentication & security rate limiters
│   └── routes/             # REST API routes (auth, products, ai, analytics, reports, docs, dll)
├── src/                    # Frontend React 18 TypeScript application
│   ├── components/         # UI Component library (Atomic & Composite)
│   ├── context/            # React context providers (LanguageContext, ThemeContext)
│   ├── i18n/               # Kamus translasi multi-bahasa
│   ├── store/              # Zustand state managers (useAuthStore, useThemeStore)
│   └── types.ts            # Definisi antarmuka TypeScript global
├── server.ts               # Server entry point Express.js + Vite middleware
└── vite.config.ts          # Konfigurasi bundler Vite & Tailwind CSS
```

---

## 2. STANDAR PENGKODEAN TYPESCRIPT & REACT

- **Strict Type Checking**: Dilarang menggunakan `any` tanpa penjelasan yang valid. Selalu definisikan antarmuka di `src/types.ts` atau file rute terkait.
- **Functional Components & Hooks**: Selalu gunakan komponen fungsi React dengan Typed Props (`React.FC<Props>`).
- **Tailwind CSS Utility First**: Dilarang membuat file `.css` terpisah selain `src/index.css`. Manfaatkan utility classes Tailwind.
- **Lucide Icons**: Selalu impor ikon hanya dari library `lucide-react`.

---

## 3. POLA REPOSITORY & SERVICE LAYER

Seluruh operasi data di backend dikapsulasi ke dalam lapisan data terpusat (`server/db/index.ts` atau Prisma ORM Client):

```typescript
// Contoh panggilan repository pattern di Express route:
import { db } from '../db';

router.get('/investments', authenticateJwt, (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.userId;
  const userInvestments = db.getInvestmentsByUserId(userId);
  return res.status(200).json({ success: true, investments: userInvestments });
});
```

---

## 4. INTEGRASI AI NEXA (GEMINI 3.6 FLASH)

Integrasi SDK `@google/genai` dilakukan secara **server-side only** di file `server/routes/ai.ts` untuk melindungi `GEMINI_API_KEY`:

```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const response = await ai.models.generateContent({
  model: 'gemini-3.6-flash',
  contents: contentsHistory,
  config: { systemInstruction: SYSTEM_INSTRUCTION },
});
```

---

## 5. CARA MENAMBAHKAN BAHASA BARU (i18n)

1. Buka file `src/i18n/translations.ts`.
2. Tambahkan kode bahasa baru pada tipe `LanguageCode` (misal: `'de'` untuk German).
3. Tambahkan teks terjemahan pada kamus `translations`.
4. Tambahkan item opsi pada komponen `src/components/LanguageSelector.tsx`.
