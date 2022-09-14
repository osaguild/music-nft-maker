import { BigNumber } from 'ethers'

type Balance = {
  alice: number
  bob: number
  protocol: number
  stakingOfAlice: number
  stakingOfBob: number
}

type RoyaltyInfo = {
  receiver: string
  fraction: number
}

type Address = {
  name: string
  address: string
}

const calcReward = (numerator: number, denominator = 10000, amount: number, blockDiff: number) =>
  (amount * blockDiff * numerator) / denominator

const printBalance = (balance: Balance) => {
  console.log(
    'alice:',
    balance.alice,
    'bob:',
    balance.bob,
    'protocol:',
    balance.protocol,
    'stakingOfAlice:',
    balance.stakingOfAlice,
    'stakingOfBob:',
    balance.stakingOfBob
  )
}

const calcRoyalty = (info: RoyaltyInfo, salePrice: number) => {
  const _royalty = (salePrice * info.fraction) / 10000
  return BigNumber.from(_royalty)
}

const printRoyalty = (
  addresses: Address[],
  receivers: string[],
  amounts: BigNumber[],
  tokenId: number,
  price: number
) => {
  let message = `tokenId: ${tokenId} price: ${price} `
  for (let i = 0; i < addresses.length; i++) {
    if (receivers.length == 0) {
      message += `${addresses[i]?.name}: 0 `
    } else {
      for (let j = 0; j < receivers.length; j++) {
        if (addresses[i]?.address === receivers[j]) {
          message += `${addresses[i]?.name}: ${amounts[j]?.toNumber()} `
          break
        } else if (j === receivers.length - 1) {
          message += `${addresses[i]?.name}: 0 `
        }
      }
    }
  }
  console.log(message)
}

export { calcReward, printBalance, calcRoyalty, printRoyalty, Balance, RoyaltyInfo, Address }
