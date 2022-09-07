import { FunctionComponent } from 'react'
import { Text, Box, Wrap, WrapItem, Center } from '@chakra-ui/react'
import { useContents } from '../../hooks/Contents'

const Content: FunctionComponent = () => {
  const contents = useContents()
  return (
    <Box>
      <Text fontSize="6xl" textAlign="center" my="30" className="web3-title" data-testid="text">
        welcome to web3 template
      </Text>
      <Wrap spacing="30px" justify="center" my="50">
        {contents ? (
          contents.map((e, i) => (
            <WrapItem border="2px" className="web3-background" data-testid={`item-${i}`} key={i}>
              <Center w="300px" h="300px">
                {e}
              </Center>
            </WrapItem>
          ))
        ) : (
          <></>
        )}
      </Wrap>
    </Box>
  )
}

export { Content }
