import type React from 'react'
import {
  AbsoluteFill,
  Audio,
  Series,
  staticFile,
  useVideoConfig,
} from 'remotion'
import { CodeBlock } from './components/CodeBlock'
import { Diagram } from './components/Diagram'
import { Layout } from './components/Layout'
import { SceneTransition } from './components/SceneTransition'
import { SCENES } from './data/scenes'
import type { VideoConfig } from './types'

export const MyComponent: React.FC<Partial<VideoConfig>> = (props) => {
  const { durationInFrames } = useVideoConfig()

  const activeScenes =
    props.scenes && props.scenes.length > 0 ? props.scenes : SCENES

  // Distribute the total duration among all scenes evenly
  // Using Math.max(1, ...) to avoid 0 duration
  const sceneDuration = Math.max(
    1,
    Math.floor(durationInFrames / activeScenes.length),
  )

  return (
    <AbsoluteFill className="bg-[var(--color-bg-main)] text-[var(--color-text-normal)]">
      {props.narrationMode !== 'none' && (
        <Audio src={staticFile(props.audioSrc || 'narasi.mp3')} />
      )}

      <Series>
        {activeScenes.map((scene, index) => {
          // ensure the last scene takes up the remaining frames to avoid empty space
          const isLast = index === activeScenes.length - 1
          const duration = isLast
            ? durationInFrames - sceneDuration * (activeScenes.length - 1)
            : sceneDuration

          return (
            <Series.Sequence
              key={scene.id}
              durationInFrames={duration}
              layout="none"
            >
              <SceneTransition>
                {scene.type === 'intro' ? (
                  <AbsoluteFill className="justify-center items-center p-12 text-center bg-[var(--color-bg-main)]">
                    <h1 className="text-7xl font-bold text-[var(--color-accent-cyan)] mb-8">
                      {scene.title}
                    </h1>
                    <p className="text-3xl text-[var(--color-accent-green)]">
                      Mulai Belajar
                    </p>
                  </AbsoluteFill>
                ) : scene.type === 'outro' ? (
                  <AbsoluteFill className="justify-center items-center p-12 text-center bg-[var(--color-bg-main)]">
                    <h1 className="text-7xl font-bold text-[var(--color-accent-yellow)] mb-8">
                      {scene.title}
                    </h1>
                    <p className="text-3xl text-[var(--color-text-normal)]">
                      Jangan Lupa Subscribe!
                    </p>
                  </AbsoluteFill>
                ) : (
                  <Layout title={scene.title}>
                    <CodeBlock code={scene.code || ''} />
                    {scene.diagram && <Diagram type={scene.diagram} />}
                    {/* 
                      Note: SceneData only has base properties. 
                      We cast to any or check 'text' dynamically since it comes from SceneConfig
                    */}
                    {(scene as any).text && (
                      <div className="absolute bottom-12 left-12 right-12 text-center text-4xl leading-relaxed text-[var(--color-text-normal)] bg-[var(--color-bg-panel)]/80 p-6 rounded-2xl border-2 border-[var(--color-accent-cyan)] shadow-[0_0_15px_rgba(100,210,255,0.2)]">
                        {(scene as any).text}
                      </div>
                    )}
                  </Layout>
                )}
              </SceneTransition>
            </Series.Sequence>
          )
        })}
      </Series>
    </AbsoluteFill>
  )
}
