# 🚀 IDM KW Super (Ultimate Edition)

IDM KW Super adalah pengunduh serbaguna super cepat berbasis Node.js dengan antarmuka yang sangat modern (Cyberpunk Theme). Aplikasi ini dilengkapi dengan beberapa jalur *engine* khusus yang dirancang untuk membongkar proteksi dari berbagai situs populer maupun menyedot file dari internet secara *multi-threaded* selayaknya Internet Download Manager (IDM).

---

## 🌟 Fitur Unggulan

1. **🚀 Auto Mode (God Mode)**
   Mampu menyedot HAMPIR SEMUA jenis file (Aplikasi `.exe`, dokumen, `.zip`, `.pdf`, `.mp4`, `.png`, dll) dari *direct link* manapun. 
   - Dilengkapi **Content-Type Sniffer** pintar: Otomatis mencari tahu format asli dari file meski link tidak menampilkan eksistensi filenya!
   - **4-Jalur Download Bersamaan:** Kecepatan download dimaksimalkan dengan memecah file jadi 4 bagian yang didownload berbarengan!

2. **🎥 YouTube Downloader**
   Sistem cerdas untuk mendownload video maupun Audio (MP3) dari YouTube secara efisien tanpa tersendat menggunakan *engine* `yt-dlp` tersembunyi.
   
3. **🎵 TikTok Downloader**
   Bypass API TikTok. Video bersih tanpa *watermark* atau langsung ekstrak lagunya (MP3) dengan sekejap.

4. **📸 Instagram Downloader (Multi-Lapis)**
   Hajar proteksi bot Instagram! Menggunakan Node Scraper langsung, dan jika gagal otomatis mengaktifkan jalur cadangan rahasia via IDM Engine (`yt-dlp`). Tidak ada yang lolos!

5. **📋 Auto-Sniff Clipboard**
   Copy *link* apapun, aplikasinya akan langsung deteksi dari *Clipboard* Anda secara otomatis. Nggak perlu ribet bolak-balik Paste.

---

## 🛠️ Cara Install & Pakai

### Syarat Sistem
1. Pastikan Anda sudah menginstal **Node.js**.
2. Harus menggunakan OS **Windows** karena sistem penentuan folder (*Folder Picker*) menggunakan *PowerShell*.

### Instalasi
Buka terminal/CMD di folder ini, lalu jalankan:
```bash
npm install
```

### Menjalankan Server
Ketik perintah ini di terminal:
```bash
node main.js
```
Jika sukses, terminal akan menampilkan:
> `🚀 IDM KW ULTIMATE JALAN!`

Lalu buka browser kesayangan Anda dan pergi ke:
**[http://localhost:3000](http://localhost:3000)**

---

## 🖥️ Panduan Antarmuka (UI)

- **Mode Tab:** Pilih mode sesuai target Anda (`Auto`, `YouTube Video/MP3`, `TikTok Video/MP3`, `Instagram`).
- **Input Link:** Paste link (kalau *Clipboard monitor* gagal mendeteksinya).
- **Tombol "SEDOT!":** Sekali klik, akan muncul dialog pemilih folder, dan boom! Download berjalan dengan *progress bar* *real-time*.

---

## ⚠️ Peringatan
- Saat pertama kali mendownload video YouTube atau Instagram, IDM KW akan mengunduh paket `yt-dlp.exe` secara otomatis ke dalam folder aplikasi. Mohon tunggu proses awalnya sebentar (ukuran file sekitar ~18MB).
- Fitur *Auto Sniff* kadang menunda proses agar Anda punya waktu menentukan "Mode" jika Anda menyalin link YouTube atau TikTok. Tekan *SEDOT* manual dari tombol UI!

> *Diciptakan dengan kecepatan dan brutalitas untuk melawan limitasi bandwidth.* ⚡
