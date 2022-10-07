import { BigNumber } from 'ethers'
import { RoyaltyInfo } from './type'

const calcReward = (numerator: number, denominator = 10000, amount: BigNumber, blockDiff: number) =>
  amount.mul(blockDiff).mul(numerator).div(denominator)

const calcRoyalty = (info: RoyaltyInfo, salePrice: BigNumber) => salePrice.mul(info.fraction).div(10000)

export { calcReward, calcRoyalty }
