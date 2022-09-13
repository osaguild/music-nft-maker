type Balance = {
  alice: number
  bob: number
  protocol: number
  stakingOfAlice: number
  stakingOfBob: number
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

export { calcReward, printBalance, Balance }
