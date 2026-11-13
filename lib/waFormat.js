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

function mapOutsideCode(text, fn) {
    return String(text || '')
        .split(/(```[\s\S]*?```|`[^`\n]+`)/g)
        .map((part, i) => (i % 2 === 1 ? part : fn(part)))
        .join('');
}

const HR_RE = /^[ \t]*([-*_])(?:[ \t]*\1){2,}[ \t]*$/gm;
const HEADING_RE = /^[ \t]{0,3}#{1,6}[ \t]+(.+?)[ \t#]*$/gm;
const BOLD2_RE = /(\*\*|__)(?!\s)([^\n]+?)(?<!\s)\1/g;
const LINK_RE = /(^|[^!])\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g;

function stripEmphasis(s) {
    return s.replace(BOLD2_RE, '$2').replace(/(?<![*\w])\*(?!\s|\*)([^*\n]+?)(?<!\s)\*(?![*\w])/g, '$1');
}

function common(part) {
    return part
        .replace(HR_RE, '')
        .replace(LINK_RE, (m, pre, label, url) => `${pre}${label.trim() === url ? url : `${label}: ${url}`}`)
        .replace(/~~(?!\s)([^~\n]+?)(?<!\s)~~/g, '~$1~')
        .replace(/[ \t]+(?=\n)/g, '')
        .replace(/\n{3,}/g, '\n\n');
}

function toWhatsApp(text) {
    return mapOutsideCode(text, (part) => {
        let s = part.replace(HEADING_RE, (m, h) => `*${stripEmphasis(h).trim()}*`);
        s = s.replace(BOLD2_RE, '*$2*');
        return common(s);
    }).trim();
}

function toRichText(text, keepBold = process.env.RICH_MARKDOWN === 'true') {
    return mapOutsideCode(text, (part) => {
        let s = part.replace(HEADING_RE, (m, h) => (keepBold ? `**${stripEmphasis(h).trim()}**` : stripEmphasis(h).trim()));
        s = keepBold ? s.replace(/(?<![*\w])\*(?!\s|\*)([^*\n]+?)(?<!\s)\*(?![*\w])/g, '**$1**') : stripEmphasis(s);
        return common(s);
    }).trim();
}

module.exports = { toWhatsApp, toRichText, mapOutsideCode };
