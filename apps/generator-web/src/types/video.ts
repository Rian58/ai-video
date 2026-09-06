export type SceneType = 'intro' | 'code' | 'explanation' | 'conclusion' | 'outro'

export interface SceneConfig {
  id: string
  title: string
  type: SceneType
  text: string
  code?: string
  weight: number
}

export type NarrationMode = 'upload' | 'elevenlabs-api' | 'none'

export interface VideoConfig {
  title: string
  brief?: string
  script: string
  narrationMode: NarrationMode
  audioSrc?: string
  audioFileName?: string
  audioDuration?: number
  audioSize?: number
  subtitlesEnabled: boolean
  subtitleLanguage: 'id'
  scenes: SceneConfig[]
  visualTemplate: 'dark-code-editor'
  aspectRatio: '16:9'
}
