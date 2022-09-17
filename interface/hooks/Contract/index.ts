import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { providers } from 'ethers'
import { Protocol, Protocol__factory, MteToken, MteToken__factory } from '../../typechain-types'
import { address } from '../../config/address'

const useContract = () => {
  const [protocol, setProtocol] = useState<Protocol>()
  const [mteToken, setMteToken] = useState<MteToken>()
  const { library } = useWeb3React<providers.Web3Provider>()

  useEffect(() => {
    if (library) {
      setProtocol(Protocol__factory.connect(address.PROTOCOL_CONTRACT, library.getSigner()))
      setMteToken(MteToken__factory.connect(address.MTE_CONTRACT, library.getSigner()))
    }
  }, [library])

  return { protocol, mteToken }
}

export { useContract }
