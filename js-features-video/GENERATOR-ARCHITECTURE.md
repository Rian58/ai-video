# Arsitektur Video Generator

Dokumen ini menjelaskan status implementasi UI Video Generator saat ini, integrasinya (atau ketiadaan integrasinya) dengan mesin utama Remotion, dan langkah-langkah selanjutnya yang disarankan untuk *deployment* secara *production-ready*.

## Status Saat Ini (Proyek Remotion)
Komponen generator (`src/Generator.tsx`) saat ini diimplementasikan sebagai komponen React murni lengkap dengan *state management* dan styling Tailwind.
- **Unmounted UI:** `Generator.tsx` saat ini **tidak di-mount** atau dijalankan oleh entry point utama proyek. File `src/index.ts` tetap aman secara struktural dan murni hanya meregistrasi `RemotionRoot` via `registerRoot(RemotionRoot)` agar kompatibel dengan Remotion CLI dan Studio.
- **Workflow Default:** Proyek ini masih murni proyek video Remotion. Untuk melihat preview video dan komposisi animasi, `npm run dev` tetap digunakan yang akan meluncurkan Remotion Studio.
- **TIDAK untuk Composition:** Harap diingat bahwa UI Generator **tidak boleh** dirender sebagai bagian dari sebuah `Composition` Remotion. Komponen `Composition` digunakan khusus untuk me-render bingkai video (*frames*), bukan untuk merender UI web interaktif seperti *form* atau *wizard*. 

## Ketergantungan UI (Tailwind CSS)
- File `src/Generator.tsx` sangat bergantung pada utility classes dari Tailwind CSS.
- Saat ini, Tailwind CSS (versi 4) telah berhasil dikonfigurasi pada proyek Remotion ini (dapat dilihat dari `@import "tailwindcss";` di `src/index.css` dan `enableTailwind` di `remotion.config.ts`).
- **Penting:** Jika nanti Anda memindahkan `Generator.tsx` ke repositori Web App terpisah, Anda **wajib** melakukan instalasi dan setup Tailwind CSS di repositori baru tersebut agar gaya UI tidak hancur.

## Tahap Selanjutnya (Web App Mandiri)
Untuk meng-host UI Generator dengan benar (misalnya di Vercel, Netlify, atau layanan web *hosting* lainnya), pendekatan yang disarankan adalah **Memisahkan Frontend dari Video Engine**.

1. **Buat Proyek Web Terpisah:** Inisialisasi proyek React/Vite atau Next.js yang terpisah dari folder video ini.
2. **Pindahkan Komponen:** Pindahkan `src/Generator.tsx`, `src/types.ts` dan styling Tailwind ke dalam proyek baru tersebut.
3. **Integrasi `@remotion/player`:** Pada *Langkah 3 (Video)* di dalam *wizard*, gunakan komponen `<Player />` dari package `@remotion/player` (bukan `@remotion/studio`) untuk merender `<MyComp />` secara interaktif dalam iframe/canvas di web.
4. **Backend/CLI Render Pipeline:** Setelah pengguna mengklik tombol "Mulai Render Video" pada web UI, Anda bisa mengirimkan JSON (`VideoConfig`) ke sistem *backend* (menggunakan *serverless functions* atau Node.js VPS) yang nantinya memanggil `@remotion/cli` (misal: `npx remotion render`) atau menggunakan `@remotion/lambda`.
