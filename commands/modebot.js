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

const { getBotMode, setBotMode } = require('../lib/settings.js');

module.exports = {
    name: 'modebot',
    description: 'Atur bot (command) aktif di private chat / group / keduanya',
    ownerOnly: true,
    async execute({ zack, jid, args, prefix }) {
        const arg = (args[0] || '').toLowerCase();

        if (!arg) {
            await zack.sendMessage(
                jid,
                {
                    text:
                        `Mode bot saat ini: *${getBotMode()}*\n\n` +
                        `Cara ganti:\n` +
                        `${prefix}modebot all → bot aktif di private chat & group\n` +
                        `${prefix}modebot private → bot cuma aktif di private chat\n` +
                        `${prefix}modebot group → bot cuma aktif di group`,
                },
                { quoted: null }
            );
            return;
        }

        if (!['all', 'private', 'group'].includes(arg)) {
            await zack.sendMessage(
                jid,
                { text: 'Mode tidak dikenali. Pilihan: all, private, group.' },
                { quoted: null }
            );
            return;
        }

        setBotMode(arg);
        await zack.sendMessage(jid, { text: `✅ Mode bot diubah jadi *${arg}*.` }, { quoted: null });
    },
};