import type { AppProps } from 'next/app'
import { Web3ReactProvider } from '@web3-react/core'
import { ChakraProvider } from '@chakra-ui/react'
import { providers } from 'ethers'
import theme from '../theme'
import '../styles/globals.css'
import { AlertContext, useAlertProvider } from '../hooks/AlertContext'

function MyApp({ Component, pageProps }: AppProps) {
  const getLibrary = (provider: providers.ExternalProvider | providers.JsonRpcFetchFunc) => {
    const library = new providers.Web3Provider(provider)
    library.pollingInterval = 12000
    return library
  }

  return (
    <ChakraProvider theme={theme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <AlertContext.Provider value={useAlertProvider()}>
          <Component {...pageProps} />
        </AlertContext.Provider>
      </Web3ReactProvider>
    </ChakraProvider>
  )
}

export default MyApp
