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

type LayoutPattern = 'TOP' | 'MEMBER'

type Role = 'CREATOR' | 'FANFIC' | 'FUN'

interface Nft {
  id: number
  url: string
  author: string
  value: number
  isSale: boolean
}

interface Music extends Nft {
  id: number
  url: string
  author: string
  value: number
  isSale: boolean
}

interface PlayList extends Nft {
  id: number
  url: string
  author: string
  value: number
  isSale: boolean
  musicUrls: string[]
}
