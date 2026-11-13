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

const http = require('http');
const axios = require('axios');

function startKeepAlive() {
    const port = process.env.PORT;
    if (!port) return;

    http
        .createServer((req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end(`${global.botname || 'Bot'} aktif. Uptime: ${Math.floor(process.uptime() / 60)} menit\n`);
        })
        .listen(Number(port), '0.0.0.0', () => console.log(`[keepalive] server HTTP di port ${port}`));

    const url = process.env.KEEPALIVE_URL || process.env.RENDER_EXTERNAL_URL;
    if (url) {
        setInterval(() => {
            axios.get(url, { timeout: 15000 }).catch((e) => console.log('[keepalive] ping gagal:', e.message));
        }, 10 * 60 * 1000).unref();
        console.log(`[keepalive] ping tiap 10 menit ke ${url}`);
    }
}

module.exports = { startKeepAlive };
