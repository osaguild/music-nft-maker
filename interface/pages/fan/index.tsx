import { FunctionComponent } from 'react'
import { providers } from 'ethers'
import { Web3ReactProvider } from '@web3-react/core'
import { ChakraProvider } from '@chakra-ui/react'
import { AlertContext, useAlertProvider } from '../../hooks/AlertContext'
import { Layout } from '../../components/Layout'

const Fan: FunctionComponent = () => {
  const getLibrary = (provider: providers.ExternalProvider | providers.JsonRpcFetchFunc) => {
    const library = new providers.Web3Provider(provider)
    library.pollingInterval = 12000
    return library
  }

  return (
    <ChakraProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <AlertContext.Provider value={useAlertProvider()}>
          <Layout pattern="FAN" />
        </AlertContext.Provider>
      </Web3ReactProvider>
    </ChakraProvider>
  )
}

export default Fan
