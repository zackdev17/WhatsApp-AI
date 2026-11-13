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

const root = path.join(__dirname, '..');
const guardFile = path.join(root, 'lib', 'guard.js');
const source = fs.readFileSync(guardFile, 'utf8');
const name = (source.match(/const GUARD_FILE = '([^']+)'/) || [])[1];
if (!name) throw new Error('GUARD_FILE tidak ditemukan di lib/guard.js');

const raw = fs.readFileSync(path.join(root, name), 'utf8');
const hash = crypto.createHash('sha256').update(raw.replace(/\r\n/g, '\n').trimEnd()).digest('hex');

const updated = source.replace(/const GUARD_SHA256 = '[0-9a-f]*';/, `const GUARD_SHA256 = '${hash}';`);
if (updated === source && !source.includes(hash)) throw new Error('GUARD_SHA256 tidak ditemukan di lib/guard.js');
fs.writeFileSync(guardFile, updated);
console.log(`Hash ${name} diperbarui:\n${hash}`);
