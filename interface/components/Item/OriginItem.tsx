import { FunctionComponent, useState, useEffect } from 'react'
import { Box, Text } from '@chakra-ui/react'
import { Item } from './Item'

interface OriginItemProps {
  origin: Origin
}

const OriginItem: FunctionComponent<OriginItemProps> = ({ origin }) => {
  const [image, setImage] = useState<string>()
  const [audio, setAudio] = useState<string>()

  useEffect(() => {
    if (origin) {
      fetch(origin.uri)
        .then((res) => res.json())
        .then((json) => {
          setImage(json.image)
          setAudio(json.animation_url)
        })
    }
  }, [origin])

  return (
    <Box>
      <Item image={image as string} audio={audio as string} />
      <Text fontSize="l" textAlign="center">
        {`Origin NFT / ${origin.id}`}
      </Text>
    </Box>
  )
}

export { OriginItem }
