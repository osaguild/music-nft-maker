import { FunctionComponent } from 'react'
import { Center, Text } from '@chakra-ui/react'

const Footer: FunctionComponent = () => {
  return (
    <Center>
      <Text fontSize="large" py={2}>
        @{new Date().getFullYear()} osaguild.com
      </Text>
    </Center>
  )
}

export { Footer }
