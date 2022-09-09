import { FunctionComponent } from 'react'
import { Box, Button, Text, Stat, StatLabel, StatNumber, Stack, Spacer } from '@chakra-ui/react'
import { usePortfolio } from '../../hooks/Portfolio'

const Portfolio: FunctionComponent = () => {
  const { total, stake, sale } = usePortfolio()

  return (
    <>
      <Text fontSize="2xl">Portfolio</Text>
      <Spacer />
      <Stack spacing={10} direction="row">
        <Stat>
          <StatLabel>Total</StatLabel>
          <StatNumber>{total} MTE</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Stake</StatLabel>
          <StatNumber>{stake} MTE</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Sale</StatLabel>
          <StatNumber>{sale} MTE</StatNumber>
        </Stat>
      </Stack>
      <Box textAlign="center">
        <Button verticalAlign="bottom" onClick={() => alert('withdraw is clicked!')}>
          With Draw
        </Button>
      </Box>
    </>
  )
}

export { Portfolio }
