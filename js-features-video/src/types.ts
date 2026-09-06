import type { SceneData } from './data/scenes'

export type SceneConfig = SceneData & {
  text?: string // Naskah per scene
}

export type NarrationMode = 'upload' | 'elevenlabs-api' | 'none'

export interface VideoConfig {
  title: string
  brief?: string
  script: string
  narrationMode: NarrationMode
  audioSrc?: string
  audioFile?: File // Untuk menyimpan referensi file lokal sementara di wizard (jangan disimpan di JSON final jika butuh di-serialize)
  audioFileName?: string
  audioDuration?: number
  audioSize?: number
  subtitlesEnabled: boolean
  subtitleLanguage: 'id'
  scenes: SceneConfig[]
  visualTemplate: 'dark-code-editor'
  aspectRatio: '16:9'
}
