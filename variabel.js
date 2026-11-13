/*

* ═══════════════════════════════════════════════
*                ZACKIRA AI
*         SISTEM BOT WHATSAPP CERDAS
* ═══════════════════════════════════════════════
* 
* © 12 November 2026 ZACKIRA AI.
* Seluruh hak cipta dilindungi.
* 
* Nama Proyek    : ZACKIRA AI
* Jenis Proyek   : Bot WhatsApp Berbasis Kecerdasan Buatan
* Pengembang     : ZACK
* Lisensi        : Sumber Terbuka (Open Source)
* Biaya          : Gratis
* 
* DESKRIPSI:
* ZACKIRA AI merupakan sistem bot WhatsApp cerdas
* yang dikembangkan untuk menghadirkan otomatisasi,
* kemudahan, dan pengalaman interaksi yang modern.
* 
* KETENTUAN PENGGUNAAN:
* 1. Dilarang memperjualbelikan script ini dalam
* bentuk apa pun tanpa izin pengembang.
* 
* 2. Dilarang mendistribusikan ulang script ini
* tanpa persetujuan dari pengembang.
* 
* 3. Dilarang menghapus, mengganti, atau memodifikasi
* watermark dan identitas asli pengembang.
* 
* 4. Setiap penggunaan dan pengembangan lanjutan
* wajib tetap mencantumkan atribusi kepada
* pengembang asli.
* 
* PENGHARGAAN:
* Hormati karya, waktu, dan usaha pengembang.
* Jangan mengklaim karya ini sebagai milik pribadi
* tanpa izin dari pengembang aslinya.
* 
* Dikembangkan dengan dedikasi oleh:
* ZACK
* 
* ═══════════════════════════════════════════════
*/

require('./lib/guard.js');

try {
    const fs = require('fs');
    const envPath = require('path').join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
        for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
            const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
            if (!m || line.trim().startsWith('#')) continue;
            const val = m[2].replace(/^(['"])(.*)\1$/, '$2');
            if (process.env[m[1]] === undefined) process.env[m[1]] = val;
        }
    }
} catch (e) {
    console.log('Gagal membaca .env:', e.message);
}

const env = process.env;

global.botname = 'ZACKIRA AI';
global.des = 'AI Assistant';
global.botVersion = 'v1.1.0';
global.botAuthor = 'ZACK';

global.namaSaluran = global.botname;
global.linkSaluran = '0@newsletter';
global.linkweb = 'https://whatsapp.com';

global.ownerNumbers = (env.OWNER_NUMBERS || '6289606860329')
    .split(',')
    .map((n) => n.trim())
    .filter(Boolean);

global.pairingNumber = env.PAIRING_NUMBER || '';

global.prefix = env.BOT_PREFIX || '.';

global.groqApiKey = env.GROQ_API_KEY || '';

global.groqModels = [
    'openai/gpt-oss-120b',
    'qwen/qwen3.8-27b',
    'llama-3.3-70b-versatile',
    'minimaxai/minimax-m2.7',
    'openai/gpt-oss-20b',
    'llama-3.1-8b-instant',
    'openai/gpt-oss-safeguard-20b',
];

global.groqChatModels = [
    'openai/gpt-oss-20b',
    'llama-3.3-70b-versatile',
    'llama-3.1-8b-instant',
    'qwen/qwen3.8-27b',
    'openai/gpt-oss-120b',
];

global.groqCodeModels = [
    'llama-3.3-70b-versatile',
    'openai/gpt-oss-120b',
    'qwen/qwen3.8-27b',
    'openai/gpt-oss-20b',
    'minimaxai/minimax-m2.7',
];

global.groqVisionModels = ['qwen/qwen3.8-27b', 'qwen/qwen3.6-27b'];

global.maxMediaMinutes = Number(env.MAX_MEDIA_MINUTES) || 15;
global.maxMediaMB = Number(env.MAX_MEDIA_MB) || 45;
global.ytCookiesPath = env.YTDLP_COOKIES || '';

module.exports = {};
