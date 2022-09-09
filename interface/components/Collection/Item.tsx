import { FunctionComponent } from 'react'
import { Box, Text, Button } from '@chakra-ui/react'

interface ItemProps {
  nft: Nft
  saleable: boolean
}

const Item: FunctionComponent<ItemProps> = ({ nft, saleable }) => {
  return (
    <Box textAlign="center" w="300px" h="300px">
      <Text fontSize="xl" textAlign="center" my="30">
        {nft.id}
      </Text>
      {saleable && (
        <Button verticalAlign="bottom" onClick={() => alert('purchase is clicked!')}>
          Purchase
        </Button>
      )}
    </Box>
  )
}

export { Item }
