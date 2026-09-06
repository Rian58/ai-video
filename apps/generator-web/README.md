# Video Generator Web Dashboard

Ini adalah antarmuka web mandiri untuk Generator Video Remotion.
Dibangun menggunakan Vite, React, dan TypeScript.

## Prasyarat
- Node.js versi 18 atau lebih baru.

## Instalasi
```bash
npm install
```

## Menjalankan Development Server
```bash
npm run dev
```
Buka browser pada alamat yang ditampilkan (biasanya `http://localhost:5173`).

## Pengecekan Kode (Lint & Format)
Proyek ini menggunakan **Biome** alih-alih ESLint/Prettier.
```bash
npm run check
```
Jika ingin melakukan format secara otomatis:
```bash
npm run format
```

## Proses Build
```bash
npm run build
```
Ini akan menjalankan pengecekan TypeScript (`tsc -b`) dan membuat bundel produksi dengan Vite.
