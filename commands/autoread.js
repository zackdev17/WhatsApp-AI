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

const { getFlag, setFlag } = require('../lib/settings.js');
const ui = require('../lib/interactive.js');

module.exports = {
    name: 'autoread',
    description: 'Bot membaca pesan masuk seperti orang sungguhan (on/off)',
    ownerOnly: true,
    async execute({ zack, jid, args, prefix }) {
        const arg = (args[0] || '').toLowerCase();
        const say = (text) => zack.sendMessage(jid, { text }, { quoted: null });

        if (arg === 'on' || arg === 'off') {
            setFlag('autoRead', arg === 'on');
            return say(`✅ Auto-read sekarang *${arg === 'on' ? 'AKTIF' : 'MATI'}*.`);
        }

        const status = getFlag('autoRead') ? 'AKTIF ✅' : 'MATI ❌';
        const text = `Auto-read: *${status}*\n\nKalau aktif, pesan masuk dibaca (centang biru) dengan jeda acak seperti orang yang membuka WhatsApp.`;
        try {
            await ui.sendButtons(zack, jid, {
                title: 'AUTO READ',
                text,
                footer: global.botname || '',
                buttons: [
                    { type: 'reply', label: 'Aktifkan', value: `${prefix}autoread on` },
                    { type: 'reply', label: 'Matikan', value: `${prefix}autoread off` },
                ],
            });
        } catch (e) {
            await say(`${text}\n\nKetik ${prefix}autoread on atau ${prefix}autoread off.`);
        }
    },
};
