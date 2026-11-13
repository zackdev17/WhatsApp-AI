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
const crypto = require('crypto');

const GUARD_FILE = 'DONT_DELETE.ts';
const GUARD_SHA256 = '600e585ff7c722e66b9aa11e8bcfe1d7586a4e1f581ce8e3084e3a0f4fef1d67';
const CHECK_EVERY_MS = 15000;

const guardPath = path.join(__dirname, '..', GUARD_FILE);

function problem() {
    let raw;
    try {
        raw = fs.readFileSync(guardPath, 'utf8');
    } catch {
        return `File "${GUARD_FILE}" tidak ditemukan.`;
    }
    const digest = crypto.createHash('sha256').update(raw.replace(/\r\n/g, '\n').trimEnd()).digest('hex');
    if (digest !== GUARD_SHA256) return `Isi file "${GUARD_FILE}" telah diubah.`;
    return null;
}

function fatal(reason) {
    const line = '='.repeat(60);
    console.error(`\n${line}\nBOT DIHENTIKAN: ${reason}\nFile "${GUARD_FILE}" wajib ada dan tidak boleh diubah.\nKembalikan file aslinya, lalu jalankan ulang bot.\n${line}\n`);
    process.exit(1);
}

function assertIntact() {
    const reason = problem();
    if (reason) fatal(reason);
}

assertIntact();
setInterval(assertIntact, CHECK_EVERY_MS).unref();

module.exports = { assertIntact, GUARD_FILE };
