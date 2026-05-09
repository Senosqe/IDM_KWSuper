const { execSync } = require('child_process');
const path = require('path');
const exePath = path.join(__dirname, 'yt-dlp.exe');
try {
    const titleBuffer = execSync(`"${exePath}" --print title "https://www.youtube.com/watch?v=dQw4w9WgXcQ"`);
    console.log("Title:", titleBuffer.toString());
} catch(e) {
    console.log("Error:", e.message);
}
