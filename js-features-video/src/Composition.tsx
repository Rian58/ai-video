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
  try {
    const durationInSeconds = await getAudioDurationInSeconds(
      staticFile('narasi.mp3'),
    )
    const durationInFrames = Math.ceil(durationInSeconds * fps)

    return {
      durationInFrames: Math.max(durationInFrames, 60),
      props: {},
    }
  } catch (err) {
    console.error('Error fetching audio duration:', err)
    return {
      durationInFrames: 3000,
      props: {},
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
