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
        <Audio src={props.audioSrc || staticFile('narasi.mp3')} />
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
