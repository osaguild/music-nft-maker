import { FunctionComponent } from 'react'
import { Text, Stat, StatLabel, StatNumber, Stack } from '@chakra-ui/react'
import { usePortfolio } from '../../hooks/Portfolio'

const Portfolio: FunctionComponent = () => {
  const { total, stake, sale } = usePortfolio()

  return (
    <>
      <Text fontSize="2xl" my="30">
        Portfolio
      </Text>
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
    </>
  )
}

export { Portfolio }
