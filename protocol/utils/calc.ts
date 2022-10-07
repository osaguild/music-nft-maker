import { BigNumber } from 'ethers'
import { RoyaltyInfo } from './type'

const calcReward = (numerator: number, denominator = 10000, amount: number, blockDiff: number) =>
  (amount * blockDiff * numerator) / denominator

const calcRoyalty = (info: RoyaltyInfo, salePrice: BigNumber) => salePrice.mul(info.fraction).div(10000)

export { calcReward, calcRoyalty }
