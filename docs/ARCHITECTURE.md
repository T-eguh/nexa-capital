# NEXA CAPITAL — SYSTEM ARCHITECTURE & DESIGN DIAGRAMS

Dokumen ini menjelaskan arsitektur tingkat tinggi, diagram hubungan entitas (ERD), diagram kasus penggunaan (Use Case Diagram), diagram alir transaksi (Sequence Diagram), dan komponen infrastruktur platform **Nexa Capital**.

---

## 1. CLEAN ARCHITECTURE & LAYER SEPARATION

Aplikasi Nexa Capital mengikuti prinsip Clean Architecture dengan pemisahan tanggung jawab yang jelas:

1. **Presentation Layer (`src/components/`, `src/App.tsx`)**
   - Komponen UI React 18 yang terisolasi dan deklaratif.
   - Menggunakan Tailwind CSS untuk utilitas responsif.
   - Dikelola oleh React Hooks, Context API (`LanguageContext`), dan Zustand Stores (`useAuthStore`).

2. **API & Network Layer (`src/services/`, `server/routes/`)**
   - Client API berkomunikasi dengan backend via REST JSON (`/api/*`) dan WebSockets (`Socket.IO`).
   - Router Express.js memverifikasi JWT Bearer token melalui middleware otentikasi `authenticateJwt`.

3. **Domain & Business Logic Layer (`server/services/`, `src/types.ts`)**
   - Aturan kalkulasi dividen harian, komisi referral 3-level, potongan biaya admin, dan integritas transaksi ledger.

4. **Data Access Layer (`server/db/`, Prisma ORM)**
   - Abstraksi repository pattern untuk manipulasi data tabel PostgreSQL secara aman dari SQL Injection.

---

## 2. DIAGRAM HUBUNGAN ENTITAS (ERD / DATABASE DIAGRAM)

```
┌─────────────────────────┐         ┌─────────────────────────┐
│          USERS          │         │       INVESTMENTS       │
├─────────────────────────┤         ├─────────────────────────┤
│ id (PK)                 │1       *│ id (PK)                 │
│ email (UNIQUE)          │├────────┤ userId (FK)             │
│ fullName                │         │ productId (FK)          │
│ mainWalletBalance       │         │ amountInvested          │
│ profitWalletBalance     │         │ dailyYieldAmount        │
│ referralCode (UNIQUE)   │         │ status (ACTIVE/CLOSED)  │
│ referredByUserId (FK)   │         │ createdAt               │
└────────────┬────────────┘         └─────────────────────────┘
             │ 1
             │
             │ *
┌────────────▼────────────┐         ┌─────────────────────────┐
│      TRANSACTIONS       │         │       AUDIT_LOGS        │
├─────────────────────────┤         ├─────────────────────────┤
│ id (PK)                 │         │ id (PK)                 │
│ userId (FK)             │         │ userId (FK)             │
│ referenceNo (UNIQUE)    │         │ module (AUTH/WALLET/...)│
│ type (DEPOSIT/WITHDRAW) │         │ action                  │
│ amount                  │         │ details                 │
│ status (APPROVED/...)   │         │ ipAddress               │
│ createdAt               │         │ createdAt               │
└─────────────────────────┘         └─────────────────────────┘
```

---

## 3. USE CASE DIAGRAM

```
                 ┌─────────────────────────────────────────────────┐
                 │                 NEXA CAPITAL SYSTEM             │
                 │                                                 │
                 │  ( Register & Login JWT )                       │
                 │                     ▲                           │
                 │                     │                           │
  [ INVESTOR ] ──┼──► ( Deposit & Withdraw Wallet )                │
                 │                     │                           │
                 │  ( Beli Paket Fast Yield & Klaim Dividen )      │
                 │                     │                           │
                 │  ( Tanya Jawab Asisten NexaAI )                 │
                 │                                                 │
                 │  ( Kelola User & Verifikasi Transaksi ) ◄───────┼── [ ADMIN ]
                 │                     │                           │
                 │  ( Terbitkan Pengumuman Platform ) ◄─────────────┼── [ ADMIN ]
                 │                     │                           │
                 │  ( Buat Laporan Eksekutif PDF/CSV ) ───────────┼── [ ADMIN ]
                 └─────────────────────────────────────────────────┘
```

---

## 4. SEQUENCE DIAGRAM — ALUR INVESTASI & KLAIM DIVIDEN

```
  [ Investor ]              [ Frontend UI ]           [ Express Server ]         [ Nexa Database ]
       │                           │                          │                         │
       │─── 1. Beli Paket Fast ───►│                          │                         │
       │                           │─── 2. POST /api/invest ─►│                         │
       │                           │    (Bearer JWT)          │                         │
       │                           │                          │─── 3. Deduct Wallet ───►│
       │                           │                          │    Create Investment    │
       │                           │                          │◄── 4. Success OK ───────│
       │                           │◄── 5. Return Status ─────│                         │
       │                           │                          │                         │
       │─── 6. Klaim Dividen ─────►│                          │                         │
       │                           │─── 7. POST /api/claim ──►│                         │
       │                           │                          │─── 8. Add Profit ──────►│
       │                           │                          │       Add Ledger Record │
       │                           │◄── 9. Profit Updated ────│◄── 10. Saved ───────────│
```

---

## 5. DIAGRAM INFRASTRUKTUR DEPLOYMENT

```
[ Internet Client ]
       │
       ▼
┌────────────────────────────────────────────────────────┐
│ Cloud Run / Nginx Reverse Proxy (Port 80/443 SSL)     │
│  - CSP Headers, Compression, Asset Caching             │
└──────────────────────────┬─────────────────────────────┘
                           │ Port 3000
┌──────────────────────────▼─────────────────────────────┐
│ Docker Container (Node.js 20 Alpine)                   │
│  - Express REST API Layer                              │
│  - Socket.IO WebSockets Engine                         │
│  - Gemini 3.6 Flash Client                             │
└──────────────┬──────────────────────────┬──────────────┘
               │                          │
┌──────────────▼─────────────┐  ┌─────────▼─────────────┐
│ PostgreSQL 16 Database     │  │ Redis 7 Queue Cache   │
└────────────────────────────┘  └───────────────────────┘
```
