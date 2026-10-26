# Neon Outpost

Game survival 3D untuk browser mobile, dibuat tanpa dependensi atau aset eksternal. Pertahankan arena dari lima gelombang drone. Kumpulkan kredit dan beli upgrade. Seluruh model dibuat secara prosedural menggunakan WebGL 2.

## Mainkan

Jalankan dari direktori proyek:

```sh
python3 -m http.server 8080 --bind 0.0.0.0
```

Buka `http://localhost:8080`. Untuk HP dalam Wi-Fi yang sama, buka alamat IP komputer, misalnya `http://192.168.1.10:8080` (ganti dengan IP komputer Anda). `index.html` juga mandiri dan dapat dibuka sebagai berkas di browser desktop; beberapa pengelola berkas Android hanya menampilkan pratinjau HTML, sehingga tautan HTTPS lebih disarankan.

## Mobile

- Joystick kiri untuk bergerak.
- Tahan TEMBAK: bidikan otomatis ke drone terdekat.
- Tombol ϟ: dash dengan jeda 2,7 detik. Kebal singkat selama dash.
- MOD, UPGRADE, dan jeda di kanan atas. Membuka menu menjeda pertempuran.
- Posisi landscape disarankan; portrait juga didukung.
- Pilih HD, Seimbang, atau Hemat lewat pengaturan.
- Audio baru aktif setelah interaksi. Tidak ada unduhan audio atau pelacakan.
- Keyboard: WASD/panah, Space menembak, Shift dash, Esc jeda.

## Mod bawaan

**God mode:** serangan tidak mengurangi HP. **Unlimited money:** pembelian tidak memakai kredit asli; mematikannya mengembalikan tampilan saldo asli. Kredit yang dipungut tetap ditambahkan ke saldo asli. Upgrade tetap berlaku setelah mod dimatikan. Keduanya dapat diaktif/nonaktifkan terpisah ketika misi berlangsung. Misi baru mereset mod dan upgrade. Penggunaan mod menandai misi dan mengecualikan skornya dari rekor tanpa mod.

## GitHub Pages

1. Buat repository baru dan unggah isi folder ini ke root repository pada branch `main`, termasuk `.github/workflows/pages.yml`.
2. Pada **Settings → Pages → Build and deployment**, pilih **GitHub Actions**.
3. Jalankan workflow **Publish Neon Outpost** atau push perubahan ke `main`.
4. Buka tautan hasil deployment di HP. Dari menu browser, gunakan **Tambahkan ke Layar Utama** bila tersedia.

Alur deployment mengikuti fitur GitHub Actions/Pages; pilihan atau izin pada akun Anda dapat berbeda. File workflow disediakan dan belum dijalankan pada akun pengguna. Jika workflow tidak diunggah, situs statis ini juga bisa dipublikasikan dengan opsi **Deploy from a branch**, branch `main`, folder `/ (root)`.

## Offline dan penyimpanan

Service worker meng-cache berkas game setelah kunjungan HTTPS pertama. Setelah cache selesai, game dapat dimainkan offline. Rekor tanpa mod dan preferensi disimpan di browser setempat; kemajuan misi tidak disimpan. Tidak ada akun, backend, pembelian asli, atau koneksi eksternal saat bermain. Pembaruan situs dapat memerlukan pemuatan ulang tab. Ikon SVG dan PNG disediakan; dukungan pemasangan dan ikon dapat berbeda pada browser mobile.

## Batas perangkat

Memerlukan WebGL 2 dan browser modern. HD memakai resolusi hingga 2× ukuran CSS layar; detail visual bergaya sci-fi, bukan fotorealistis. Frame rate bergantung pada GPU dan suhu perangkat. Jika terasa berat, pilih Seimbang atau Hemat. Ini game browser/PWA, bukan APK native. Belum diuji pada perangkat fisik Android/iPhone.

## Verifikasi

Tes aturan game, tanpa dependensi:

```sh
node --test tests/*.test.mjs
```

Tes browser opsional memerlukan `playwright` dan Chromium:

```sh
npm install --no-save playwright
npx playwright install chromium
python3 -m http.server 8080
# terminal lain:
node tests/browser.cjs
```

Tes browser menggunakan server localhost:8080. Lihat `VALIDATION.md` untuk hasil pemeriksaan pada lingkungan pembuatan.

## Lisensi

Kode dan aset prosedural proyek ini berlisensi MIT. Lihat LICENSE.

Panduan Pages resmi: https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
