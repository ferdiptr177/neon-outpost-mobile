# Neon Outpost V2 — Rogue Signal

Game survival roguelite 3D untuk browser mobile. Dua arena, delapan gelombang, dan dua boss dengan dua fase serangan. Dibuat dengan WebGL 2 tanpa dependensi game atau aset eksternal.

## Mainkan di HP

[Buka Neon Outpost](https://ferdiptr177.github.io/neon-outpost-mobile/), ketuk **MULAI MISI**, pilih arena, kesulitan, serta senjata awal, lalu **TERJUNKAN RANGER**. Posisi landscape disarankan; portrait juga didukung. Memerlukan browser dengan WebGL 2. Ini versi browser/PWA, bukan APK native.

Jika masih melihat versi lama, muat ulang halaman. Badge di menu utama akan menampilkan **V2**. Setelah kunjungan HTTPS pertama dan cache selesai, game dapat dimainkan offline.

## Yang baru di V2

- **8 gelombang dan 2 boss:** Warden pada gelombang 4, Overlord pada gelombang 8. Boss beralih ke fase agresif ketika HP di bawah 45%, menembakkan pola radial dan serangan area dengan tanda peringatan.
- **5 kelas musuh:** scout mengejar dan menabrak, gunner menjaga jarak, sniper memberi peringatan laser sebelum menembak, tank menembakkan tiga proyektil, dan bomber membuat ledakan area yang bisa dihindari.
- **3 senjata:** Pulse cepat dan seimbang, Scatter menembakkan lima proyektil jarak dekat, Rail menembus tiga target. Semua senjata memakai sistem panas; overheat membatasi tembakan beruntun.
- **EMP:** merusak dan memberi stun pada musuh sekitar serta menghapus proyektil dekat pemain. Radius 7,5 unit, cooldown 10 detik; efek stun boss lebih singkat.
- **Shield:** menyerap damage sebelum HP dan mulai pulih setelah 6 detik tanpa terkena serangan. Dash memberi kebal singkat.
- **XP, level, dan perk:** kill serta kontrak memberi XP. Poin perk dipakai lewat terminal UPGRADE untuk meningkatkan damage, shield, cooldown dash, atau radius magnet koin. Setiap perk maksimal 3 level dan direset pada misi baru.
- **Kontrak sampingan:** ambil tiga inti data, bertahan di zona uplink selama empat detik, atau kalahkan target jumlah musuh. Kontrak selesai memberi 100 kredit dan 45 XP; berganti pada gelombang berikutnya.
- **Progres permanen:** chip dari misi tanpa mod membeli modul HP, damage awal, dan kredit awal di HANGGAR. Setiap modul maksimal empat level.
- **2 arena:** Verdant Frontier dengan hutan, dan Rust Canyon dengan monolit serta susunan cover berbeda.
- **3 kesulitan:** Santai, Standar, Nightmare; mengubah HP, damage, dan kecepatan musuh serta pengali skor. Rekor dipisahkan per kesulitan.
- **Radar dan combo:** minimap menandai pemain, musuh, inti data, dan zona kontrak. Kill beruntun meningkatkan skor hingga pengali ×3.

## Kontrol

| Aksi | Mobile | Keyboard |
| --- | --- | --- |
| Gerak | Joystick kiri | WASD / panah |
| Tembak + auto aim | Tahan TEMBAK | Tahan Space |
| Dash | ϟ | Shift |
| EMP | Tombol EMP | E |
| Ganti senjata | Tombol nama senjata | Q |
| Upgrade & perk | UPGRADE, lalu tab KREDIT / PERK | Klik terminal |
| Jeda | Ⅱ | Esc |

Menu mod, upgrade, dan pengaturan menjeda pertempuran. Auto aim memilih musuh terdekat dengan garis tembak bebas cover. Setelah gelombang selesai, tersedia delapan detik untuk mengumpulkan item atau upgrade; tombol gelombang berikutnya mempercepat jeda ini.

## Mod bawaan

**God mode:** kebal terhadap proyektil, tabrakan, dan ledakan. **Unlimited money:** upgrade lapangan bebas biaya kredit. Keduanya dapat diaktifkan atau dimatikan terpisah saat misi berjalan. Saldo kredit asli tetap tersimpan dan upgrade tetap berlaku setelah mod dimatikan.

Penggunaan mod menandai seluruh misi, meskipun mod kemudian dimatikan. Misi tersebut tidak memberi chip dan tidak masuk rekor kompetitif. Unlimited money tidak membeli modul permanen di hanggar. Mod, level, dan upgrade lapangan direset pada misi baru.

## Chip, profil, dan penyimpanan

Chip diberikan saat misi berakhir: 1 per dua gelombang selesai, +4 untuk kemenangan, dan +1 per kontrak selesai. Gunakan **AKHIRI MISI & SIMPAN HADIAH** dari menu jeda untuk mengakhiri misi lebih awal dengan hadiah yang sudah diperoleh. Memuat ulang halaman di tengah misi tidak menyimpan kemajuan atau hadiah misi tersebut.

Modul hanggar, chip, statistik, rekor, pilihan loadout, dan pengaturan disimpan di browser perangkat ini. Tidak ada sinkronisasi akun atau cloud. Menghapus data browser menghapus progres. Save yang rusak ditangani dengan nilai awal yang aman. Rekor V1 disimpan pada kunci berbeda dan tidak digabung ke rekor V2.

## Grafik dan kompatibilitas

Pilih HD, Seimbang, atau Hemat lewat pengaturan. HD memakai resolusi hingga 2× ukuran CSS layar. Grafis bergaya sci-fi; tidak ada klaim fotorealisme atau FPS tertentu. Frame rate bergantung pada GPU, suhu, dan resolusi perangkat. Belum diuji pada HP fisik Android/iPhone.

Ikon PNG/SVG, manifest, dan service worker disertakan. Gunakan **Tambahkan ke Layar Utama** dari menu browser bila tersedia. Perilaku pemasangan PWA berbeda menurut browser. Semua efek audio dibuat secara sintetis setelah interaksi pertama.

## Jalankan secara lokal

```sh
python3 -m http.server 8080 --bind 0.0.0.0
```

Buka `http://localhost:8080`. Untuk HP di Wi-Fi yang sama, gunakan alamat IP komputer dan port 8080. Offline/PWA memerlukan HTTPS atau localhost; akses HTTP melalui alamat LAN tidak mengaktifkan service worker.

## Verifikasi

```sh
node --test tests/*.test.mjs
```

Tes browser opsional (Playwright dan Chromium):

```sh
npm install --no-save playwright
npx playwright install chromium
python3 -m http.server 8080
# terminal lain:
node tests/browser.cjs
```

`CHROMIUM_PATH` opsional dapat menunjuk executable Chromium yang sudah ada. Tes browser memakai server localhost:8080. Lihat [VALIDATION.md](VALIDATION.md) untuk cakupan dan batas pengujian.

## Publikasi

Repository ini memakai GitHub Pages dengan workflow `.github/workflows/pages.yml`; perubahan pada branch `main` diterbitkan otomatis. Service worker V2 mengganti cache V1 dan tetap mengambil konten baru dari jaringan saat tersedia. Lihat [panduan resmi Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

Kode dan aset prosedural berlisensi MIT; lihat LICENSE.
