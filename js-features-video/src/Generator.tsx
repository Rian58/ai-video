import type React from 'react'
import { useState } from 'react'
import type { SceneConfig, VideoConfig } from './types'

export const Generator: React.FC = () => {
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

  const handleNext = () => setStep((s) => Math.min(s + 1, 3) as 1 | 2 | 3)
  const handlePrev = () => setStep((s) => Math.max(s - 1, 1) as 1 | 2 | 3)

  const splitIntoScenes = () => {
    if (!config.script) return

    const paragraphs = config.script
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean)

    const newScenes: SceneConfig[] = paragraphs.map((text, i) => ({
      id: `scene-${i + 1}`,
      title: `Scene ${i + 1}`,
      type:
        i === 0 ? 'intro' : i === paragraphs.length - 1 ? 'outro' : 'feature',
      text,
    }))

    setConfig((prev) => ({ ...prev, scenes: newScenes }))
  }

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    const audio = new Audio(url)
    audio.onloadedmetadata = () => {
      setConfig((prev) => ({
        ...prev,
        audioSrc: url,
        audioFile: file,
        audioFileName: file.name,
        audioSize: file.size,
        audioDuration: audio.duration,
      }))
    }
  }

  const exportJson = () => {
    const exportData = { ...config }
    delete exportData.audioFile // Jangan serialize object File

    // Untuk render CLI/final, audioSrc idealnya menunjuk ke public path
    if (exportData.audioFileName) {
      exportData.audioSrc = `/${exportData.audioFileName}`
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

  const isRenderDisabled = () => {
    if (!config.script) return true
    if (config.scenes.length === 0) return true
    if (config.narrationMode === 'upload' && !config.audioSrc) return true
    return false
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8 font-sans">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-700 bg-gray-800/50">
          <h1 className="text-2xl font-bold text-white">
            Video Generator Wizard
          </h1>
          <div className="flex gap-4 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full ${
                  step >= s ? 'bg-blue-500' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Langkah 1: Naskah</h2>

              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Judul Video
                </label>
                <input
                  id="title"
                  type="text"
                  value={config.title}
                  onChange={(e) =>
                    setConfig({ ...config, title: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: 16 Fitur JavaScript Modern"
                />
              </div>

              <div>
                <label
                  htmlFor="brief"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Topik / Brief (Opsional)
                </label>
                <input
                  id="brief"
                  type="text"
                  value={config.brief}
                  onChange={(e) =>
                    setConfig({ ...config, brief: e.target.value })
                  }
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Konteks tambahan untuk AI..."
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label
                    htmlFor="naskah"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Naskah (Bahasa Indonesia) *
                  </label>
                  <button
                    type="button"
                    className="text-xs bg-gray-700 text-gray-400 px-2 py-1 rounded cursor-not-allowed"
                    title="Akan tersedia setelah AI API dikonfigurasi"
                    disabled
                  >
                    ✨ Buat Naskah AI
                  </button>
                </div>
                <textarea
                  id="naskah"
                  value={config.script}
                  onChange={(e) =>
                    setConfig({ ...config, script: e.target.value })
                  }
                  rows={8}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Tulis naskah video Anda di sini..."
                />
              </div>

              <div className="flex justify-between items-center bg-gray-700/50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-300">
                    Total Scene:{' '}
                    <span className="font-bold text-white">
                      {config.scenes.length}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={splitIntoScenes}
                  disabled={!config.script}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Bagi Menjadi Scene
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Langkah 2: Narasi</h2>
              <p className="text-sm text-gray-400 mb-4">
                Pilih sumber audio untuk sulih suara (voiceover).
              </p>

              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3 bg-gray-700/30 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors">
                  <input
                    type="radio"
                    name="narrationMode"
                    value="upload"
                    checked={config.narrationMode === 'upload'}
                    onChange={() =>
                      setConfig({ ...config, narrationMode: 'upload' })
                    }
                    className="text-blue-500 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="text-white font-medium">
                    Upload MP3 dari ElevenLabs
                  </span>
                </label>

                <label className="flex items-center space-x-3 p-3 bg-gray-700/30 border border-gray-600 rounded-lg opacity-50 cursor-not-allowed">
                  <input
                    type="radio"
                    name="narrationMode"
                    value="elevenlabs-api"
                    disabled
                    className="text-blue-500 focus:ring-blue-500 h-4 w-4"
                  />
                  <div className="flex flex-col">
                    <span className="text-gray-300 font-medium">
                      Generate dengan ElevenLabs API
                    </span>
                    <span className="text-xs text-blue-400 font-bold uppercase mt-1">
                      Segera Hadir
                    </span>
                  </div>
                </label>

                <label className="flex items-center space-x-3 p-3 bg-gray-700/30 border border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors">
                  <input
                    type="radio"
                    name="narrationMode"
                    value="none"
                    checked={config.narrationMode === 'none'}
                    onChange={() =>
                      setConfig({ ...config, narrationMode: 'none' })
                    }
                    className="text-blue-500 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="text-white font-medium">
                    Tanpa audio, preview visual saja
                  </span>
                </label>
              </div>

              {config.narrationMode === 'upload' && (
                <div className="mt-6 bg-gray-700/50 p-5 rounded-lg border border-gray-600">
                  <label
                    htmlFor="audio-upload"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Pilih File Audio (MP3/WAV/M4A)
                  </label>
                  <input
                    id="audio-upload"
                    type="file"
                    accept="audio/mp3, audio/wav, audio/m4a"
                    onChange={handleAudioUpload}
                    className="block w-full text-sm text-gray-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-600 file:text-white
                      hover:file:bg-blue-700 transition-colors cursor-pointer"
                  />

                  {config.audioSrc && (
                    <div className="mt-4 space-y-3">
                      <div className="text-sm text-gray-300 bg-gray-800 p-3 rounded">
                        <p>
                          <strong>File:</strong> {config.audioFileName}
                        </p>
                        <p>
                          <strong>Ukuran:</strong>{' '}
                          {config.audioSize
                            ? (config.audioSize / 1024 / 1024).toFixed(2)
                            : 0}{' '}
                          MB
                        </p>
                        <p>
                          <strong>Durasi:</strong>{' '}
                          {config.audioDuration
                            ? config.audioDuration.toFixed(1)
                            : 0}{' '}
                          detik
                        </p>
                      </div>

                      {/* biome-ignore lint/a11y/useMediaCaption: Preview audio only */}
                      <audio
                        controls
                        src={config.audioSrc}
                        className="w-full h-10"
                      />

                      <div className="bg-yellow-900/50 border border-yellow-700/50 p-3 rounded-lg flex items-start space-x-3">
                        <span className="text-yellow-500">⚠️</span>
                        <p className="text-xs text-yellow-200">
                          File audio ini hanya diload sementara di browser
                          (menggunakan ObjectURL). Untuk merender video secara
                          final melalui CLI, pastikan Anda menyalin file
                          <strong className="mx-1">
                            {config.audioFileName}
                          </strong>{' '}
                          ke dalam folder{' '}
                          <code className="bg-yellow-800/50 px-1 rounded">
                            public/
                          </code>
                          .
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Langkah 3: Video</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="visual-template"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Visual Template
                  </label>
                  <select
                    id="visual-template"
                    disabled
                    value={config.visualTemplate}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white opacity-70 cursor-not-allowed"
                  >
                    <option value="dark-code-editor">Dark Code Editor</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="aspect-ratio"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Aspect Ratio
                  </label>
                  <select
                    id="aspect-ratio"
                    disabled
                    value={config.aspectRatio}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white opacity-70 cursor-not-allowed"
                  >
                    <option value="16:9">YouTube 16:9</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600">
                <div>
                  <h3 className="text-white font-medium">
                    Subtitle Bahasa Indonesia
                  </h3>
                  <p className="text-sm text-gray-400">
                    Tampilkan teks subtitle otomatis di bawah layar
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.subtitlesEnabled}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        subtitlesEnabled: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>

              <div className="pt-4 space-y-4">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      alert(
                        'Preview Video akan merender komponen <MyComp /> di Remotion Studio. Jalankan `npm run dev`.',
                      )
                    }
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                  >
                    Preview Video
                  </button>
                  <button
                    type="button"
                    onClick={exportJson}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                  >
                    Export JSON Config
                  </button>
                </div>

                <button
                  type="button"
                  disabled={isRenderDisabled()}
                  onClick={() =>
                    alert(
                      'Fitur Render Final (CLI) akan dipicu menggunakan data config ini.',
                    )
                  }
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white px-4 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg"
                >
                  Mulai Render Video
                </button>

                {isRenderDisabled() && (
                  <p className="text-sm text-red-400 text-center">
                    ⚠️ Anda harus mengisi naskah, membagi scene, dan mengunggah
                    audio (jika bukan mode tanpa audio) sebelum merender.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-700 bg-gray-800/80 flex justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={step === 1}
            className="px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed bg-gray-700 hover:bg-gray-600 text-white transition-colors"
          >
            Kembali
          </button>

          {step < 3 && (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Selanjutnya
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
