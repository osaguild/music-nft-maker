import { FunctionComponent } from 'react'
import { Box, Text, Button } from '@chakra-ui/react'
import { isFanficToken } from '../../types/typeGuard'
import { Pattern } from '.'

interface ItemProps {
  token: Erc721
  pattern: Pattern
}

const Item: FunctionComponent<ItemProps> = ({ token, pattern }) => {
  return (
    <Box textAlign="center" w="300px" h="300px">
      <Text fontSize="xl" textAlign="center" my="30">
        {isFanficToken(token) ? `Fanfic Token ${token.id} ` : `Origin Token ${token.id}`}
      </Text>
      {/*
      pattern == "ON_SALE" && (
        <Button verticalAlign="bottom" onClick={() => alert('purchase is clicked!')}>
          Purchase
        </Button>
      )
      */}
    </Box>
  )
}

export { Item }
