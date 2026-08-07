# NEXA CAPITAL — DEPLOYMENT & CLOUD ARCHITECTURE GUIDE

Dokumen panduan lengkap untuk melakukan penggelaran (deployment) platform enterprise **Nexa Capital** di lingkungan cloud staging dan produksi.

---

## 1. DOCKER & CONTAINER ORCHESTRATION

### Local & Server Production Run with Docker Compose
```bash
# Build dan jalankan seluruh service (Application, PostgreSQL 16, Redis 7)
docker-compose up -d --build

# Periksa log kontainer
docker-compose logs -f nexa-app
```

---

## 2. DEPLOYMENT PLATFORM RECOMMENDATIONS

### A. Vercel (Frontend Static + Serverless API)
1. Push repositori ke GitHub/GitLab.
2. Hubungkan akun Vercel dengan repositori.
3. Set **Framework Preset** ke `Vite`.
4. Tambahkan Environment Variables:
   - `VITE_API_URL`
   - `GEMINI_API_KEY`
5. Jalankan `Deploy`.

### B. Railway / Render (Full-Stack Express + Node Container)
1. Buat new project di Railway atau Render.
2. Hubungkan dengan repositori GitHub.
3. Pilih **Docker** sebagai build provider.
4. Tambahkan PostgreSQL Service & Redis Service dari marketplace Railway/Render.
5. Konfigurasi Environment Variables:
   - `PORT=3000`
   - `NODE_ENV=production`
   - `DATABASE_URL=postgresql://...`
   - `JWT_SECRET=your_super_secret_jwt_key`
   - `GEMINI_API_KEY=your_gemini_api_key`

### C. Google Cloud Run (GCP)
1. Build & Push kontainer ke Google Artifact Registry:
   ```bash
   gcloud builds submit --tag gcr.io/your-project-id/nexa-capital:latest
   ```
2. Deploy ke Cloud Run:
   ```bash
   gcloud run deploy nexa-capital \
     --image gcr.io/your-project-id/nexa-capital:latest \
     --platform managed \
     --region asia-southeast1 \
     --allow-unauthenticated \
     --port 3000
   ```

### D. AWS EC2 / DigitalOcean Droplet
1. Install Docker & Docker Compose pada server Linux Ubuntu:
   ```bash
   sudo apt update && sudo apt install docker.io docker-compose -y
   ```
2. Clone repositori & salin file `.env.example` ke `.env`:
   ```bash
   cp .env.example .env
   ```
3. Jalankan Nginx Reverse Proxy & SSL Certbot:
   ```bash
   docker-compose up -d
   ```

---

## 3. OPENAPI / SWAGGER DOCUMENTATION
Akses dokumentasi resmi API interaktif di:
- `http://localhost:3000/api/docs` (Swagger Interactive UI)
- `http://localhost:3000/api/docs/json` (OpenAPI 3.0 Specification)

---

## 4. CHECKLIST KEAMANAN PRODUKSI
- [x] Pastikan `JWT_SECRET` menggunakan string acak minimal 32 karakter.
- [x] Pastikan `GEMINI_API_KEY` disimpan dengan aman di server-side environment variables.
- [x] Pastikan header CSP, HSTS, X-Frame-Options, dan CORS diatur di `nginx.conf` & Express middleware.
- [x] PWA Service Worker diuji dalam mode HTTPS untuk offline caching.
