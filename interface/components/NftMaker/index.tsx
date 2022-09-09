import { FunctionComponent } from 'react'
import { Box, Button } from '@chakra-ui/react'

const NftMaker: FunctionComponent = () => {
  return (
    <Box textAlign="center">
      <Button verticalAlign="bottom" onClick={() => alert('Make New is clicked!')}>
        Make New
      </Button>
    </Box>
  )
}

export { NftMaker }
