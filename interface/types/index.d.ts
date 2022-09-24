interface Window {
  ethereum: any
}

type Network = {
  chainId: number
  name: string
  icon: string
}

type Alert = {
  message: string
  status: AlertStatus
}

type AlertStatus = 'success' | 'error' | 'info' | 'warning'

interface Erc721 {
  id: number
  uri: string
  owner: string
}

interface Origin extends Erc721 {
  id: number
  uri: string
  owner: string
}

interface Fanfic extends Erc721 {
  id: number
  uri: string
  owner: string
  originIds: number[]
}

type Sale = {
  id: number
  price: number
  buyer: string
  startBlockNumber: number
  endBlockNumber: number
  isSold: bool
  fanficToken: Fanfic
}

type Config = {
  PROTOCOL_CONTRACT: string
  STAKING_CONTRACT: string
  MTE_CONTRACT: string
  FANFIC_CONTRACT: string
  ORIGIN_CONTRACT: string
  MARKET_CONTRACT: string
}

type Royalty = {
  receiver: string
  value: number
}
