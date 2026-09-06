import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'

const app = express()

// Izinkan CORS dari Vercel atau localhost manapun
app.use(cors())

// Izinkan payload besar (sampai 50MB) karena bisa berisi audio base64
app.use(express.json({ limit: '50mb' }))

app.post('/sync', (req, res) => {
  const { config, audio } = req.body

  if (!config) {
    return res.status(400).json({ error: 'Config is missing' })
  }

  const publicDir = path.join(process.cwd(), 'public')
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir)
  }

  // 1. Simpan audio jika ada payload base64
  if (audio && audio.base64) {
    const audioFileName = audio.fileName || 'narasi.mp3'
    const audioPath = path.join(publicDir, audioFileName)
    
    // Tulis ke public folder
    fs.writeFileSync(audioPath, Buffer.from(audio.base64, 'base64'))
    
    // Pastikan config menggunakan nama file tersebut (bisa dibaca staticFile() di Remotion)
    config.audioSrc = audioFileName
  } else if (config.narrationMode === 'upload' && config.audioFileName) {
    // Jika Vercel hanya mengirim JSON (karena API batas payload atau sejenisnya)
    config.audioSrc = config.audioFileName
  } else {
    config.audioSrc = ''
  }

  // 2. Simpan config
  const configPath = path.join(publicDir, 'video-config.json')
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2))

  console.log(`[SYNC] Berhasil mensinkronisasi data ke ${configPath}`)
  res.json({ success: true, message: 'Data dan audio berhasil disinkronkan ke localhost.' })
})

const PORT = 4000
app.listen(PORT, () => {
  console.log(`🚀 Local Sync Server berjalan di http://localhost:${PORT}`)
  console.log('Server ini siap menerima VideoConfig dan Audio dari Vercel Anda.')
})
