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

require('./lib/guard.js');
require('./variabel.js');

const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason,
    downloadMediaMessage,
    normalizeMessageContent,
    getContentType,
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const readline = require('readline');
const chalk = require('chalk');

const { ZackAi } = require('./plugins/zackAi.js');
const { handleCommand } = require('./lib/commandHandler.js');
const { parseInteractiveReply } = require('./lib/interactive.js');
const { getChatMode } = require('./lib/settings.js');
const { handleCalls } = require('./lib/callGuard.js');
const { humanRead } = require('./lib/autoRead.js');
const { useMongoAuthState, getCollection } = require('./lib/mongoAuth.js');
const { startKeepAlive } = require('./lib/keepAlive.js');
const { cloudflareConfigured } = require('./lib/cfImage.js');
const { cfChatConfigured } = require('./lib/cfChat.js');

global.startTime = Date.now();
startKeepAlive();
if (cfChatConfigured()) console.log(chalk.green('Cadangan chat (Cloudflare): AKTIF, dipakai kalau semua model Groq kena limit'));
console.log(
    cloudflareConfigured()
        ? chalk.green('Gambar AI (Cloudflare): AKTIF, generate_image dipakai untuk gambar realistis')
        : chalk.yellow('Gambar AI (Cloudflare): NONAKTIF (isi CF_ACCOUNT_ID dan CF_API_TOKEN di .env), gambar memakai draw_image/kode')
);

let mongoClear = null;

const question = (text) =>
    new Promise((resolve) => {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        rl.question(text, (ans) => {
            rl.close();
            resolve(ans);
        });
    });

async function startBot() {
    let auth;
    if (process.env.MONGODB_URI) {
        auth = await useMongoAuthState(await getCollection(process.env.MONGODB_URI));
        mongoClear = auth.clear;
        console.log(chalk.cyan('Sesi disimpan di MongoDB.'));
    } else {
        auth = await useMultiFileAuthState(process.env.SESSION_DIR || 'session');
    }
    const { state, saveCreds } = auth;
    const { version, isLatest } = await fetchLatestBaileysVersion();
    console.log(chalk.cyan(`Menggunakan Baileys v${version.join('.')}, versi terbaru: ${isLatest}`));

    const zack = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        browser: ['Ubuntu', 'Chrome', '120.0.0'],
        markOnlineOnConnect: true,
    });

    if (!zack.authState.creds.registered) {
        console.log(chalk.yellow('\nBot belum terhubung ke WhatsApp.'));
        let phoneNumber = global.pairingNumber || '';
        if (!phoneNumber) {
            if (!process.stdin.isTTY) {
                console.log(chalk.red('Tidak ada terminal interaktif. Set environment variable PAIRING_NUMBER (contoh: 628xxxxxxxxxx).'));
                process.exit(1);
            }
            phoneNumber = await question(chalk.green('Masukkan nomor WhatsApp aktif (format: 628xxxxxxxxxx, tanpa + atau spasi): '));
        }
        phoneNumber = String(phoneNumber).replace(/[^0-9]/g, '');

        try {
            await new Promise((r) => setTimeout(r, 1500));
            const code = await zack.requestPairingCode(phoneNumber);
            console.log(chalk.green('\n=================================='));
            console.log(chalk.green(` KODE PAIRING KAMU: ${code}`));
            console.log(chalk.green('=================================='));
            console.log('Buka WhatsApp di HP > Perangkat Tertaut > Tautkan dengan nomor telepon, lalu masukkan kode di atas.\n');
        } catch (e) {
            console.log(chalk.red('Gagal meminta kode pairing:'), e.message);
            process.exit(1);
        }
    }

    zack.ev.on('creds.update', saveCreds);

    zack.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
            const loggedOut = statusCode === DisconnectReason.loggedOut;

            if (loggedOut) {
                if (mongoClear) {
                    mongoClear().catch(() => {}).finally(() => {
                        console.log(chalk.red('Sesi logout. Sesi di MongoDB dihapus, restart service untuk pairing baru.'));
                        process.exit(0);
                    });
                    return;
                }
                console.log(chalk.red('Sesi logout. Hapus folder "session" lalu jalankan ulang bot untuk pairing baru.'));
                process.exit(0);
            } else {
                console.log(chalk.yellow('Koneksi terputus, mencoba menyambung ulang...'));
                startBot();
            }
        } else if (connection === 'open') {
            console.log(chalk.greenBright(`✅ ${global.botname} berhasil terhubung ke WhatsApp!`));
        }
    });

    zack.ev.on('call', (calls) => {
        handleCalls(zack, calls).catch((e) => console.log('[CALL] error:', e.message));
    });

    zack.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;

        for (const z of messages) {
            if (!z.message || z.key.fromMe) continue;
            if (z.key.remoteJid === 'status@broadcast') continue;

            z.message = normalizeMessageContent(z.message) || z.message;
            const msgType = getContentType(z.message);
            const quotedCtx = z.message.extendedTextMessage?.contextInfo;
            const quotedImage = quotedCtx?.quotedMessage ? normalizeMessageContent(quotedCtx.quotedMessage)?.imageMessage : null;
            const ownImage = msgType === 'imageMessage' ? z.message.imageMessage : null;

            let body =
                msgType === 'conversation' ? z.message.conversation :
                msgType === 'extendedTextMessage' ? z.message.extendedTextMessage.text :
                msgType === 'imageMessage' ? (z.message.imageMessage.caption || '') :
                msgType === 'videoMessage' ? (z.message.videoMessage.caption || '') :
                ['interactiveResponseMessage', 'buttonsResponseMessage', 'listResponseMessage', 'templateButtonReplyMessage'].includes(msgType)
                    ? parseInteractiveReply(z.message) :
                '';

            if (ownImage && !(body || '').trim()) body = 'Jelaskan gambar ini.';

            await humanRead(zack, z, body);

            if (!body || !body.trim()) continue;

            const jid = z.key.remoteJid;
            const isGroup = jid.endsWith('@g.us');
            z.sender = z.key.participant || z.key.remoteJid;
            const pushname = z.pushName || 'Kak';

            console.log(chalk.blue(`[MSG] ${pushname} (${z.sender}): ${body}`));

            try {
                const handled = await handleCommand(zack, z, body);
                if (handled) continue;
            } catch (e) {
                console.log(chalk.red('Error saat memproses command:'), e.message);
                continue;
            }

            const chatMode = getChatMode();
            if (chatMode === 'private' && isGroup) continue;
            if (chatMode === 'group' && !isGroup) continue;

            let getImage = null;
            if (ownImage) {
                getImage = () => downloadMediaMessage(z, 'buffer', {}, { logger: pino({ level: 'silent' }), reuploadRequest: zack.updateMediaMessage });
            } else if (quotedImage) {
                const quotedMsg = {
                    key: { remoteJid: jid, id: quotedCtx.stanzaId, participant: quotedCtx.participant, fromMe: false },
                    message: { imageMessage: quotedImage },
                };
                getImage = () => downloadMediaMessage(quotedMsg, 'buffer', {}, { logger: pino({ level: 'silent' }), reuploadRequest: zack.updateMediaMessage });
            }
            const safeGetImage = getImage
                ? async () => {
                      try {
                          return await getImage();
                      } catch (e) {
                          console.log(chalk.red('Gagal mengunduh gambar:'), e.message);
                          return null;
                      }
                  }
                : null;

            try {
                await zack.sendPresenceUpdate('composing', jid);
                await ZackAi(z.pushName || '', body, z, zack, {
                    getImage: safeGetImage,
                    imageMime: (ownImage || quotedImage)?.mimetype || 'image/jpeg',
                });
            } catch (e) {
                console.log(chalk.red('Error saat memproses pesan:'), e.message);
            }
        }
    });

    return zack;
}

startBot().catch((e) => {
    console.log(chalk.red('Gagal menjalankan bot:'), e);
});