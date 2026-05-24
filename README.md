# ⚡ IDM KW Ultimate (Desktop App)

Aplikasi Desktop (Portable) super cepat dan ringan untuk mengunduh video, musik, dan foto dari berbagai platform sosial media. Dibekali dengan antarmuka (*UI*) *Dark Mode* yang modern dan minimalis.

## ✨ Fitur Utama
* **Multi-Platform:** Mendukung unduhan dari **YouTube**, **TikTok**, **Instagram** (mendukung *carousel/multi-slide* foto), **Facebook**, dan **Twitter (X)**.
* **Auto Mode:** Mesin akan mendeteksi otomatis sumber *link* dan memberikan kualitas resolusi terbaik.
* **Format Fleksibel:** Bisa paksa unduh menjadi **Video (MP4)** atau murni **Audio/Music (MP3)**.
* **Native Desktop:** Berjalan mandiri tanpa *browser*. Aman dari masalah perizinan berkat sistem manajemen direktori khusus.
* **Real-time Tracking:** Pantau proses unduhan dengan *Progress Bar* langsung di layar.

## 🚀 Cara Memakai (Tanpa Coding)
1. Pergi ke tab **[Releases](../../releases)** di GitHub ini.
2. Download file `.zip` (Portable Windows) versi terbaru.
3. Ekstrak (Unzip) file tersebut di laptop kamu.
4. Klik dua kali pada **`IDM_KW_Ultimate.exe`** untuk membuka aplikasi.
5. *Paste link* video yang mau diunduh, klik **SEDOT!**, dan nikmati hasilnya.

## 💻 Cara Menjalankan (Bagi Developer)
Jika kamu ingin mengembangkan kode (Source Code) aplikasi ini:

**1. Clone & Install**
```bash
git clone https://github.com/USERNAME_KAMU/idm-kw-ultimate.git
cd idm-kw-ultimate
npm install
```

**2. Jalankan Mode Development**
```bash
npm start
```

**3. Build ke .exe (Portable)**
```bash
npm run build
```
*Hasil build akan tersimpan di dalam folder `dist/`.*

## 🛠️ Teknologi yang Digunakan
* **Desktop Engine:** Electron, Electron-Packager.
* **Backend:** Node.js, Express.js.
* **Frontend:** HTML5, CSS3, JavaScript murni (Tanpa framework demi kecepatan).
* **Komunikasi:** Socket.io (Real-time events).
* **Scraper Engine:** yt-dlp, axios, instagram-url-direct.

---
*Dibuat sebagai alat bantu unduh multi-platform super praktis.*
