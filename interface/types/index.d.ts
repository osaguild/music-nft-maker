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
