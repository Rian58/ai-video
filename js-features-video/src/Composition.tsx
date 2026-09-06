import { getAudioDurationInSeconds } from '@remotion/media-utils'
import {
  type CalculateMetadataFunction,
  Composition,
  staticFile,
} from 'remotion'
import { MyComponent } from './MainVideo'
import type { VideoConfig } from './types'

type Props = Partial<VideoConfig>

const calculateMetadata: CalculateMetadataFunction<Props> = async () => {
  const fps = 30
  let config: Props = {}

  try {
    const res = await fetch(staticFile('video-config.json'))
    if (res.ok) {
      config = await res.json()
    }
  } catch (err) {
    // config file not found, will use default fallback
  }

  try {
    const durationInSeconds = await getAudioDurationInSeconds(
      staticFile(config.audioSrc || 'narasi.mp3'),
    )
    const durationInFrames = Math.ceil(durationInSeconds * fps)

    return {
      durationInFrames: Math.max(durationInFrames, 60),
      props: config,
    }
  } catch (err) {
    console.error('Error fetching audio duration:', err)
    let fallbackDuration = 3000
    if (config.scenes && config.scenes.length > 0) {
      fallbackDuration = Math.max(60, config.scenes.length * 150)
    }

    return {
      durationInFrames: fallbackDuration,
      props: config,
    }
  }
}

export const MyComposition = () => {
  return (
    <Composition
      id="MyComp"
      component={MyComponent}
      defaultProps={{}}
      durationInFrames={3000} // Default value before calculateMetadata runs
      fps={30}
      width={1920}
      height={1080}
      calculateMetadata={calculateMetadata}
    />
  )
}
