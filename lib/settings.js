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

const fs = require('fs');
const path = require('path');

const settingsFile = path.join(process.cwd(), 'database', 'settings.json');

function ensureDir() {
    const dir = path.dirname(settingsFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadSettings() {
    ensureDir();
    if (!fs.existsSync(settingsFile)) {
        return { chatMode: 'private', botMode: 'all', antiCall: false, autoRead: false };
    }
    try {
        const raw = fs.readFileSync(settingsFile, 'utf8');
        const parsed = JSON.parse(raw);
        return { chatMode: 'private', botMode: 'all', ...parsed };
    } catch (e) {
        return { chatMode: 'private', botMode: 'all', antiCall: false, autoRead: false };
    }
}

function saveSettings(settings) {
    ensureDir();
    fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
}

function getChatMode() {
    return loadSettings().chatMode || 'all';
}

function setChatMode(mode) {
    const settings = loadSettings();
    settings.chatMode = mode;
    saveSettings(settings);
    return settings.chatMode;
}

function getBotMode() {
    return loadSettings().botMode || 'all';
}

function setBotMode(mode) {
    const settings = loadSettings();
    settings.botMode = mode;
    saveSettings(settings);
    return settings.botMode;
}

function getFlag(name) {
    return loadSettings()[name] === true;
}

function setFlag(name, value) {
    const settings = loadSettings();
    settings[name] = !!value;
    saveSettings(settings);
    return settings[name];
}

module.exports = { getFlag, setFlag, getChatMode, setChatMode, getBotMode, setBotMode };