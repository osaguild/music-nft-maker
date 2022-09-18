import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { providers } from 'ethers'
import {
  Protocol,
  Protocol__factory,
  MteToken,
  MteToken__factory,
  OriginToken__factory,
  OriginToken,
  FanficToken__factory,
  FanficToken,
} from '../../typechain-types'
import { address } from '../../config/address'

const useContract = () => {
  const [protocol, setProtocol] = useState<Protocol>()
  const [mteToken, setMteToken] = useState<MteToken>()
  const [originToken, setOriginToken] = useState<OriginToken>()
  const [fanficToken, setFanficToken] = useState<FanficToken>()
  const { library } = useWeb3React<providers.Web3Provider>()

  useEffect(() => {
    if (library) {
      setProtocol(Protocol__factory.connect(address.PROTOCOL_CONTRACT, library.getSigner()))
      setMteToken(MteToken__factory.connect(address.MTE_CONTRACT, library.getSigner()))
      setOriginToken(OriginToken__factory.connect(address.ORIGIN_CONTRACT, library.getSigner()))
      setFanficToken(FanficToken__factory.connect(address.FANFIC_CONTRACT, library.getSigner()))
    }
  }, [library])

  return { protocol, mteToken, originToken, fanficToken }
}

export { useContract }
