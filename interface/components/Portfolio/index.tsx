import { FunctionComponent } from 'react'
import { Box, Button, Text, Stat, StatLabel, StatNumber, Stack, Spacer } from '@chakra-ui/react'
import { usePortfolio } from '../../hooks/Portfolio'

const Portfolio: FunctionComponent = () => {
  const { total, own, staking, reward } = usePortfolio()

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
          <StatLabel>Own</StatLabel>
          <StatNumber>{own} MTE</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Staking</StatLabel>
          <StatNumber>{staking} MTE</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Reward</StatLabel>
          <StatNumber>{reward} MTE</StatNumber>
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
