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

const { getChatMode, setChatMode } = require('../lib/settings.js');

module.exports = {
    name: 'mode',
    description: 'Atur AI balas di private chat / group / keduanya',
    ownerOnly: true,
    async execute({ zack, jid, args, prefix }) {
        const arg = (args[0] || '').toLowerCase();

        if (!arg) {
            await zack.sendMessage(
                jid,
                {
                    text:
                        `Mode chat AI saat ini: *${getChatMode()}*\n\n` +
                        `Cara ganti:\n` +
                        `${prefix}mode all → balas di private chat & group\n` +
                        `${prefix}mode private → cuma balas di private chat\n` +
                        `${prefix}mode group → cuma balas di group`,
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

        setChatMode(arg);
        await zack.sendMessage(jid, { text: `✅ Mode chat AI diubah jadi *${arg}*.` }, { quoted: null });
    },
};