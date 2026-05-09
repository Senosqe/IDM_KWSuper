# IDM KW Super (Ultimate Edition) 🚀

![Banner](https://img.shields.io/badge/IDM--KW--Super-Ultimate--Edition-yellow?style=for-the-badge&logo=rocket)
![Node.js](https://img.shields.io/badge/Node.js-v20+-green?style=flat-square&logo=node.js)
![OS](https://img.shields.io/badge/OS-Windows-blue?style=flat-square&logo=windows)

**IDM KW Super** adalah pengunduh media dan file berperforma tinggi yang dibangun menggunakan Node.js. Aplikasi ini memiliki antarmuka bertema Cyberpunk yang modern dan mesin backend tangguh yang dirancang untuk memberikan kecepatan unduhan multi-threaded layaknya Internet Download Manager (IDM) asli.

---

## 🌟 Fitur Utama

### 1. 🚀 Universal Auto-Sniffer (Auto Mode)
Sistem cerdas yang mampu mendeteksi dan mengunduh hampir semua jenis file dari link langsung:
- **Media:** `.mp4`, `.png`, `.jpg`, `.mp3`.
- **Dokumen:** `.pdf`, `.docx`, `.zip`, `.rar`.
- **Fitur Baru (Eksperimental):** Pendeteksian cerdas untuk file **Aplikasi (`.exe`, `.msi`)** dan **Presentasi (`.ppt`, `.pptx`)**.

### 2. 🎥 Integrasi Media Sosial (Engine Khusus)
- **YouTube:** Ekstraksi Video & Audio (MP3) kualitas tinggi via `yt-dlp`.
- **TikTok:** Download tanpa watermark dan ekstraksi audio otomatis.
- **Instagram:** Scraper berlapis untuk menembus proteksi bot Instagram.

### 3. ⚡ Multi-Threaded Engine
Membagi file menjadi **4 jalur paralel** (chunks) untuk memaksimalkan penggunaan bandwidth dan mempercepat waktu unduh.

### 4. 📋 Clipboard Monitoring
Mendeteksi link yang disalin secara otomatis dan memfilternya secara cerdas untuk memudahkan proses unduhan tanpa perlu bolak-balik aplikasi.

---

## 🛠️ Cara Instalasi & Penggunaan

### Persyaratan Sistem
- **Node.js** (Versi 20 ke atas direkomendasikan)
- **Windows OS** (Diperlukan untuk fitur pemilih folder PowerShell)

### Langkah Instalasi
1. **Download/Clone** repository ini ke komputer Anda.
2. Buka folder proyek di Terminal atau CMD.
3. Jalankan perintah berikut untuk menginstal library yang dibutuhkan:
   ```bash
   npm install
   ```
4. Setelah instalasi selesai, jalankan aplikasi dengan perintah:
   ```bash
   node main.js
   ```
5. Buka browser dan akses alamat berikut:
   **[http://localhost:3000](http://localhost:3000)**

---

## 📖 Panduan Penggunaan
1. Pilih **Mode** di UI (Auto, YouTube, TikTok, atau Instagram).
2. Salin link target. Aplikasi akan mendeteksi secara otomatis atau Anda bisa menempelkan (paste) secara manual.
3. Klik tombol **"SEDOT!"**.
4. Pilih folder penyimpanan pada jendela yang muncul.
5. Pantau progres download pada progress bar Cyberpunk yang interaktif.

---

## 🔧 Detail Teknis
- **Backend:** Node.js, Express, Socket.IO, Axios.
- **Frontend:** HTML5, CSS3 (Cyberpunk-Glassmorphism), JavaScript.
- **Engine Tambahan:** `yt-dlp.exe` (Akan diunduh otomatis saat pertama kali digunakan).

---

## 📝 Catatan Pengembangan
- Saat ini pendeteksian otomatis untuk file `.exe` dan `.pptx` sedang dalam tahap optimalisasi untuk memastikan akurasi ekstensi file pada berbagai jenis server.
- Pastikan koneksi internet stabil saat inisialisasi awal (unduh engine `yt-dlp`).

---

> *Dibuat untuk kecepatan. Dikendalikan dengan brutal.* ⚡
