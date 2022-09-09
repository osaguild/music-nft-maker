import { FunctionComponent } from 'react'
import { Box, Text, Button } from '@chakra-ui/react'

interface NftProps {
  nft: Nft
}

const Nft: FunctionComponent<NftProps> = ({ nft }) => {
  return (
    <Box textAlign="center" w="300px" h="300px">
      <Text fontSize="xl" textAlign="center" my="30">
        {nft.id}
      </Text>
      <Button verticalAlign="bottom" onClick={() => alert('purchase is clicked!')}>
        Purchase
      </Button>
    </Box>
  )
}

export { Nft }
