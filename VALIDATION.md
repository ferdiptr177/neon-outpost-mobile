# Verifikasi V2 — 26 Oktober 2026

## Aturan dan simulasi

17 tes lulus lewat `node --test tests/*.test.mjs`:

- God mode ON/OFF, damage shield sebelum HP, pembelian normal dan unlimited money, pemulihan HP, batas upgrade, serta penolakan tipe yang tidak valid.
- XP beberapa level sekaligus, biaya dan batas perk, chip serta modul permanen, save rusak, dan loadout tidak valid.
- Misi tanpa mod mendapat chip dan rekor per kesulitan; misi yang pernah menggunakan mod tidak mendapatkannya.
- Simulasi combat sungguhan menyelesaikan 8 gelombang dan mengalahkan 2 boss; semua 5 kelas musuh serta fase kedua boss teramati. Simulasi memakai God mode, upgrade maksimum, gerak melingkar, pergantian senjata, dan EMP. Renderer dimock pada simulasi ini.
- EMP memberi damage/stun, menghapus proyektil, dan menaati cooldown.
- Kontrak inti data tidak memberi hadiah ganda; shield menunggu sebelum pulih; overheat membatasi tembakan.
- Scatter mengeluarkan 5 proyektil dengan sudut berbeda; Rail menembus 3 target masing-masing sekali; sniper memberi peringatan sebelum menembak.
- Pemain diam tanpa mod dapat kalah; misi baru mereset kemajuan.

## Browser lokal

Chromium headless 153, WebGL 2 melalui SwiftShader:

- Startup renderer dan tidak ada error JavaScript halaman.
- Persiapan misi: Rust Canyon, Nightmare, Rail; bonus HP hanggar diterapkan.
- Berganti antara tiga senjata dan menggunakan EMP dengan tombol cooldown yang nonaktif sementara.
- Gerak joystick dan tembak dengan dua sentuhan simultan melalui Chrome DevTools Protocol.
- Memperoleh XP melalui combat nyata, membeli perk dari terminal, lalu melanjutkan pertempuran.
- Mod, tiga upgrade senjata gratis, jeda/lanjut, pengaturan, akhir misi, dan mulai ulang.
- Layout landscape 844 × 390, portrait 390 × 844, serta HP kecil 320 × 640; kontrol tetap di dalam layar dan panel dapat digulir.
- Pembelian modul hanggar bertahan setelah reload, termasuk reload offline; cache `neon-outpost-v2` aktif.
- Fixture browser khusus pengujian menampilkan Overlord fase 2 dengan renderer sebenarnya. Fixture tidak disertakan sebagai kontrol debug pada game produksi.

## Batas verifikasi

Belum diuji pada HP fisik, Safari, pemasangan PWA melalui menu browser, atau APK native. Pengujian GPU perangkat lunak bukan tolok ukur FPS atau penggunaan baterai. Simulasi kemenangan dengan mod tidak membuktikan keseimbangan semua kesulitan tanpa mod.

Browser cloud untuk administrasi GitHub sebelumnya tidak mendukung WebGL 2. Karena itu, pemeriksaan renderer menggunakan browser lokal; verifikasi publikasi memeriksa hasil deployment dan berkas yang tersaji, bukan klaim pengujian HP fisik.
