import { BigNumber } from 'ethers'

const calcReward = (numerator: number, denominator = 10000, amount: number, blockDiff: number) =>
  (amount * blockDiff * numerator) / denominator

const calcRoyalty = (info: RoyaltyInfo, salePrice: number) => {
  const _royalty = (salePrice * info.fraction) / 10000
  return BigNumber.from(_royalty)
}

export { calcReward, calcRoyalty }
