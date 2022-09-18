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

interface OriginToken extends Erc721 {
  id: number
  uri: string
  owner: string
}

interface FanficToken extends Erc721 {
  id: number
  uri: string
  owner: string
  originIds: number[]
  saleInfo: SaleInfo[]
}

type SaleInfo = {
  id: number
  buyer: string
  startBlockNumber: number
  endBlockNumber: number
  isSold: bool
}
