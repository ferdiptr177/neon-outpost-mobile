# Hasil verifikasi — 26 Oktober 2026

## Lulus

- 7 tes aturan dan simulasi melalui `node --test tests/*.test.mjs`.
- Simulasi combat dengan God mode dan upgrade maksimum mencapai kemenangan: 5 gelombang, total 70 drone. Menembak, tabrakan proyektil, spawn, reward, dan pergantian gelombang memakai logika game sebenarnya; renderer dimock untuk simulasi ini.
- Pemain diam tanpa mod dapat kalah; main ulang mereset HP, mod, upgrade, dan kemajuan.
- God mode dapat dimatikan dan damage normal kembali berlaku.
- Unlimited money tidak mengurangi saldo asli; menonaktifkannya tidak menghapus upgrade.
- Batas upgrade, harga, pemulihan HP, dan penolakan pembelian tidak sah.
- Pemeriksaan browser Chromium headless 153 dengan WebGL 2 melalui SwiftShader.
- Resolusi mobile 844 × 390 dan 390 × 844. Menu mod portrait sempat melebar; sudah diperbaiki dan pemeriksaan ulang lulus.
- Dua sentuhan simultan melalui Chrome DevTools Protocol: bergerak dengan joystick sambil menembak.
- Membeli tiga upgrade senjata, jeda/lanjut, pengaturan grafik, kembali ke menu, serta misi baru.
- Service worker aktif dan pemuatan ulang halaman saat jaringan offline berhasil.
- Tidak ditemukan error JavaScript halaman pada tes browser.

## Batas verifikasi

Belum diuji pada HP fisik Android/iPhone. Tes browser dengan GPU perangkat lunak bukan tolok ukur FPS atau daya tahan baterai. Safari, pemasangan PWA lewat menu browser, dan distribusi APK belum diuji. Proyek ini bukan APK. Tidak ada klaim fotorealisme atau FPS tertentu.

## Ulangi pemeriksaan

```sh
node --test tests/*.test.mjs
```

Tes browser: jalankan server lokal sesuai README, lalu `node tests/browser.cjs`. Diperlukan Playwright dan Chromium. Variabel `CHROMIUM_PATH` opsional dapat menunjuk executable Chromium yang sudah ada. Tangkapan layar QA ditulis ke direktori temporer, bukan ke paket distribusi.

## Publikasi GitHub Pages

Repository `ferdiptr177/neon-outpost-mobile` telah diisi dengan 14 berkas proyek, dan seluruh SHA blob cocok dengan berkas lokal. GitHub Actions berhasil menerbitkan situs di https://ferdiptr177.github.io/neon-outpost-mobile/. Halaman publik berhasil dimuat. Browser pemeriksaan cloud tidak mendukung WebGL 2, sehingga pemeriksaan gameplay pada URL publik tidak dapat dilakukan di browser tersebut. Pemeriksaan renderer dan alur bermain sebelumnya dilakukan pada Chromium lokal dengan SwiftShader. Belum ada pengujian HP fisik.
