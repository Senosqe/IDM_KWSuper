const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const ytdl = require('@distube/ytdl-core');
const mime = require('mime-types');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Path join supaya aman pas dibungkus jadi EXE
app.use(express.static(path.join(__dirname, 'public')));

let downloadMode = 'auto'; 
let isDownloading = false;

// --- FUNGSI TOOLS ---

function pilihFolderUI() {
    const script = "Add-Type -AssemblyName System.windows.forms; $dialog = New-Object System.Windows.Forms.FolderBrowserDialog; if ($dialog.ShowDialog() -eq [System.Windows.Forms.DialogResult]::OK) { $dialog.SelectedPath }";
    try {
        const result = execSync("powershell -NoProfile -Command \"" + script + "\"", { encoding: 'utf8' });
        return result.trim();
    } catch (err) { return null; }
}

function cekClipboard() {
    try {
        return execSync('powershell -NoProfile -Command "Get-Clipboard"', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    } catch (e) { return ""; }
}

// --- ENGINE DOWNLOAD ---

async function fastDownload(fileUrl, finalPath) {
    try {
        let totalBytes = 0;
        const headRes = await axios.head(fileUrl, { timeout: 10000 }).catch(() => null);
        if (headRes && headRes.headers['content-length']) {
            totalBytes = parseInt(headRes.headers['content-length'], 10);
        }
        
        if (!totalBytes || isNaN(totalBytes)) {
            const getRes = await axios.get(fileUrl, { headers: { 'Range': 'bytes=0-0' }, timeout: 10000 }).catch(() => null);
            if (getRes && getRes.headers['content-range']) {
                totalBytes = parseInt(getRes.headers['content-range'].split('/')[1], 10);
            } else if (getRes && getRes.headers['content-length']) {
                totalBytes = parseInt(getRes.headers['content-length'], 10);
            }
        }

        if (!totalBytes || isNaN(totalBytes)) {
            const res = await axios({ url: fileUrl, method: 'GET', responseType: 'stream' });
            let downloaded = 0;
            const writer = fs.createWriteStream(finalPath);
            res.data.on('data', c => {
                downloaded += c.length;
                io.emit('progress', { percent: 'Menyedot...' });
            });
            res.data.pipe(writer);
            await new Promise(r => writer.on('finish', r));
            io.emit('done');
            return;
        }

        const threads = 4;
        const chunkSize = Math.floor(totalBytes / threads);
        let downloadedBytes = 0;

        const promises = [];
        for (let i = 0; i < threads; i++) {
            const start = i * chunkSize;
            const end = i === threads - 1 ? totalBytes - 1 : (start + chunkSize - 1);
            const p = axios({ url: fileUrl, method: 'GET', headers: { Range: `bytes=${start}-${end}` }, responseType: 'stream' })
                .then(res => {
                    const writer = fs.createWriteStream(`${finalPath}.part${i}`);
                    res.data.on('data', c => {
                        downloadedBytes += c.length;
                        io.emit('progress', { percent: ((downloadedBytes / totalBytes) * 100).toFixed(1) });
                    });
                    res.data.pipe(writer);
                    return new Promise(rel => writer.on('close', rel));
                });
            promises.push(p);
        }
        await Promise.all(promises);
        const writeStream = fs.createWriteStream(finalPath);
        for (let i = 0; i < threads; i++) {
            writeStream.write(fs.readFileSync(`${finalPath}.part${i}`));
            fs.unlinkSync(`${finalPath}.part${i}`);
        }
        writeStream.end();
        io.emit('done');
    } catch (e) {
        io.emit('status', { msg: "Gagal IDM Engine: " + e.message });
    }
}

async function handleSpecialDownload(url, saveDir) {
    // A. JALUR YOUTUBE
    if (ytdl.validateURL(url) || url.includes('youtube.com') || url.includes('youtu.be')) {
        io.emit('status', { msg: "Ngebongkar YouTube pakai Engine Khusus..." });
        try {
            const exePath = path.join(__dirname, 'yt-dlp.exe');
            if (!fs.existsSync(exePath)) {
                io.emit('status', { msg: "Download engine YouTube (yt-dlp)... Tunggu bentar!" });
                const res = await axios({ url: "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe", responseType: 'stream' });
                const writer = fs.createWriteStream(exePath);
                let down = 0;
                const tot = parseInt(res.headers['content-length'] || '0', 10);
                res.data.on('data', c => {
                    down += c.length;
                    if (tot > 0) io.emit('progress', { percent: ((down/tot)*100).toFixed(1) });
                });
                res.data.pipe(writer);
                await new Promise((resolve) => writer.on('finish', resolve));
            }

            io.emit('status', { msg: "Menganalisa video YouTube..." });
            const { spawn } = require('child_process');

            let formatArgs;
            if (downloadMode === 'mp3') {
                formatArgs = ['-f', 'bestaudio', '-o', path.join(saveDir, '%(title)s.mp3'), url];
            } else {
                formatArgs = ['-f', 'best[ext=mp4]/best', '-o', path.join(saveDir, '%(title)s.mp4'), url];
            }

            io.emit('status', { msg: "Menyedot file dari server YouTube..." });
            await new Promise((resolve, reject) => {
                const child = spawn(exePath, formatArgs);
                child.stdout.on('data', data => {
                    const out = data.toString();
                    const match = out.match(/\[download\]\s+([\d\.]+)%/);
                    if (match) io.emit('progress', { percent: match[1] });
                });
                child.on('close', code => {
                    if (code === 0) {
                        io.emit('done');
                        resolve();
                    } else reject(new Error("yt-dlp error code " + code));
                });
            });
            return true;
        } catch (err) {
            io.emit('status', { msg: "YouTube Error: " + err.message });
            return true; 
        }
    }

    // B. JALUR TIKTOK
    if (url.includes('tiktok.com')) {
        io.emit('status', { msg: "Nge-bypass TikTok..." });
        try {
            const res = await axios.get(`https://www.tikwm.com/api/?url=${url}`, { timeout: 15000 });
            let targetUrl = '', fileName = '';
            
            if (downloadMode === 'mp3') {
                targetUrl = res.data.data.music || res.data.data.music_info?.play;
                fileName = `TikTok_Audio_${Date.now()}.mp3`;
            } else {
                targetUrl = res.data.data.play;
                fileName = `TikTok_Video_${Date.now()}.mp4`;
            }

            if (!targetUrl) throw new Error("Gagal mengambil link dari API TikTok.");

            io.emit('status', { msg: "Menyedot TikTok pakai IDM Engine..." });
            await fastDownload(targetUrl, path.join(saveDir, fileName));
            return true;
        } catch (e) {
            io.emit('status', { msg: "TikTok Error: " + e.message });
            return true;
        }
    }
    // C. JALUR INSTAGRAM
    if (url.includes('instagram.com') || downloadMode === 'ig') {
        io.emit('status', { msg: "Nge-bypass Instagram via Node Scraper & IDM Engine..." });
        try {
            // Coba pakai instagram-url-direct dulu (Bypass anti-bot) dengan Timeout 10 Detik
            const { instagramGetUrl } = require('instagram-url-direct');
            let links = [];
            try {
                const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout scraper')), 10000));
                const igRes = await Promise.race([instagramGetUrl(url), timeoutPromise]);
                if (igRes && igRes.url_list && igRes.url_list.length > 0) {
                    links = igRes.url_list;
                }
            } catch(e) {
                console.log("Scraper Node gagal, lanjut ke yt-dlp...");
            }

            if (links.length > 0) {
                io.emit('status', { msg: "Link direct Instagram berhasil didapat!" });
                // Ambil link pertama
                const targetUrl = links[0];
                const extMatch = targetUrl.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
                const ext = extMatch ? `.${extMatch[1]}` : '.mp4';
                const fileName = `Instagram_${Date.now()}${ext}`;
                
                io.emit('status', { msg: "Menyedot Instagram pakai IDM Engine..." });
                await fastDownload(targetUrl, path.join(saveDir, fileName));
                return true;
            }

            // FALLBACK KE YT-DLP JIKA NODE SCRAPER GAGAL
            io.emit('status', { msg: "Node Scraper gagal, beralih ke yt-dlp..." });
            const exePath = path.join(__dirname, 'yt-dlp.exe');
            if (!fs.existsSync(exePath)) {
                io.emit('status', { msg: "Download engine (yt-dlp)... Tunggu bentar!" });
                const res = await axios({ url: "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe", responseType: 'stream' });
                const writer = fs.createWriteStream(exePath);
                let down = 0;
                const tot = parseInt(res.headers['content-length'] || '0', 10);
                res.data.on('data', c => {
                    down += c.length;
                    if (tot > 0) io.emit('progress', { percent: ((down/tot)*100).toFixed(1) });
                });
                res.data.pipe(writer);
                await new Promise((resolve) => writer.on('finish', resolve));
            }

            io.emit('status', { msg: "Menganalisa post Instagram..." });
            const { spawn } = require('child_process');

            let finalArgs = ['-f', 'best', '-o', path.join(saveDir, `Instagram_${Date.now()}.%(ext)s`), url];
            let actualFileName = '';

            io.emit('status', { msg: "Menyedot Instagram..." });
            await new Promise((resolve, reject) => {
                const child = spawn(exePath, finalArgs);
                
                child.stdout.on('data', data => {
                    const out = data.toString();
                    
                    const progressMatch = out.match(/\[download\]\s+([\d\.]+)%/);
                    if (progressMatch) io.emit('progress', { percent: progressMatch[1] });
                    
                    // Coba tangkap nama file asli yang disimpan yt-dlp
                    const destMatch = out.match(/Destination:\s*(.+)/);
                    if (destMatch) {
                        actualFileName = destMatch[1].split('\\').pop().split('/').pop();
                    } else if (out.includes('has already been downloaded')) {
                        const preMatch = out.match(/\[download\]\s*(.+)\s*has already been downloaded/);
                        if (preMatch) actualFileName = preMatch[1].split('\\').pop().split('/').pop();
                    }
                });

                child.on('close', code => {
                    if (code === 0) {
                        if (actualFileName) io.emit('status', { msg: `✅ KELAR BRE! (${actualFileName})` });
                        else io.emit('status', { msg: "✅ KELAR BRE! Cek folder!" });
                        
                        // Set progress bar ke 100% jika yt-dlp selesai duluan atau sudah pernah di-download
                        io.emit('progress', { percent: 100 });
                        setTimeout(() => io.emit('done'), 500);
                        resolve();
                    } else reject(new Error("Gagal! IG mungkin minta login. Coba copy link 'direct'-nya aja."));
                });
            });
            return true;
        } catch (err) {
            io.emit('status', { msg: "IG Error: " + err.message });
            return true; 
        }
    }

    return false; 
}

async function startEngine(url) {
    if (isDownloading) return;
    isDownloading = true;
    io.emit('target-locked', { url: url });

    const saveDir = pilihFolderUI();
    if (!saveDir) { isDownloading = false; return; }

    try {
        const isSpecial = await handleSpecialDownload(url, saveDir);
        if (!isSpecial) {
            io.emit('status', { msg: "Menganalisa format file..." });
            let fileName = url.split('/').pop().split('?')[0] || `Download_${Date.now()}`;
            let ext = '';

            try {
                const headRes = await axios.head(url, { timeout: 10000 }).catch(() => axios.get(url, { headers: { Range: 'bytes=0-0' }, timeout: 10000 }));
                if (headRes) {
                    const disp = headRes.headers['content-disposition'];
                    if (disp && disp.includes('filename=')) {
                        const matchQuoted = disp.match(/filename="([^"]+)"/);
                        const matchUnquoted = disp.match(/filename=([^;]+)/);
                        
                        if (matchQuoted && matchQuoted[1]) fileName = matchQuoted[1];
                        else if (matchUnquoted && matchUnquoted[1]) fileName = matchUnquoted[1].trim();
                    } else {
                        const cType = headRes.headers['content-type'] || '';
                        const mimeExt = mime.extension(cType.split(';')[0]);
                        
                        if (cType.includes('application/x-msdownload') || cType.includes('application/x-dosexec') || cType.includes('application/vnd.microsoft.portable-executable') || url.toLowerCase().includes('.exe')) ext = '.exe';
                        else if (mimeExt) ext = '.' + mimeExt;
                        else if (cType.includes('image/jpeg')) ext = '.jpg';
                        else if (cType.includes('image/png')) ext = '.png';
                        else if (cType.includes('video/mp4')) ext = '.mp4';
                        else if (cType.includes('application/zip')) ext = '.zip';
                        else if (cType.includes('application/pdf')) ext = '.pdf';
                        else if (cType.includes('application/x-rar')) ext = '.rar';
                        else if (cType.includes('application/octet-stream') && url.includes('.exe')) ext = '.exe';
                    }
                }
            } catch(e) {}

            fileName = fileName.replace(/[<>:"/\\|?*]+/g, '_');
            
            if (!fileName.includes('.')) {
                fileName += ext || '.bin';
            }

            io.emit('status', { msg: "Sedot file (4 Jalur IDM Engine)..." });
            await fastDownload(url, path.join(saveDir, fileName));
        }
    } catch (e) { 
        io.emit('status', { msg: "Error: " + e.message }); 
    }
    isDownloading = false;
}

// --- KONTROLER ---

// Monitor Clipboard (Filter Sosmed)
setInterval(() => {
    const clip = cekClipboard();
    if (clip.startsWith('http') && clip !== global.lastClip) {
        global.lastClip = clip;
        
        // Filter: Kalau YT atau TikTok, jangan auto-trigger
        if (clip.includes('youtube.com') || clip.includes('youtu.be') || clip.includes('tiktok.com')) {
            console.log("Link Sosmed terdeteksi, nunggu input manual di UI...");
            return;
        }
        
        startEngine(clip);
    }
}, 2000);

io.on('connection', (socket) => {
    socket.on('changeMode', (m) => { downloadMode = m; });
    socket.on('manualDownload', (url) => {
        console.log("Manual trigger: " + url);
        startEngine(url);
    });
});

server.listen(3000, () => {
    console.log("=========================================");
    console.log("🚀 IDM KW ULTIMATE JALAN!");
    console.log("Buka di browser: http://localhost:3000");
    console.log("=========================================");
});