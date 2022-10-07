import { BigNumber } from 'ethers'

type Balance = {
  alice: BigNumber
  bob: BigNumber
  protocol: BigNumber
  stakingOfAlice: BigNumber
  stakingOfBob: BigNumber
}

type RoyaltyInfo = {
  receiver: string
  fraction: number
}

type Address = {
  name: string
  address: string
}

type StakingInfo = {
  startBlock: number
  endBlock: number
  price: BigNumber
}

type SaleInfo = {
  tokenId: number
  price: BigNumber
  buyer: string
  startBlock: number
  endBlock: number
  sold: boolean
}

export { Balance, RoyaltyInfo, Address, StakingInfo, SaleInfo }
