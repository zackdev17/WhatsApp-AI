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

const { getFlag } = require('./settings.js');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function readDelay(text) {
    const len = String(text || '').length;
    return Math.min(4000, 800 + Math.min(len, 120) * 25 + Math.floor(Math.random() * 1200));
}

async function humanRead(zack, z, text) {
    if (!getFlag('autoRead')) return;
    try {
        const jid = z.key.remoteJid;
        await zack.sendPresenceUpdate('available', jid).catch(() => {});
        await sleep(readDelay(text));
        await zack.readMessages([z.key]);
    } catch (e) {
        console.log('[READ] gagal menandai dibaca:', e.message);
    }
}

module.exports = { humanRead, readDelay };
