import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { providers } from 'ethers'
import { Protocol, Protocol__factory } from '../../typechain-types'
import { address } from '../../config'

const useProtocol = () => {
  const [protocol, setProtocol] = useState<Protocol>()
  const { library } = useWeb3React<providers.Web3Provider>()

  useEffect(() => {
    if (library) {
      setProtocol(Protocol__factory.connect(address().PROTOCOL_CONTRACT, library.getSigner()))
    }
  }, [library])

  return protocol
}

export { useProtocol }
