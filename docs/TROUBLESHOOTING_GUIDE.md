# NEXA CAPITAL — TROUBLESHOOTING & MAINTENANCE GUIDE

Panduan pemecahan masalah (troubleshooting), penanganan kode kesalahan, serta pemulihan sistem platform **Nexa Capital**.

---

## 1. KODE ERROR DAN SOLUSINYA

| Kode HTTP | Deskripsi Error | Penyebab Utama | Solusi / Penanganan |
| :--- | :--- | :--- | :--- |
| **401 Unauthorized** | Token tidak valid atau kedaluwarsa. | JWT Bearer token pada header request tidak disertakan atau telah expired. | Minta pengguna melakukan login ulang untuk memperbarui token akses. |
| **403 Forbidden** | Akses ditolak. | Pengguna biasa mencoba mengakses endpoint khusus role `ADMIN`. | Pastikan akun memiliki peran `ADMIN` di database. |
| **400 Bad Request** | Saldo tidak mencukupi. | Nominal pembelian produk atau penarikan melebihi saldo wallet investor. | Lakukan top-up deposit terlebih dahulu melalui menu Wallet. |
| **500 Internal Error** | Gagal memproses permintaan AI Gemini. | Key `GEMINI_API_KEY` tidak dikonfigurasi atau kuota API habis. | Periksa konfigurasi file `.env` di server dan pastikan API key valid. |
| **503 Service Unavailable** | Mode Pemeliharaan Aktif. | Platform sedang dalam pemeliharaan terjadwal oleh tim engineer. | Tunggu hingga jendela maintenance selesai atau matikan mode maintenance di admin. |

---

## 2. PEMULIHAN LAYANAN PWA (CACHE CLEARING)

Jika pengguna mengalami tampilan lama atau tidak dapat melihat pembaruan fitur terbaru:

1. Minta pengguna mengeklik tombol **"Update Aplikasi"** pada spanduk PWA yang muncul di bagian atas layar.
2. Jika masalah berlanjut di Chrome / Edge Browser:
   - Tekan `F12` untuk membuka Developer Tools.
   - Buka tab **Application** > **Service Workers**.
   - Klik **Unregister** atau **Update**.
   - Buka **Storage** > Klik **Clear site data**.
   - Muat ulang halaman (`Ctrl + F5` / `Cmd + Shift + R`).

---

## 3. PROSEDUR BACAKUP & RESTORE DATABASE

### Backup Database PostgreSQL
```bash
docker exec -t nexa-postgres pg_dump -U nexa_user nexa_capital > nexa_backup_$(date +%Y%m%d).sql
```

### Restore Database PostgreSQL
```bash
cat nexa_backup_20260805.sql | docker exec -i nexa-postgres psql -U nexa_user -d nexa_capital
```

---

## 4. PERTANYAAN UMUM (FAQ)

### Q: Mengapa dividen harian tidak masuk ke Saldo Main Wallet?
**A:** Hasil dividen secara otomatis dialokasikan ke **Profit Wallet (Saldo Dividen)** untuk menjaga transparansi antara modal awal dan pendapatan bersih. Investor dapat memindahkan saldo profit ke Main Wallet atau langsung mengajukan penarikan kapan saja.

### Q: Apakah transaksi penarikan saldo diproses secara otomatis 24/7?
**A:** Ya, sistem kami mendukung pengajuan penarikan instan 24/7. Transaksi di bawah ambang batas batas otomatis diproses seketika, sedangkan transaksi skala besar memerlukan verifikasi cepat oleh Finance Admin untuk alasan keamanan.
