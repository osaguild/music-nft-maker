const networks: Network[] = [{ chainId: 5, name: 'Goerli', icon: '/assets/eth-diamond-black-white.jpeg' }]

const address = (): Config => {
  const protocol = (): string => {
    if (process.env.NEXT_PUBLIC_PROTOCOL_CONTRACT === undefined)
      throw new Error('NEXT_PUBLIC_PROTOCOL_CONTRACT is undefined.')
    else return process.env.NEXT_PUBLIC_PROTOCOL_CONTRACT
  }
  const staking = (): string => {
    if (process.env.NEXT_PUBLIC_STAKING_CONTRACT === undefined)
      throw new Error('NEXT_PUBLIC_STAKING_CONTRACT is undefined.')
    else return process.env.NEXT_PUBLIC_STAKING_CONTRACT
  }
  const mte = (): string => {
    if (process.env.NEXT_PUBLIC_MTE_CONTRACT === undefined) throw new Error('NEXT_PUBLIC_MTE_CONTRACT is undefined.')
    else return process.env.NEXT_PUBLIC_MTE_CONTRACT
  }
  const fanfic = (): string => {
    if (process.env.NEXT_PUBLIC_FANFIC_CONTRACT === undefined)
      throw new Error('NEXT_PUBLIC_FANFIC_CONTRACT is undefined.')
    else return process.env.NEXT_PUBLIC_FANFIC_CONTRACT
  }
  const origin = (): string => {
    if (process.env.NEXT_PUBLIC_ORIGIN_CONTRACT === undefined)
      throw new Error('NEXT_PUBLIC_ORIGIN_CONTRACT is undefined.')
    else return process.env.NEXT_PUBLIC_ORIGIN_CONTRACT
  }
  const market = (): string => {
    if (process.env.NEXT_PUBLIC_MARKET_CONTRACT === undefined)
      throw new Error('NEXT_PUBLIC_MARKET_CONTRACT is undefined.')
    else return process.env.NEXT_PUBLIC_MARKET_CONTRACT
  }

  return {
    PROTOCOL_CONTRACT: protocol(),
    STAKING_CONTRACT: staking(),
    MTE_CONTRACT: mte(),
    FANFIC_CONTRACT: fanfic(),
    ORIGIN_CONTRACT: origin(),
    MARKET_CONTRACT: market(),
  }
}

export { address, networks }
