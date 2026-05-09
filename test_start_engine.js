const io = { emit: (event, data) => console.log('EMIT:', event, data) };
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const mime = require('mime-types');

// Mock function
let isDownloading = false;
function pilihFolderUI() { return __dirname; }
async function fastDownload(u, p) { console.log('fastDownload called:', u, p); }
async function handleSpecialDownload() { return false; }

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
                const headRes = await axios.head(url).catch(() => axios.get(url, { headers: { Range: 'bytes=0-0' } }));
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
            } catch(e) { console.log('CATCHED ERROR:', e); }

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

startEngine('https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe');
