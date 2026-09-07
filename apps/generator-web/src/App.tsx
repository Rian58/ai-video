import { Player } from '@remotion/player'
import { MyComponent } from 'js-features-video/MainVideo'
import { type ChangeEvent, useRef, useState } from 'react'
import 'js-features-video/styles'
import type { SceneConfig, SceneType, VideoConfig } from './types/video'

function App() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [config, setConfig] = useState<VideoConfig>({
    title: '',
    brief: '',
    script: '',
    narrationMode: 'upload',
    subtitlesEnabled: true,
    subtitleLanguage: 'id',
    scenes: [],
    visualTemplate: 'dark-code-editor',
    aspectRatio: '16:9',
  })
  const [audioUrl, setAudioUrl] = useState<string>('')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isSending, setIsSending] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleNext = () => setStep((s) => Math.min(s + 1, 3) as 1 | 2 | 3)
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1) as 1 | 2 | 3)

  const parseScript = () => {
    if (!config.script.trim()) return

    // Split by empty lines or headings
    const blocks = config.script
      .split(/(?:\r?\n){2,}/)
      .map((b) => b.trim())
      .filter(Boolean)

    const newScenes: SceneConfig[] = blocks.map((block, i) => {
      let type: SceneType = 'explanation'
      if (i === 0) type = 'intro'
      else if (i === blocks.length - 1) type = 'outro'
      else if (block.includes('```')) type = 'code'
      else if (block.toLowerCase().includes('kesimpulan')) type = 'conclusion'

      let narration = block
      let code: string | undefined

      // Extract code block
      const codeMatch = block.match(/```([\s\S]*?)```/)
      if (codeMatch) {
        code = codeMatch[1].replace(/^[a-z]+/, '').trim() // remove lang tag if exists
        narration = block.replace(/```[\s\S]*?```/g, '').trim()
      }

      // Extract heading as title
      let title = `Scene ${i + 1}`
      const titleMatch = narration.match(/^#+\s+(.*)/m)
      if (titleMatch) {
        title = titleMatch[1].trim()
      }

      // Remove headings for narration
      narration = narration.replace(/^#+\s+/gm, '')

      return {
        id: `scene-${Date.now()}-${i}`,
        title,
        type,
        text: narration || block, // fallback if empty after code extraction
        code,
        weight: Math.max(1, narration.length),
      }
    })

    setConfig((prev) => ({ ...prev, scenes: newScenes }))
  }

  const handleAudioUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    setAudioUrl(url)
    setAudioFile(file)

    const audio = new Audio(url)
    audio.onloadedmetadata = () => {
      setConfig((prev) => ({
        ...prev,
        audioFileName: file.name,
        audioSize: file.size,
        audioDuration: audio.duration,
      }))
    }
  }

  const exportJson = () => {
    const exportData = { ...config }
    // Clean up audioSrc for final config, as browser URL is invalid in Node.js
    if (exportData.narrationMode === 'upload' && exportData.audioFileName) {
      exportData.audioSrc = '' // Set empty or specific path for CLI script to resolve later
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'video-config.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const sendToLocalhost = async () => {
    setIsSending(true)
    const exportData = { ...config }
    let audioData = null

    if (exportData.narrationMode === 'upload' && audioFile) {
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result as string
          resolve(result.split(',')[1])
        }
        reader.readAsDataURL(audioFile)
      })
      audioData = {
        fileName: audioFile.name,
        base64,
      }
    }

    exportData.audioSrc = ''

    try {
      const res = await fetch('http://localhost:4000/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: exportData, audio: audioData }),
      })
      const resData = await res.json()
      if (res.ok) {
        alert(resData.message)
      } else {
        alert(`Gagal sinkronisasi: ${resData.error}`)
      }
    } catch (_err) {
      alert(
        'Koneksi ke http://localhost:4000 gagal. Pastikan "node local-server.mjs" sedang berjalan di laptop Anda!',
      )
    } finally {
      setIsSending(false)
    }
  }

  const deleteFromLocalhost = async () => {
    try {
      const res = await fetch('http://localhost:4000/sync', {
        method: 'DELETE',
      })
      const resData = await res.json()
      if (res.ok) {
        alert(resData.message)
      } else {
        alert(`Gagal menghapus config: ${resData.error}`)
      }
    } catch (_err) {
      alert(
        'Koneksi ke http://localhost:4000 gagal. Pastikan "node local-server.mjs" sedang berjalan di laptop Anda!',
      )
    }
  }

  const isRenderDisabled = () => {
    if (!config.script) return true
    if (config.scenes.length === 0) return true
    if (config.narrationMode === 'upload' && !config.audioFileName) return true
    return false
  }

  return (
    <div className="container">
      <div className="wizard-container">
        <div className="wizard-header">
          <h1>Video Generator Wizard</h1>
          <div className="steps-indicator">
            <div className={`step-dot ${step >= 1 ? 'active' : ''}`} />
            <div className={`step-dot ${step >= 2 ? 'active' : ''}`} />
            <div className={`step-dot ${step >= 3 ? 'active' : ''}`} />
          </div>
        </div>

        <div className="wizard-body">
          {step === 1 && (
            <div>
              <h2 style={{ marginBottom: '1.5rem' }}>Langkah 1: Naskah</h2>

              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Judul Video *
                </label>
                <input
                  id="title"
                  type="text"
                  className="form-input"
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  placeholder="Contoh: 16 Fitur JavaScript Modern"
                />
              </div>

              <div className="form-group">
                <label htmlFor="brief" className="form-label">
                  Topik / Brief (Opsional)
                </label>
                <input
                  id="brief"
                  type="text"
                  className="form-input"
                  value={config.brief}
                  onChange={(e) => setConfig({ ...config, brief: e.target.value })}
                  placeholder="Konteks tambahan..."
                />
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label htmlFor="script" className="form-label" style={{ marginBottom: 0 }}>
                    Naskah (Bahasa Indonesia) *
                  </label>
                  <button
                    type="button"
                    className="btn btn-secondary btn-small"
                    disabled
                    title="Segera hadir"
                  >
                    ✨ Buat Naskah AI
                  </button>
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <textarea
                    id="script"
                    className="form-textarea"
                    value={config.script}
                    onChange={(e) => setConfig({ ...config, script: e.target.value })}
                    placeholder="Tulis naskah video Anda di sini..."
                  />
                </div>
              </div>

              <div className="card flex-between">
                <div>
                  <span className="text-muted">Total Scene: </span>
                  <strong>{config.scenes.length}</strong>
                </div>
                <button
                  type="button"
                  onClick={parseScript}
                  disabled={!config.script}
                  className="btn btn-primary"
                >
                  Bagi Menjadi Scene
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ marginBottom: '1.5rem' }}>Langkah 2: Narasi</h2>

              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="narration"
                    value="upload"
                    className="radio-input"
                    checked={config.narrationMode === 'upload'}
                    onChange={() => setConfig({ ...config, narrationMode: 'upload' })}
                  />
                  <div>
                    <div className="radio-text">Upload MP3 dari ElevenLabs</div>
                  </div>
                </label>

                <label className="radio-label disabled">
                  <input
                    type="radio"
                    name="narration"
                    value="elevenlabs-api"
                    className="radio-input"
                    disabled
                  />
                  <div>
                    <div className="radio-text text-muted">Generate dengan ElevenLabs API</div>
                    <div className="radio-hint">Segera Hadir</div>
                  </div>
                </label>

                <label className="radio-label">
                  <input
                    type="radio"
                    name="narration"
                    value="none"
                    className="radio-input"
                    checked={config.narrationMode === 'none'}
                    onChange={() => setConfig({ ...config, narrationMode: 'none' })}
                  />
                  <div>
                    <div className="radio-text">Tanpa audio, preview visual saja</div>
                  </div>
                </label>
              </div>

              {config.narrationMode === 'upload' && (
                <div className="card">
                  <label htmlFor="audio" className="form-label">
                    Pilih File Audio (MP3/WAV)
                  </label>
                  <input
                    id="audio"
                    type="file"
                    accept="audio/mp3, audio/wav, audio/m4a"
                    ref={fileInputRef}
                    onChange={handleAudioUpload}
                    style={{ marginBottom: '1rem' }}
                  />

                  {config.audioFileName && (
                    <div className="audio-preview">
                      <div
                        className="text-muted"
                        style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}
                      >
                        <div>
                          <strong>File:</strong> {config.audioFileName}
                        </div>
                        <div>
                          <strong>Ukuran:</strong>{' '}
                          {config.audioSize ? (config.audioSize / 1024 / 1024).toFixed(2) : 0} MB
                        </div>
                        <div>
                          <strong>Durasi:</strong>{' '}
                          {config.audioDuration ? config.audioDuration.toFixed(1) : 0} dtk
                        </div>
                      </div>

                      <audio controls src={audioUrl} />

                      <div className="info-box">
                        <span className="info-icon">⚠️</span>
                        <div className="info-text">
                          Upload di sini hanya untuk keperluan preview di browser (URL Object).
                          Sebelum melakukan render lokal, Anda <strong>wajib</strong> menempatkan
                          file MP3 yang sama ke dalam folder <code>js-features-video/public/</code>.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 style={{ marginBottom: '1.5rem' }}>Langkah 3: Video</h2>

              <div className="grid-2 form-group">
                <div>
                  <label htmlFor="template" className="form-label">
                    Template
                  </label>
                  <select
                    id="template"
                    className="form-select"
                    disabled
                    value={config.visualTemplate}
                  >
                    <option value="dark-code-editor">Dark Code Editor</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="ar" className="form-label">
                    Aspect Ratio
                  </label>
                  <select id="ar" className="form-select" disabled value={config.aspectRatio}>
                    <option value="16:9">YouTube 16:9</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="switch-label">
                  <div>
                    <div className="switch-text">Subtitle Bahasa Indonesia</div>
                    <div className="switch-desc">Tampilkan otomatis di layar</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.subtitlesEnabled}
                    onChange={(e) => setConfig({ ...config, subtitlesEnabled: e.target.checked })}
                  />
                </label>
              </div>

              <div className="card">
                <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Ringkasan Video</h3>
                <ul style={{ listStyle: 'none', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  <li>
                    - <strong>Judul:</strong> {config.title || '(Belum diisi)'}
                  </li>
                  <li>
                    - <strong>Jumlah Scene:</strong> {config.scenes.length} scene
                  </li>
                  <li>
                    - <strong>Audio:</strong>{' '}
                    {config.narrationMode === 'upload'
                      ? config.audioFileName
                        ? 'Telah di-upload'
                        : 'Belum di-upload'
                      : config.narrationMode === 'none'
                        ? 'Tanpa Audio'
                        : 'API'}
                  </li>
                </ul>
              </div>

              <div
                style={{
                  marginTop: '1.5rem',
                  marginBottom: '1.5rem',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid var(--border-color)',
                }}
              >
                <Player
                  component={MyComponent}
                  inputProps={{
                    ...config,
                    audioSrc: config.narrationMode === 'upload' ? audioUrl : undefined,
                  }}
                  durationInFrames={Math.max(60, config.scenes.length * 150)}
                  fps={30}
                  compositionWidth={1920}
                  compositionHeight={1080}
                  style={{ width: '100%' }}
                  controls
                  autoPlay
                  loop
                />
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ flex: 1, padding: '1rem', fontSize: '1rem' }}
                  disabled={isRenderDisabled() || isSending}
                  onClick={sendToLocalhost}
                >
                  {isSending ? 'Mengirim...' : 'Kirim ke Localhost'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '1rem', fontSize: '1rem', backgroundColor: 'var(--accent-red)' }}
                  onClick={deleteFromLocalhost}
                >
                  Reset Local
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ padding: '1rem', fontSize: '1rem' }}
                  disabled={isRenderDisabled()}
                  onClick={exportJson}
                >
                  Download JSON
                </button>
              </div>
              {isRenderDisabled() && (
                <div
                  style={{
                    textAlign: 'center',
                    marginTop: '0.5rem',
                    color: 'var(--accent-red)',
                    fontSize: '0.75rem',
                  }}
                >
                  Mohon lengkapi Naskah, Pembagian Scene, dan Upload Audio (jika dipilih)
                </div>
              )}
            </div>
          )}
        </div>

        <div className="wizard-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handlePrev}
            disabled={step === 1}
          >
            Kembali
          </button>

          {step < 3 && (
            <button type="button" className="btn btn-primary" onClick={handleNext}>
              Selanjutnya
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
