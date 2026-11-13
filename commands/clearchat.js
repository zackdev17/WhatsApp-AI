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

const { parseJid, listHistories, clearHistory, clearAllHistories } = require('../lib/chatHistory.js');
const ui = require('../lib/interactive.js');

function ago(ms) {
    if (!ms) return '-';
    const m = Math.floor((Date.now() - ms) / 60000);
    if (m < 1) return 'baru saja';
    if (m < 60) return `${m} mnt lalu`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} jam lalu`;
    return `${Math.floor(h / 24)} hari lalu`;
}

async function groupName(zack, id) {
    try {
        const meta = await Promise.race([zack.groupMetadata(`${id}@g.us`), new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 2500))]);
        return meta?.subject || null;
    } catch {
        return null;
    }
}

async function sendPicker(zack, jid, prefix) {
    const all = listHistories();
    const priv = all.filter((h) => h.kind === 'private');
    const grp = all.filter((h) => h.kind === 'group');
    if (!all.length) {
        await zack.sendMessage(jid, { text: 'Belum ada riwayat AI yang tersimpan.' }, { quoted: null });
        return;
    }

    const here = parseJid(jid);
    const hereCount = all.find((h) => h.kind === here.kind && h.id === here.id)?.count || 0;
    const quick = [
        { id: `${prefix}clearchat here`, title: 'Chat ini', description: `Hapus riwayat chat ini (${hereCount} pesan)` },
        { id: `${prefix}clearchat allprivate`, title: 'Semua chat pribadi', description: `${priv.length} chat pribadi` },
        { id: `${prefix}clearchat allgroup`, title: 'Semua grup', description: `${grp.length} grup` },
        { id: `${prefix}clearchat all`, title: 'Semua riwayat', description: `${all.length} chat (pribadi + grup)` },
    ];

    const recent = all.slice(0, ui.LIMITS.maxRows - quick.length);
    const rows = [];
    for (const h of recent) {
        const name = h.kind === 'group' ? (await groupName(zack, h.id)) || `Grup ${h.id.slice(-8)}` : `+${h.id.replace(/_lid$/, ' (lid)')}`;
        rows.push({
            id: `${prefix}clearchat ${h.kind}:${h.id}`,
            title: name,
            description: `${h.kind === 'group' ? 'Grup' : 'Pribadi'} · ${h.count} pesan · ${ago(h.mtime)}`,
        });
    }

    const sections = [{ title: 'Pilihan cepat', rows: quick }];
    if (rows.length) sections.push({ title: 'Chat terbaru', rows });

    try {
        await ui.sendList(zack, jid, {
            title: 'HAPUS RIWAYAT AI',
            text: `Pilih riwayat percakapan AI yang mau dihapus.\nTotal tersimpan: ${all.length} chat (${priv.length} pribadi, ${grp.length} grup).`,
            footer: global.botname || '',
            buttonLabel: 'Pilih riwayat',
            sections,
        });
    } catch (e) {
        console.log('clearchat list gagal, fallback teks:', e.message);
        const lines = [...quick, ...rows].map((r) => `• ${r.id}  → ${r.title} (${r.description})`);
        await zack.sendMessage(jid, { text: `*HAPUS RIWAYAT AI*\nKetik salah satu:\n${lines.join('\n')}` }, { quoted: null });
    }
}

module.exports = {
    name: 'clearchat',
    description: 'Hapus riwayat AI yang kamu pilih (tombol daftar)',
    ownerOnly: true,
    async execute({ zack, jid, args, prefix }) {
        const arg = (args[0] || '').toLowerCase();
        const say = (text) => zack.sendMessage(jid, { text }, { quoted: null });

        if (!arg) return sendPicker(zack, jid, prefix);

        if (arg === 'here') {
            const { kind, id } = parseJid(jid);
            return say(clearHistory(kind, id) ? '✅ Riwayat AI chat ini sudah dihapus.' : 'Chat ini belum punya riwayat AI.');
        }
        if (arg === 'all') return say(`✅ ${clearAllHistories()} riwayat chat dihapus (pribadi + grup).`);
        if (arg === 'allprivate') return say(`✅ ${clearAllHistories('private')} riwayat chat pribadi dihapus.`);
        if (arg === 'allgroup') return say(`✅ ${clearAllHistories('group')} riwayat grup dihapus.`);

        const m = arg.match(/^(private|group):(.+)$/);
        if (m) {
            return say(clearHistory(m[1], m[2]) ? `✅ Riwayat ${m[1] === 'group' ? 'grup' : 'chat pribadi'} *${m[2]}* dihapus.` : 'Riwayat itu tidak ditemukan (mungkin sudah dihapus).');
        }
        return say(`Pilihan tidak dikenal. Ketik ${prefix}clearchat untuk menampilkan daftar.`);
    },
};
