# NEXA CAPITAL — ENTERPRISE FINTECH & INVESTMENT PLATFORM

[![CI/CD Pipeline](https://github.com/nexacapital/platform/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/nexacapital/platform/actions)
[![License](https://img.shields.io/badge/license-Proprietary-teal.svg)](LICENSE)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-emerald.svg)](public/manifest.json)
[![API OpenAPI](https://img.shields.io/badge/OpenAPI-3.0-blue.svg)](http://localhost:3000/api/docs)

**Nexa Capital** adalah platform investasi saham, obligasi sukuk, dan produk *Fast Yield* kelas enterprise yang dilengkapi dengan pembagian dividen harian otomatis, sistem referral komisi 3-level, kecerdasan buatan **NexaAI (Gemini 3.6 Flash)**, laporan analitik bisnis real-time, serta arsitektur PWA (Progressive Web App) untuk desktop dan mobile.

---

## 🌟 FITUR UTAMA PLATFORM

- **Investasi Fast Yield & Dividen Harian**: Klaim dividen cair harian otomatis dari paket saham dividen (BBCA, BMRI, PGAS) dan obligasi syariah sukuk.
- **Dompet Dual-Wallet Architecture**: Pemisahan tegas *Main Wallet* (Saldo Deposit/Penarikan) dan *Profit Wallet* (Hasil Dividen/Klaim) dengan garansi integritas mutasi ledger.
- **Asisten Pintar NexaAI (Gemini 3.6 Flash)**: Chatbot finansial & edukasi interaktif untuk membimbing pengguna membaca grafik portofolio, memahami risiko, dan mengeksplorasi produk.
- **Executive Analytics & Business Intelligence**: Grafik tren pendapatan, volume investasi, distribusi produk, dan tingkat retensi investor menggunakan Recharts.
- **Generator Laporan & Eksportir Data**: Pembuatan laporan keuangan resmi dalam format PDF, CSV, dan Excel spreadsheet untuk audit eksekutif.
- **Sistem Referral 3-Level**: Komisi bertingkat otomatis Level 1 (32%), Level 2 (2%), dan Level 3 (1%) dengan pohon jaringan downline transparan.
- **Infrastruktur PWA & Service Worker**: Fitur *Offline Fallback*, *Stale-While-Revalidate Caching*, serta *Install Prompt* untuk Android, iOS, dan Desktop.
- **Pusat Pengumuman & Ticker Saham Real-Time**: Banner pengumuman dinamis dan running text ticker harga saham perbankan dan energi secara live.
- **Multi-Bahasa (i18n) & Lokalisasi**: Dukungan Bahasa Indonesia, English, Japanese, Chinese, Arabic, Spanish, dan French.
- **Dokumentasi API Interactive (Swagger / OpenAPI 3.0)**: Dokumentasi endpoint interaktif bawaan di `/api/docs`.

---

## 🏗️ ARSITEKTUR TEKNOLOGI

```
                  ┌────────────────────────────────────────┐
                  │   Progressive Web App (React 18 + Vite) │
                  └───────────────────┬────────────────────┘
                                      │ REST API / WebSockets
                  ┌───────────────────▼────────────────────┐
                  │      Express.js Backend Server         │
                  ├────────────────────────────────────────┤
                  │  • JWT Auth & Security Headers (Helmet)│
                  │  • NexaAI (Gemini 3.6 Flash Engine)    │
                  │  • Socket.IO Live Broadcasting         │
                  │  • Executive Analytics & Reporting     │
                  └───────────────────┬────────────────────┘
                                      │ Prisma ORM
                  ┌───────────────────▼────────────────────┐
                  │    PostgreSQL 16 Enterprise Database   │
                  └────────────────────────────────────────┘
```

---

## 🛠️ CARA MENJALANKAN DI LINGKUNGAN LOKAL

### Prasyarat
- **Node.js**: v20.x atau lebih baru
- **npm**: v10.x atau lebih baru

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Pengaturan Environment Variables
Salin `.env.example` ke `.env`:
```bash
cp .env.example .env
```

Isi variabel utama:
```env
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere
JWT_SECRET=nexa_production_super_secret_jwt_key_2026
```

### 3. Jalankan Dev Server
```bash
npm run dev
```
Akses aplikasi di browser: **`http://localhost:3000`**

---

## 🐳 DEPLOYMENT DENGAN DOCKER & DOCKER COMPOSE

Jalankan seluruh stack (Aplikasi Node.js, PostgreSQL 16, dan Redis 7) hanya dengan satu perintah:

```bash
docker-compose up --build -d
```

Atau jalankan kontainer aplikasi tunggal:
```bash
docker build -t nexa-capital-app .
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key nexa-capital-app
```

---

## 📚 DOKUMENTASI TERSEDIA

- 📄 [**Architecture Guide**](docs/ARCHITECTURE.md) — Diagram sistem, ERD, Use Case, & Sequence flow.
- ⚙️ [**Administrator Guide**](docs/ADMINISTRATOR_GUIDE.md) — Panduan pengelola portal Admin, verifikasi deposit, & audit.
- 💻 [**Developer Guide**](docs/DEVELOPER_GUIDE.md) — Struktur folder, standar kode, & pola repository/service.
- 🚀 [**Deployment Guide**](docs/DEPLOYMENT_GUIDE.md) — Penggelaran GCP Cloud Run, Docker, Vercel, Railway, & Nginx.
- 🛠️ [**Troubleshooting Guide**](docs/TROUBLESHOOTING_GUIDE.md) — Solusi kendala umum, kode error, & pemulihan.

---

## 📜 LISENSI & HAK CIPTA

Hak Cipta © 2026 **Nexa Capital Platform**. Private & Proprietary — All Rights Reserved.
