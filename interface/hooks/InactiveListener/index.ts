import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { injected } from '../../lib/connectors'

const useInactiveListener = (suppress: boolean) => {
  const { active, error, activate } = useWeb3React()

  useEffect(() => {
    const { ethereum } = window
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        console.error('handleConnect is called')
        activate(injected)
      }
      const handleChainChanged = (chainId: string | number) => {
        console.error('handleChainChanged is called. chainId:', chainId)
        activate(injected)
      }
      const handleAccountsChanged = (accounts: string[]) => {
        console.error('handleAccountsChanged is called. accounts:', accounts)
        if (accounts.length > 0) activate(injected)
      }
      const handleNetworkChanged = (networkId: string | number) => {
        console.error('handleNetworkChanged is called. networkId:', networkId)
        activate(injected)
      }

      ethereum.on('connect', handleConnect)
      ethereum.on('chainChanged', handleChainChanged)
      ethereum.on('accountsChanged', handleAccountsChanged)
      ethereum.on('networkChanged', handleNetworkChanged)

      if (ethereum.removeListener) {
        ethereum.removeListener('connect', handleConnect)
        ethereum.removeListener('chainChanged', handleChainChanged)
        ethereum.removeListener('accountsChanged', handleAccountsChanged)
        ethereum.removeListener('networkChanged', handleNetworkChanged)
      }
    }
  }, [active, error, suppress, activate])
}

export { useInactiveListener }
