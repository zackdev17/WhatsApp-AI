<!--
  ═══════════════════════════════════════════════
                 ZACKIRA AI
          SISTEM BOT WHATSAPP CERDAS
  ═══════════════════════════════════════════════

  © 12 November 2026 ZACKIRA AI.
  Seluruh hak cipta dilindungi.

  Nama Proyek    : ZACKIRA AI
  Jenis Proyek   : Bot WhatsApp Berbasis Kecerdasan Buatan
  Pengembang     : ZACK
  Lisensi        : Sumber Terbuka (Open Source)
  Biaya          : Gratis

  DESKRIPSI:
  ZACKIRA AI merupakan sistem bot WhatsApp cerdas
  yang dikembangkan untuk menghadirkan otomatisasi,
  kemudahan, dan pengalaman interaksi yang modern.

  KETENTUAN PENGGUNAAN:
  1. Dilarang memperjualbelikan script ini dalam
  bentuk apa pun tanpa izin pengembang.

  2. Dilarang mendistribusikan ulang script ini
  tanpa persetujuan dari pengembang.

  3. Dilarang menghapus, mengganti, atau memodifikasi
  watermark dan identitas asli pengembang.

  4. Setiap penggunaan dan pengembangan lanjutan
  wajib tetap mencantumkan atribusi kepada
  pengembang asli.

  PENGHARGAAN:
  Hormati karya, waktu, dan usaha pengembang.
  Jangan mengklaim karya ini sebagai milik pribadi
  tanpa izin dari pengembang aslinya.

  Dikembangkan dengan dedikasi oleh:
  ZACK

  ═══════════════════════════════════════════════
-->

<div align="center">

# 🤖 ZACKIRA AI

**Script Bot WhatsApp AI Canggih**

Bot WhatsApp berbasis [Baileys](https://github.com/WhiskeySockets/Baileys) + [Groq](https://groq.com) yang bisa ngobrol natural, mengirim lagu/video, mencari dan membuat gambar, mengirim pesan interaktif (tombol, daftar, carousel), dan dikelola lewat command owner.

![Node](https://img.shields.io/badge/node-%E2%89%A5%2022.13-339933?logo=node.js&logoColor=white)
![Baileys](https://img.shields.io/badge/baileys-7.0.0--rc14-25D366)
![AI](https://img.shields.io/badge/AI-Groq-F55036)
![License](https://img.shields.io/badge/lisensi-gratis%20%26%20open--source-blue)

</div>

---

## Daftar Isi

1. [Fitur](#-fitur)
2. [Persyaratan](#-persyaratan)
3. [Instalasi dan Menjalankan](#-instalasi-dan-menjalankan)
4. [Konfigurasi (`.env` dan `variabel.js`)](#-konfigurasi)
5. [Daftar Command](#-daftar-command)
6. [Cara Kerja AI dan Tools](#-cara-kerja-ai-dan-tools)
7. [Panduan Edit](#-panduan-edit)
8. [Deploy](#-deploy)
9. [Struktur Folder](#-struktur-folder)
10. [Troubleshooting](#-troubleshooting)
11. [Keamanan](#-keamanan)
12. [Lisensi dan Watermark](#-lisensi-dan-watermark)

---

## ✨ Fitur

| Kategori | Isi |
| --- | --- |
| **Obrolan AI** | Balasan natural memakai Groq dengan rotasi model otomatis saat kena limit; bisa membaca gambar (vision) |
| **Riwayat per chat** | Riwayat dipisah per nomor (private) dan per grup, tidak pernah tercampur |
| **Media** | Kirim lagu (mp3/m4a) dan video dari YouTube lewat `yt-dlp`, cari link Spotify/TikTok/Instagram/web yang sudah dicek hidup |
| **Gambar** | Cari gambar (Pinterest, cadangan Bing), buat gambar lewat kode canvas, buat gambar realistis lewat Cloudflare Workers AI, ubah daftar atau tabel jadi gambar |
| **Pesan interaktif** | Tombol, daftar pilihan, carousel, lokasi, tabel dan code block native WhatsApp |
| **Menu** | `.menu` berupa daftar tombol interaktif |
| **Anti-call** | Telepon masuk otomatis ditolak dan penelepon diblokir (bisa di-on/off) |
| **Auto-read** | Pesan dibaca seperti orang yang membuka WhatsApp (bisa di-on/off) |
| **Clear chat** | Hapus riwayat AI yang dipilih lewat tombol daftar |
| **Hemat limit Groq** | Tool dipilih per pesan, daftar model terpisah untuk obrolan/tool/kode, cadangan Cloudflare |

---

## 📋 Persyaratan

- **Node.js 22.13 atau lebih baru** (wajib; fitur `draw_image` memakai Node permission model)
- **npm**
- Nomor WhatsApp untuk bot (disarankan bukan nomor utama)
- **API key Groq** (gratis): https://console.groq.com
- Opsional: akun Cloudflare (gambar realistis dan cadangan chat), `ffmpeg` (lagu jadi mp3), MongoDB Atlas (simpan sesi di hosting tanpa disk)

---

## 🚀 Instalasi dan Menjalankan

### 1. Clone dan install

```bash
git clone https://github.com/USERNAME/REPO.git
cd REPO
npm install
```

> Ganti `USERNAME/REPO` dengan alamat repo kamu. Kalau memakai Termux: `pkg install nodejs-lts git` dulu.

### 2. Buat file `.env`

```bash
cp .env.example .env
```

Isi minimal:

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxx
OWNER_NUMBERS=628111111111
PAIRING_NUMBER=628222222222
```

- `OWNER_NUMBERS`: nomor kamu sebagai owner (format `628xxxxxxxxxx`, tanpa `+` dan spasi, boleh lebih dari satu dipisah koma).
- `PAIRING_NUMBER`: nomor WhatsApp yang dijadikan bot. Kalau kosong, bot menanyakannya di terminal.

### 3. Jalankan

```bash
npm start
```

Jalankan **dari dalam folder project**, karena `.env` dan folder `database/` dicari dari folder tempat bot dijalankan.

### 4. Pairing

1. Setelah start, terminal menampilkan **kode pairing 8 digit**.
2. Di HP bot: WhatsApp → **Perangkat Tertaut** → **Tautkan dengan nomor telepon** → masukkan kode.
3. Setelah terhubung, muncul `✅ ... berhasil terhubung ke WhatsApp!`.

Sesi tersimpan di folder `session/`, jadi pairing tidak perlu diulang saat bot dijalankan ulang.

### Menjalankan terus-menerus (opsional)

```bash
npm install -g pm2
pm2 start index.js --name zackira-ai
pm2 logs zackira-ai
```

---

## ⚙️ Konfigurasi

Semua pengaturan dibaca dari `.env` (disalin dari `.env.example`) atau diatur langsung di `variabel.js`. Nilai di `.env` diutamakan.

### Environment variable

| Variable | Wajib | Fungsi |
| --- | :---: | --- |
| `GROQ_API_KEY` | ✅ | API key Groq. Kalau kosong, AI tidak aktif |
| `OWNER_NUMBERS` | ✅ | Nomor owner, pisahkan dengan koma |
| `PAIRING_NUMBER` | ➖ | Nomor bot untuk pairing (wajib di hosting tanpa terminal interaktif) |
| `BOT_PREFIX` | ➖ | Tanda command, default `.` |
| `SESSION_DIR` | ➖ | Folder sesi WhatsApp, default `session` |
| `MONGODB_URI` | ➖ | Simpan sesi di MongoDB (untuk hosting tanpa disk permanen) |
| `MONGODB_DB`, `MONGODB_COLLECTION` | ➖ | Nama database dan koleksi MongoDB |
| `YTDLP_COOKIES` | ➖ | Path file `cookies.txt` YouTube (mengatasi blokir "confirm you're not a bot") |
| `YTDLP_PATH` | ➖ | Path binary `yt-dlp` sendiri |
| `MAX_MEDIA_MINUTES` | ➖ | Batas durasi media, default 15 |
| `MAX_MEDIA_MB` | ➖ | Batas ukuran media, default 45 |
| `AI_HISTORY` | ➖ | Jumlah pesan riwayat yang dikirim ke AI, default 10 |
| `RICH_MARKDOWN` | ➖ | `true` mempertahankan `**tebal**` di pesan rich |
| `RICH_TABLE` | ➖ | `false` mematikan tabel native (tabel dikirim sebagai teks) |
| `CF_ACCOUNT_ID`, `CF_API_TOKEN` | ➖ | Aktifkan Cloudflare Workers AI (gambar realistis dan cadangan chat) |
| `CF_IMAGE_MODEL` | ➖ | Default `@cf/black-forest-labs/flux-1-schnell` |
| `CF_IMAGE_STEPS` | ➖ | Langkah generate gambar (1-8), default 6 |
| `CF_CHAT_MODEL` | ➖ | Model teks cadangan, default `@cf/meta/llama-3.1-8b-instruct` |
| `CF_CHAT_FALLBACK` | ➖ | `false` mematikan cadangan chat Cloudflare |
| `PORT`, `KEEPALIVE_URL`, `RENDER_EXTERNAL_URL` | ➖ | Server HTTP kecil agar hosting gratis tidak tidur |

### Pengaturan di `variabel.js`

| Variabel | Fungsi |
| --- | --- |
| `global.botname` | Nama bot (tampil di menu) |
| `global.botVersion` | Versi bot |
| `global.botAuthor` | Nama pembuat (footer menu) |
| `global.ownerNumbers` | Nomor owner (default dari env `OWNER_NUMBERS`) |
| `global.prefix` | Tanda command |
| `global.groqModels` | Daftar model untuk permintaan yang memakai tool (urut prioritas) |
| `global.groqChatModels` | Daftar model untuk obrolan biasa |
| `global.groqCodeModels` | Daftar model untuk menulis kode gambar |
| `global.groqVisionModels` | Daftar model yang bisa membaca gambar |
| `global.maxMediaMinutes`, `global.maxMediaMB` | Batas media |

> ⚠️ Nilai bawaan `OWNER_NUMBERS` di `variabel.js` adalah nomor milik pembuat. **Ganti** lewat `.env` atau langsung di file supaya command owner tidak bisa dipakai orang lain.

---

## 💬 Daftar Command

Prefix bawaan adalah `.` (bisa diganti). Ketik `.menu` untuk tampilan tombol.

| Command | Akses | Fungsi |
| --- | --- | --- |
| `.menu` | Semua | Menu utama berupa daftar tombol interaktif (ketuk baris untuk menjalankan) |
| `.help` | Semua | Daftar command dalam bentuk teks |
| `.ping` | Semua | Cek apakah bot hidup |
| `.mode [all\|private\|group]` | Owner | Atur AI membalas di private, grup, atau keduanya (default `private`) |
| `.modebot [all\|private\|group]` | Owner | Atur bot (command) aktif di private, grup, atau keduanya |
| `.clearchat` | Owner | Tombol daftar untuk menghapus riwayat AI: chat ini, semua private, semua grup, semua, atau satu chat tertentu |
| `.anticall [on\|off]` | Owner | Telepon masuk ditolak dan penelepon diblokir (owner tidak diblokir) |
| `.autoread [on\|off]` | Owner | Bot menandai pesan masuk dibaca dengan jeda acak 0,8-4 detik |

Pengaturan `.mode`, `.modebot`, `.anticall`, dan `.autoread` tersimpan di `database/settings.json`, jadi tetap aktif setelah restart.

Selain command, **semua pesan biasa dijawab AI** (sesuai `.mode`). Contoh yang bisa diminta ke AI:

- "kirimin lagu Sheila On 7 Dan"
- "cariin link spotify lagu Dewa 19 Kangen"
- "carikan gambar anime keren di pinterest"
- "buatkan gambar kucing astronot" (butuh Cloudflare untuk hasil realistis)
- "kasih langkah logout email dalam bentuk gambar"
- "kirim tombol pilihan A dan B"

---

## 🧠 Cara Kerja AI dan Tools

### Alur pesan

1. Pesan masuk lewat `index.js`. Kalau auto-read aktif, pesan ditandai dibaca.
2. Kalau diawali prefix dan dikenali, command dijalankan oleh `lib/commandHandler.js`.
3. Kalau bukan command, pesan dikirim ke `plugins/zackAi.js`: riwayat chat dimuat, tool dipilih sesuai isi pesan, lalu model Groq dipanggil (dengan rotasi model).
4. Kalau model memanggil tool, `plugins/tools.js` menjalankannya dan hasilnya dikembalikan ke model sampai jawaban akhir keluar.

### Tools yang bisa dipanggil AI

| Tool | Fungsi |
| --- | --- |
| `search_links` | Cari link valid (Spotify, TikTok, Instagram, web) |
| `search_youtube` | Cari video atau lagu YouTube |
| `send_youtube_audio` / `send_youtube_video` | Unduh dan kirim lagu atau video |
| `send_youtube_carousel` | Hasil YouTube sebagai carousel |
| `send_image` | Kirim gambar dari URL |
| `send_pinterest` / `search_pinterest` | Cari gambar (Pinterest, cadangan Bing) dan kirim sebagai carousel |
| `generate_image` | Gambar realistis lewat Cloudflare Workers AI (muncul kalau Cloudflare diaktifkan) |
| `draw_image` | AI menulis kode canvas, dijalankan di sandbox, hasilnya PNG |
| `send_list_image` / `send_table_image` | Daftar atau tabel jadi gambar infografis |
| `send_buttons` | Tombol: balasan cepat, buka link, salin, telepon |
| `send_list` | Daftar pilihan (maks 10 baris) |
| `send_carousel` | Kartu geser 2-10 dengan gambar dan tombol |
| `send_location` | Pin lokasi |

Saat user menekan tombol atau memilih baris, teks `id`/`value`-nya masuk ke AI seperti pesan yang diketik.

### Riwayat percakapan

Disimpan per chat, bukan per pengirim:

- Private: `database/chat_history/private/<nomor>.json`
- Grup: `database/chat_history/group/<id-grup>.json`

Di grup, tiap pesan diberi label `[Nama]:` supaya AI tahu siapa yang bicara. Reset lewat `.clearchat` atau hapus file JSON-nya.

### Hemat limit Groq

Groq membatasi **per organisasi**, jadi menambah API key dari akun yang sama tidak membantu. Yang dilakukan bot:

- Tool dan aturan prompt dipilih **per pesan** (obrolan biasa hanya membawa 1 tool kecil).
- Tiga daftar model terpisah: obrolan (`groqChatModels`), tool (`groqModels`), kode gambar (`groqCodeModels`). Urutkan sesuai limit akunmu di https://console.groq.com/settings/limits.
- Riwayat dipendekkan (`AI_HISTORY`) dan `max_tokens` dibatasi.
- Model yang butuh persetujuan syarat (`model_terms_required`) dilewati sampai bot restart.
- Kalau semua model Groq limit dan pesannya obrolan biasa, dijawab model teks Cloudflare (kalau `CF_ACCOUNT_ID` dan `CF_API_TOKEN` diisi). Permintaan yang butuh tool tidak dialihkan.

### Gambar AI

- **`draw_image`** (selalu aktif, lokal, tanpa layanan pihak ketiga): hasilnya gambar vektor buatan kode, cocok untuk logo, ikon, diagram, kartu ucapan.
- **`generate_image`** (opsional): gambar realistis, lukisan, anime lewat Cloudflare Workers AI. Cara aktifkan:
  1. Daftar gratis di https://dash.cloudflare.com
  2. **AI → Workers AI → Use REST API → Create a Workers AI API Token**, salin token dan **Account ID**
  3. Isi `CF_ACCOUNT_ID` dan `CF_API_TOKEN` di `.env`, restart bot
- Model FLUX.2 (misal `CF_IMAGE_MODEL=@cf/black-forest-labs/flux-2-klein-4b`) dikirim otomatis sebagai `multipart/form-data`. Model lain dicoba sebagai JSON dan otomatis diulang dengan format multipart kalau Cloudflare memintanya.
- Keamanan `draw_image`: kode AI dijalankan di proses terpisah (env kosong, Node permission model tanpa tulis file atau spawn proses, batas waktu dan memori, `eval`/`new Function` dimatikan, plus pemindai kata terlarang).

### Pencarian dan unduh media

- `yt-dlp` diunduh otomatis saat pertama dipakai. Kalau ada `ffmpeg`, lagu dikirim mp3, kalau tidak m4a.
- Spotify tidak bisa diunduh (DRM), bot hanya memberi link.
- YouTube sering memblokir IP server. Isi `YTDLP_COOKIES` dengan path `cookies.txt` dari akun YouTube yang login.
- Mengunduh konten YouTube bisa melanggar ketentuan YouTube dan hak cipta. Tanggung jawab ada di pemilik bot.

---

## 🛠 Panduan Edit

### Mengubah kepribadian dan gaya AI

Buka `plugins/zackAi.js`, cari fungsi `buildSystemPrompt`. Teks di dalam backtick adalah instruksi dasar AI. Kamu bebas mengubah nama AI, gaya bahasa, emoji, dan aturan tambahan.

Jangan hapus aturan format kode dan tabel Markdown, karena itu yang membuat code block dan tabel tampil rapi di WhatsApp. Aturan per tool ada di objek `RULES` dan fungsi `imageMakeRule` pada file yang sama.

### Menambah command baru

1. Buat file di `commands/`, misalnya `commands/sapa.js`:

```js
module.exports = {
    name: 'sapa',
    description: 'Menyapa seseorang',
    ownerOnly: false,
    async execute({ zack, z, jid, isGroup, args, prefix, commands }) {
        const nama = args[0] || 'Kak';
        await zack.sendMessage(jid, { text: `Halo ${nama}! 👋` }, { quoted: null });
    },
};
```

2. Restart bot. Command otomatis terdaftar dan muncul di `.help` dan `.menu`.

| Bagian | Fungsi |
| --- | --- |
| `name` | Nama command tanpa prefix (`sapa` dipanggil `.sapa`) |
| `description` | Muncul di `.help` dan `.menu` |
| `ownerOnly` | `true` kalau hanya boleh dipakai owner |
| `execute` | Fungsi yang dijalankan |

Parameter `execute`:

| Parameter | Isi |
| --- | --- |
| `zack` | Koneksi WhatsApp (`zack.sendMessage(...)`) |
| `z` | Pesan mentah (`z.pushName`, `z.sender`, `z.key`) |
| `jid` | ID chat asal pesan |
| `isGroup` | `true` kalau dari grup |
| `args` | Kata setelah nama command (`.sapa Budi` → `['Budi']`) |
| `prefix` | Tanda command yang dipakai |
| `commands` | Map semua command yang termuat |

> `.menu` hanya menampilkan **10 baris** tombol. Kalau command lebih dari 10, sisanya disebut di teks menu.

### Menambah tool AI baru

1. Di `plugins/tools.js`, tambahkan definisi tool (format function calling) ke array `TOOLS`.
2. Tambahkan `case` untuk namanya di fungsi `executeTool`. Kembalikan string JSON, misalnya `{ ok: true }` atau `{ ok: false, error: '...' }`.
3. Di `lib/toolSelect.js`, daftarkan tool ke grup yang sesuai (`GROUPS`) beserta kata pemicunya supaya tool ikut dikirim ke model saat relevan.
4. Kalau perlu aturan khusus untuk model, tambahkan ke `RULES` di `plugins/zackAi.js`.

### Mengganti prefix

Lewat `.env`: `BOT_PREFIX=!`, atau di `variabel.js`: `global.prefix = '!'`. Restart bot.

### Mengganti nomor owner

Lewat `.env`: `OWNER_NUMBERS=628111111111,628222222222`, atau di `variabel.js`: `global.ownerNumbers = ['628111111111']`.

### Mengganti gambar menu

Simpan gambar JPG dengan nama `menu.jpg` di folder `image/`. Kalau file tidak ada, menu tetap tampil tanpa gambar. Teks menu ada di `commands/menu.js`; nama, versi, dan author diambil dari `variabel.js`.

### Mengganti urutan model Groq

Edit `global.groqModels`, `global.groqChatModels`, `global.groqCodeModels`, dan `global.groqVisionModels` di `variabel.js`. Urutan = prioritas. Model yang kena limit otomatis dilewati sementara.

### Mengatur AI membalas di mana

Gunakan `.mode all|private|group`. Default `private` (hanya chat pribadi).

---

## ☁️ Deploy

### VPS / Termux / PC sendiri

Ikuti bagian [Instalasi dan Menjalankan](#-instalasi-dan-menjalankan). Gunakan `pm2` agar bot hidup terus.

### Panel hosting (Pterodactyl, dll)

Upload isi project **tanpa** `node_modules`, `.env`, `session/`, dan `database/`. Isi environment variable lewat panel, lalu start. Pastikan Node.js 22.13+.

Kalau `npm install` gagal dengan error `EALLOWGIT` (hosting memblokir paket dari git), pastikan **tidak ada `package-lock.json` lama** di folder, lalu install ulang.

### Render (gratis)

Render gratis hanya untuk **Web Service** dan tidak punya disk permanen:

1. Buat cluster gratis M0 di MongoDB Atlas, izinkan akses `0.0.0.0/0`, salin connection string ke `MONGODB_URI` (sesi WhatsApp disimpan di sana).
2. New → Web Service → pilih repo, Build `npm install`, Start `npm start`, Instance Type **Free**. Atau pakai `render.yaml`.
3. Isi env: `GROQ_API_KEY`, `PAIRING_NUMBER`, `OWNER_NUMBERS`, `MONGODB_URI`.
4. Lihat tab Logs untuk kode pairing.

Bot membuka server HTTP kecil di `PORT` dan mem-ping URL publiknya tiap 10 menit agar tidak tidur. Untuk lebih aman, daftarkan URL service di UptimeRobot. Folder `database/` dan binary `yt-dlp` ada di disk sementara, jadi hilang saat restart.

---

## 📁 Struktur Folder

```text
.
├── index.js                 Titik masuk: koneksi WhatsApp, pairing, penerima pesan, event telepon
├── variabel.js              Pengaturan global dan pembaca .env
├── DONT_DELETE.ts           File penjaga: bot berhenti kalau file ini dihapus atau diubah
├── package.json
├── .env.example             Contoh konfigurasi (salin jadi .env)
├── render.yaml              Konfigurasi deploy Render
├── image/
│   └── menu.jpg             Gambar header menu (opsional)
├── commands/                Satu file = satu command
│   ├── menu.js  help.js  ping.js
│   ├── mode.js  modebot.js
│   └── clearchat.js  anticall.js  autoread.js
├── plugins/
│   ├── zackAi.js            Otak AI: prompt, pemilihan model/tool, loop tool calling
│   └── tools.js             Definisi dan eksekusi semua tool AI
├── lib/
│   ├── commandHandler.js    Memuat command dan menjalankannya
│   ├── settings.js          Pengaturan tersimpan (database/settings.json)
│   ├── owner.js             Pengecekan owner
│   ├── groqPool.js          Panggilan Groq dengan rotasi model dan cooldown limit
│   ├── toolSelect.js        Memilih tool per pesan (hemat token)
│   ├── toolCallParser.js    Memulihkan tool call yang ditulis model sebagai teks
│   ├── chatHistory.js       Riwayat per chat
│   ├── userProfile.js       Profil nama user
│   ├── interactive.js       Tombol, daftar, carousel, lokasi
│   ├── richBuilder.js       Pesan rich (code block dan tabel)
│   ├── waFormat.js          Konversi Markdown ke format WhatsApp
│   ├── imageCard.js         Daftar/tabel jadi gambar (canvas)
│   ├── drawRunner.js        Menjalankan kode gambar AI
│   ├── sandboxDraw.js       Sandbox kode gambar AI
│   ├── cfImage.js           Gambar Cloudflare Workers AI
│   ├── cfChat.js            Cadangan chat Cloudflare
│   ├── imageSearch.js       Cari gambar (Pinterest, cadangan Bing)
│   ├── pinterest.js         Klien Pinterest
│   ├── linkSearch.js        Pencarian link valid
│   ├── ytdlp.js             Unduh media YouTube
│   ├── netSafety.js         Pengaman permintaan jaringan
│   ├── guard.js             Pemeriksa file DONT_DELETE.ts
│   ├── callGuard.js         Anti-call
│   ├── autoRead.js          Auto-read
│   ├── mongoAuth.js         Sesi WhatsApp di MongoDB
│   └── keepAlive.js         Server HTTP kecil anti-tidur
├── session/                 (dibuat otomatis) sesi WhatsApp, jangan di-commit
└── database/                (dibuat otomatis) pengaturan, riwayat, profil, jangan di-commit
```

---

## 🩺 Troubleshooting

| Masalah | Solusi |
| --- | --- |
| `Cannot find module '@whiskeysockets/baileys'` | `npm install` belum berhasil. Lihat error di atas pesan itu. Kalau `EALLOWGIT`, hapus `package-lock.json` lalu install ulang |
| Kode pairing gagal terus | Pastikan format nomor `628xxxxxxxxxx` (tanpa `+` dan spasi) dan WhatsApp di HP online |
| Bot logout sendiri | Hapus folder `session/`, jalankan ulang, pairing dari awal |
| AI tidak menjawab | Cek `.mode` (private/group sesuai tempat chat), cek `GROQ_API_KEY`, cek log terminal |
| Kode/tabel tidak tampil | Pastikan `@whiskeysockets/baileys` versi `7.0.0-rc14` atau lebih baru |
| Groq sering overlimit | Urutkan ulang daftar model di `variabel.js`, kecilkan `AI_HISTORY`, aktifkan cadangan Cloudflare |
| Gambar Cloudflare gagal | Cek token punya izin **Workers AI** dan Account ID benar. Jatah gratis habis akan jatuh ke `draw_image` |
| Gambar tidak mau dikirim dari Pinterest | Pinterest sering memblokir IP server, bot otomatis memakai Bing Images |
| Lagu/video gagal diunduh | Isi `YTDLP_COOKIES`, pastikan durasi dan ukuran di bawah batas |
| `draw_image` tidak aktif | Perlu Node.js 22.13+ |
| Pesan interaktif tidak muncul | Bot otomatis memakai teks biasa sebagai cadangan; pastikan Baileys versi `7.0.0-rc14` |

Saat melapor masalah, sertakan baris log terminal yang berawalan `[AI]`, `[GROQ]`, `[TOOL ...]`, `[IMG]`, atau `[CALL]`.

---

## 🔐 Keamanan

- **Jangan upload `.env`, `session/`, `database/`, dan `cookies.txt` ke GitHub.** `.gitignore` sudah mengecualikannya.
- Kalau API key atau token tidak sengaja ter-upload, cabut dan buat yang baru.
- Command owner hanya berlaku untuk nomor di `OWNER_NUMBERS`.
- Kode gambar buatan AI dijalankan di sandbox terpisah, tetapi jalankan bot di akun sistem yang tidak punya akses ke data penting.

### File penjaga `DONT_DELETE.ts`

Bot memeriksa file `DONT_DELETE.ts` saat start, setiap 15 detik, dan setiap kali memproses command, pesan AI, atau tool. Kalau file ini **dihapus atau isinya diubah**, bot langsung berhenti dengan pesan error dan tidak bisa dijalankan lagi sampai file aslinya dikembalikan. Fitur ini hanya penghalang ringan karena kode bersifat open-source (siapa pun yang mengedit `lib/guard.js` bisa menonaktifkannya).

Kalau kamu sengaja mengubah isi `DONT_DELETE.ts` (misalnya mengganti kontak), jalankan `npm run guard` sesudahnya. Perintah ini menghitung ulang hash dan menuliskannya ke `lib/guard.js`.

---

## 📜 Lisensi dan Watermark

Script ini **gratis dan open-source**.

- Dilarang memperjualbelikan atau mendistribusikan ulang tanpa izin pengembang.
- Setiap pengembangan lanjutan wajib tetap mencantumkan atribusi kepada pengembang asli (ZACK).
- **Jangan hapus, ganti, atau ubah watermark dan identitas pengembang** di bagian atas setiap file sebagai bentuk penghargaan kepada pembuat.

© 12 November 2026 ZACKIRA AI. Seluruh hak cipta dilindungi.
