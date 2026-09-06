import type React from 'react'
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'

type SceneTransitionProps = {
  children: React.ReactNode
}

export const SceneTransition: React.FC<SceneTransitionProps> = ({
  children,
}) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  // Animate in
  const entrance = spring({
    frame,
    fps,
    config: { damping: 200, mass: 0.5 },
  })

  // Animate out (starting 15 frames before the end)
  const exit = spring({
    frame: frame - (durationInFrames - 15),
    fps,
    config: { damping: 200, mass: 0.5 },
  })

  const opacity =
    interpolate(frame, [0, 15], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }) - interpolate(exit, [0, 1], [0, 1])

  const translateY =
    interpolate(entrance, [0, 1], [50, 0]) - interpolate(exit, [0, 1], [0, -50])

  return (
    <AbsoluteFill style={{ opacity, transform: `translateY(${translateY}px)` }}>
      {children}
    </AbsoluteFill>
  )
}
