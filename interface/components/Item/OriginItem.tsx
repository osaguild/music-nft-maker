import { FunctionComponent, useState, useEffect } from 'react'
import { Box, Text, Image } from '@chakra-ui/react'

interface OriginItemProps {
  origin: Origin
}

const OriginItem: FunctionComponent<OriginItemProps> = ({ origin }) => {
  const [image, setImage] = useState<string>()
  const [sound, setSound] = useState<string>()

  useEffect(() => {
    if (origin) {
      fetch(origin.uri)
        .then((res) => res.json())
        .then((json) => {
          setImage(json.image)
          setSound(json.animation_url)
        })
    }
  }, [origin])

  return (
    <Box textAlign="center" w="350" h="350px">
      <Text fontSize="l" textAlign="center" position="absolute" height="30px" color="black" w="350px" mt={2}>
        {`id: ${origin.id}`}
      </Text>
      <Image src={image} alt="origin token image" />
      <Box as="video" controls src={sound} width="350px" height="50px" mt="-50px" />
    </Box>
  )
}

export { OriginItem }
