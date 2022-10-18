import { FunctionComponent, useState, createRef } from 'react'
import { Box, BoxProps, Image, forwardRef, Icon, IconButton } from '@chakra-ui/react'
import { FiPlay, FiPause } from 'react-icons/fi'

interface ItemProps {
  image: string
  audio: string
}

const Item: FunctionComponent<ItemProps> = ({ image, audio }) => {
  const [playing, setPlaying] = useState<boolean>(false)
  const ref = createRef<HTMLVideoElement>()

  const play = () => {
    ref.current?.play()
    setPlaying(true)
  }

  const pause = () => {
    ref.current?.pause()
    setPlaying(false)
  }

  return (
    <Box textAlign="center" w="350px" h="350px" boxShadow="base" rounded="md">
      <Box position="absolute" width="50" height="50" mt="150" ml="150">
        {playing ? (
          <IconButton aria-label="pause" onClick={pause} icon={<Icon as={FiPause} />} size="lg" />
        ) : (
          <IconButton aria-label="play" onClick={play} icon={<Icon as={FiPlay} />} size="lg" />
        )}
      </Box>
      <Image src={image} alt="origin token image" />
      <Audio src={audio} ref={ref}></Audio>
    </Box>
  )
}

const Audio = forwardRef<BoxProps, 'audio'>((props, ref) => (
  <Box as="audio" width={0} height={0} ref={ref} {...props} />
))

export { Item }
