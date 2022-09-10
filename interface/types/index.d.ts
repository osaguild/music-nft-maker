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

interface Nft {
  id: number
  url: string
  author: string
  owner: string
  value: number
  onSale: boolean
}

interface OriginNft extends Nft {
  id: number
  url: string
  author: string
  owner: string
  value: number
  onSale: boolean
}

interface FanficNft extends Nft {
  id: number
  url: string
  author: string
  owner: string
  value: number
  onSale: boolean
  originIds: string[]
}
