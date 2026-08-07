# NEXA CAPITAL — ADMINISTRATOR OPERATIONAL GUIDE

Dokumen operasional resmi untuk tim pengelola sistem, finance admin, dan superadministrator platform **Nexa Capital**.

---

## 1. HAK AKSES & OTORISASI ADMIN

Sistem Nexa Capital mengimplementasikan Role-Based Access Control (RBAC) ketat:
- **`SUPERADMIN` / `SUPER_ADMIN`**: Akses penuh ke seluruh konfigurasi sistem, audit log, manipulasi saldo pengguna, manajemen produk, dan pembuatan pengumuman.
- **`ADMIN` / `FINANCE_ADMIN`**: Akses verifikasi persetujuan deposit/penarikan saldo, pembuatan laporan keuangan, dan pemantauan aktivitas investor.
- **`USER`**: Akses terbatas ke dasbor pribadi, pembelian produk, dan transaksi wallet.

---

## 2. PANDUAN VERIFIKASI DEPOSIT SALDO

1. Masuk ke portal Admin menggunakan akun dengan role `ADMIN`.
2. Buka tab **"Deposit Approvals"**.
3. Sistem akan menampilkan daftar pengajuan deposit dengan status `PENDING`.
4. Periksa bukti transfer atau nomor referensi pembayaran Virtual Account/QRIS/Manual.
5. Klik **"Approve"** untuk menyetujui:
   - Saldo secara otomatis akan ditambahkan ke **Main Wallet (Saldo Utama)** investor.
   - Status transaksi berubah menjadi `APPROVED`.
   - Notifikasi real-time dikirimkan ke dasbor investor.
6. Jika pembayaran tidak valid, klik **"Reject"** dan berikan alasan penolakan.

---

## 3. PANDUAN VERIFIKASI PENARIKAN SALDO (WITHDRAWAL)

1. Buka tab **"Withdrawal Requests"**.
2. Periksa detail rekening bank tujuan (Nomor Rekening, Nama Bank, Nama Pemilik Rekening) dan jumlah nominal penarikan.
3. Lakukan transfer dana dari rekening operasional ke rekening investor.
4. Klik **"Approve"** dan masukkan nomor referensi bank:
   - Saldo yang ditahan akan dipotong secara permanen dari **Main Wallet** investor.
5. Notifikasi konfirmasi akan diterbitkan secara otomatis.

---

## 4. PENERBITAN PENGUMUMAN PLATFORM

1. Buka tab **"Pengumuman"** di dasbor Admin.
2. Klik **"Buat Pengumuman Baru"**.
3. Isi kolom:
   - **Judul**: Pesan singkat yang menarik (misal: "🚀 Pembagian Dividen Saham Q2").
   - **Isi Konten**: Penjelasan detail perbaikan atau berita penting.
   - **Prioritas**: Pilih `NORMAL`, `HIGH`, atau `URGENT`.
   - **Target Pengguna**: `ALL` (semua pengguna) atau `USER` (investor saja).
4. Klik **"Terbitkan"**. Banner pengumuman akan langsung tayang secara live pada bilah atas dasbor seluruh investor.

---

## 5. GENERATOR LAPORAN EKSEKUTIF

1. Buka modul **"Laporan"**.
2. Klik **"Buat Laporan Baru"**.
3. Pilih kategori yang diinginkan (`REVENUE`, `INVESTMENT`, `TRANSACTION`, atau `REFERRAL`).
4. Tentukan rentang waktu (`MONTHLY`, `QUARTERLY`, `YEARLY`, atau `CUSTOM`).
5. Klik **"Proses Laporan"**.
6. Pilih opsi eksportasi:
   - **CSV / Excel**: Untuk pengolahan data statistik lebih lanjut.
   - **Cetak / PDF**: Untuk presentasi dan arsip laporan resmi keuangan.

---

## 6. PEMANTAUAN KESEHATAN SISTEM REAL-TIME

1. Buka modul **"System Monitoring"**.
2. Periksa parameter utama:
   - **API Status**: Memastikan status endpoint `HEALTHY`.
   - **Database Status**: Memastikan koneksi PostgreSQL Prisma Engine aktif.
   - **Penggunaan Memori**: Memastikan pemakaian RAM Heap di bawah 80%.
   - **Socket.IO Connections**: Memastikan jumlah socket terhubung berjalan normal.
