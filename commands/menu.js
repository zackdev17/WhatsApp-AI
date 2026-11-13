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
const { getChatMode } = require('../lib/settings.js');
const { isOwner } = require('../lib/owner.js');
const ui = require('../lib/interactive.js');

const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', "Jum'at", 'Sabtu'];
const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

function formatRuntime(ms) {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
}

function modeLabel(mode) {
    if (mode === 'private') return '🔒 Private';
    if (mode === 'group') return '👥 Group';
    return '🌐 Public';
}

function buildBox(icon, label, lines) {
    const body = lines.map((l) => `│ ${l}`).join('\n');
    return `┌──── 「 ${icon} *${label}* 」\n${body}\n└────────────────`;
}

function buildCaption({ pushName, statusLabel, runtime, jam, menit, detik, tanggal }) {
    const profileBox = buildBox('👤', 'USER PROFILE', [
        `• Nama   : ${pushName}`,
        `• Status : ${statusLabel}`,
    ]);

    const statusBox = buildBox('🤖', 'BOT STATUS', [
        `• Bot Name : ${global.botname}`,
        `• Runtime  : ${runtime}`,
        `• Version  : ${global.botVersion}`,
        `• Mode     : ${modeLabel(getChatMode())}`,
        `• Author   : ${global.botAuthor}`,
    ]);

    const timeBox = buildBox('🕰️', 'TIME & DATE', [
        `• Time : ${jam}:${menit}:${detik}`,
        `• Date : ${tanggal}`,
    ]);

    return `${profileBox}\n\n${statusBox}\n\n${timeBox}`;
}

function buildListMenuBox(prefix, commandRows) {
    const lines = commandRows.flatMap((r) => [
        `• *${prefix}${r.title}*`,
        `  ${r.description}`,
    ]);
    return buildBox('📜', 'LIST MENU', lines);
}

function buildMenuText(caption, prefix, commandRows) {
    const listBox = buildListMenuBox(prefix, commandRows);
    return `${caption}\n\n${listBox}\n\n© ${global.botAuthor}`;
}

async function sendTextMenu(zack, jid, caption, prefix, commandRows, imagePath) {
    const text = buildMenuText(caption, prefix, commandRows);

    if (imagePath && fs.existsSync(imagePath)) {
        await zack.sendMessage(
            jid,
            { image: fs.readFileSync(imagePath), caption: text },
            { quoted: null }
        );
    } else {
        await zack.sendMessage(jid, { text }, { quoted: null });
    }

    console.log('Menu (teks) sent successfully to', jid);
}

module.exports = {
    name: 'menu',
    description: 'Tampilkan menu utama bot (daftar tombol pilihan)',
    ownerOnly: false,
    async execute({ zack, jid, z, prefix, commands }) {
        const now = new Date();
        const jakartaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));

        const jam = String(jakartaTime.getHours()).padStart(2, '0');
        const menit = String(jakartaTime.getMinutes()).padStart(2, '0');
        const detik = String(jakartaTime.getSeconds()).padStart(2, '0');
        const tanggal = `${HARI[jakartaTime.getDay()]}, ${jakartaTime.getDate()} - ${BULAN[jakartaTime.getMonth()]} - ${jakartaTime.getFullYear()}`;

        const ownerOk = await isOwner(zack, z.sender);
        const statusLabel = ownerOk ? '👑 Owner' : '👤 User biasa';
        const runtime = formatRuntime(Date.now() - (global.startTime || Date.now()));

        const caption = buildCaption({
            pushName: z.pushName || 'Kak',
            statusLabel,
            runtime,
            jam,
            menit,
            detik,
            tanggal,
        });

        const imagePath = path.join(process.cwd(), 'image', 'menu.png');

        const commandRows = [...new Set(commands.values())]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((c) => ({
                title: c.name,
                description: c.description + (c.ownerOnly ? ' (khusus owner)' : ''),
            }));

        try {
            const all = [...new Set(commands.values())].sort((x, y) => x.name.localeCompare(y.name));
            const maxRows = ui.LIMITS.maxRows;
            const shown = all.slice(0, maxRows);
            const toRow = (c) => ({
                id: `${prefix}${c.name}`,
                title: `${prefix}${c.name}`,
                description: c.description + (c.ownerOnly ? ' (khusus owner)' : ''),
            });
            const sections = [
                { title: 'Perintah', rows: shown.filter((c) => !c.ownerOnly).map(toRow) },
                { title: 'Khusus Owner', rows: shown.filter((c) => c.ownerOnly).map(toRow) },
            ].filter((sec) => sec.rows.length);
            const rest = all.slice(maxRows);
            const text =
                `${caption}\n\nKetuk tombol *Pilih perintah* di bawah untuk menjalankan perintah.` +
                (rest.length ? `\n\nPerintah lain: ${rest.map((c) => prefix + c.name).join(', ')}` : '');

            await ui.sendList(zack, jid, {
                title: `${global.botname} MENU`,
                text,
                footer: `© ${global.botAuthor}`,
                buttonLabel: 'Pilih perintah',
                imageUrl: imagePath && fs.existsSync(imagePath) ? fs.readFileSync(imagePath) : undefined,
                sections,
            });
            console.log('Menu (list) sent successfully to', jid);
            return;
        } catch (error) {
            console.log('Menu list gagal, fallback ke menu teks:', error.message);
        }

        try {
            await sendTextMenu(zack, jid, caption, prefix, commandRows, imagePath);
        } catch (error) {
            console.log('Gagal kirim menu, fallback ke teks polos:', error.message);
            await zack.sendMessage(
                jid,
                { text: buildMenuText(caption, prefix, commandRows) },
                { quoted: null }
            );
        }
    },
};