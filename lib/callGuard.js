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
const { isOwner } = require('./owner.js');

const handled = new Set();

async function handleCalls(zack, calls) {
    if (!getFlag('antiCall')) return;
    for (const call of calls || []) {
        if (!call || call.status !== 'offer' || handled.has(call.id)) continue;
        handled.add(call.id);
        if (handled.size > 200) handled.delete(handled.values().next().value);

        const caller = call.callerPn || call.from;
        try {
            await zack.rejectCall(call.id, call.from);
        } catch (e) {
            console.log('[CALL] gagal menolak telepon:', e.message);
        }
        if (call.isGroup) {
            console.log('[CALL] telepon grup ditolak');
            continue;
        }
        if ((await isOwner(zack, call.from)) || (await isOwner(zack, caller))) {
            console.log('[CALL] telepon owner ditolak, tidak diblokir');
            continue;
        }
        try {
            await zack.sendMessage(caller, { text: '📵 Maaf, bot tidak menerima telepon. Nomor kamu diblokir otomatis.' });
        } catch (e) {
            console.log('[CALL] gagal kirim pesan peringatan:', e.message);
        }
        try {
            await zack.updateBlockStatus(caller, 'block');
            console.log(`[CALL] ${caller} menelepon -> ditolak & diblokir`);
        } catch (e) {
            console.log('[CALL] gagal memblokir:', e.message);
        }
    }
}

module.exports = { handleCalls };
