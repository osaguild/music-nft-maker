const networks = [{ chainId: 5, name: 'Goerli', icon: '/assets/eth-diamond-black-white.jpeg' }]

const protocol = () => {
  if (process.env.NEXT_PUBLIC_PROTOCOL_CONTRACT === undefined)
    throw new Error('NEXT_PUBLIC_PROTOCOL_CONTRACT is undefined.')
  else return process.env.NEXT_PUBLIC_PROTOCOL_CONTRACT
}
const staking = () => {
  if (process.env.NEXT_PUBLIC_STAKING_CONTRACT === undefined)
    throw new Error('NEXT_PUBLIC_STAKING_CONTRACT is undefined.')
  else return process.env.NEXT_PUBLIC_STAKING_CONTRACT
}
const mte = () => {
  if (process.env.NEXT_PUBLIC_MTE_CONTRACT === undefined) throw new Error('NEXT_PUBLIC_MTE_CONTRACT is undefined.')
  else return process.env.NEXT_PUBLIC_MTE_CONTRACT
}
const fanfic = () => {
  if (process.env.NEXT_PUBLIC_FANFIC_CONTRACT === undefined)
    throw new Error('NEXT_PUBLIC_FANFIC_CONTRACT is undefined.')
  else return process.env.NEXT_PUBLIC_FANFIC_CONTRACT
}
const origin = () => {
  if (process.env.NEXT_PUBLIC_ORIGIN_CONTRACT === undefined)
    throw new Error('NEXT_PUBLIC_ORIGIN_CONTRACT is undefined.')
  else return process.env.NEXT_PUBLIC_ORIGIN_CONTRACT
}
const market = () => {
  if (process.env.NEXT_PUBLIC_MARKET_CONTRACT === undefined)
    throw new Error('NEXT_PUBLIC_MARKET_CONTRACT is undefined.')
  else return process.env.NEXT_PUBLIC_MARKET_CONTRACT
}

const pinata = () => {
  if (process.env.NEXT_PUBLIC_PINATA_API_JWT === undefined) throw new Error('NEXT_PUBLIC_PINATA_API_JWT is undefined.')
  else return process.env.NEXT_PUBLIC_PINATA_API_JWT
}

const address: Address = {
  PROTOCOL_CONTRACT: protocol(),
  STAKING_CONTRACT: staking(),
  MTE_CONTRACT: mte(),
  FANFIC_CONTRACT: fanfic(),
  ORIGIN_CONTRACT: origin(),
  MARKET_CONTRACT: market(),
}

const apiKey: ApiKey = {
  PINATA_API_JWT: pinata(),
}

export { address, networks, apiKey }
