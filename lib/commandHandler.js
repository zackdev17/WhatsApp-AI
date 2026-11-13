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

const { assertIntact } = require('./guard.js');
const fs = require('fs');
const path = require('path');
const { isOwner } = require('./owner.js');
const { getBotMode } = require('./settings.js');

const PREFIX = global.prefix || '.';
const commandsDir = path.join(__dirname, '..', 'commands');

function loadCommands() {
    const commands = new Map();
    if (!fs.existsSync(commandsDir)) return commands;
    const files = fs.readdirSync(commandsDir).filter((f) => f.endsWith('.js'));
    for (const file of files) {
        const cmd = require(path.join(commandsDir, file));
        if (cmd && cmd.name) commands.set(cmd.name.toLowerCase(), cmd);
    }
    return commands;
}

const commands = loadCommands();

function parseCommand(body) {
    const trimmed = (body || '').trim();
    if (!trimmed.startsWith(PREFIX)) return null;
    const withoutPrefix = trimmed.slice(PREFIX.length);
    const [name, ...args] = withoutPrefix.split(/\s+/);
    return { name: (name || '').toLowerCase(), args };
}

async function handleCommand(zack, z, body) {
    assertIntact();
    const parsed = parseCommand(body);
    if (!parsed || !parsed.name) return false;

    const cmd = commands.get(parsed.name);
    if (!cmd) return false;

    const jid = z.key.remoteJid;
    const isGroup = jid.endsWith('@g.us');

    if (cmd.name !== 'modebot') {
        const botMode = getBotMode();
        if (botMode === 'private' && isGroup) return true;
        if (botMode === 'group' && !isGroup) return true;
    }

    if (cmd.ownerOnly) {
        const ownerOk = await isOwner(zack, z.sender);
        if (!ownerOk) {
            await zack.sendMessage(jid, { text: 'Perintah ini cuma bisa dipakai owner bot.' }, { quoted: null });
            return true;
        }
    }

    try {
        await cmd.execute({ zack, z, jid, isGroup, args: parsed.args, prefix: PREFIX, commands });
    } catch (e) {
        console.log('Command error:', e.message);
        await zack.sendMessage(jid, { text: 'Terjadi error saat menjalankan command.' }, { quoted: null });
    }
    return true;
}

module.exports = { handleCommand, PREFIX, commands };