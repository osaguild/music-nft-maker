import { FunctionComponent } from 'react'
import { Stat, StatLabel, StatNumber, Stack } from '@chakra-ui/react'
import { useKpi } from '../../hooks/Kpi'

const Kpi: FunctionComponent = () => {
  const { stakerCount, stakingAmount, fanficCount, originCount } = useKpi()

  return (
    <>
      <Stack spacing={10} direction="row">
        <Stat>
          <StatLabel>Staker</StatLabel>
          <StatNumber>{stakerCount}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Total Staking Amounts</StatLabel>
          <StatNumber>{stakingAmount} MTE</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Secondary Music NFT</StatLabel>
          <StatNumber>{fanficCount}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Original Music NFT</StatLabel>
          <StatNumber>{originCount}</StatNumber>
        </Stat>
      </Stack>
    </>
  )
}

export { Kpi }
