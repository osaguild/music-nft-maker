import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { providers } from 'ethers'
import { Message__factory } from '../../typechain-types'
import { address } from '../../config/address'

const useContents = () => {
  const [contents, setContents] = useState<string[]>([])
  const { library } = useWeb3React<providers.Web3Provider>()

  useEffect(() => {
    if (library) {
      const contract = Message__factory.connect(address.MESSAGE_CONTRACT, library.getSigner())
      contract.getMessageLength().then((length) => {
        const ids = [...Array(length.toNumber()).keys()].map((i) => i + 1)
        const promises = ids.map((id) => contract.selectMessage(id))
        Promise.all(promises).then((message) => setContents(message))
      })
    }
  }, [library])

  return contents
}

export { useContents }
