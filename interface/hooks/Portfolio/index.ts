import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useContract } from '../Contract'
import { ethers } from 'ethers'

const usePortfolio = () => {
  const [total, setTotal] = useState<number>()
  const [own, setOwn] = useState<number>()
  const [staking, setStaking] = useState<number>()
  const [reward, setReward] = useState<number>()
  const { account } = useWeb3React()
  const { protocol, mteToken } = useContract()

  useEffect(() => {
    if (protocol && mteToken && account) {
      Promise.all([
        protocol.balanceOfStaking(account),
        protocol.balanceOfReward(account),
        mteToken.balanceOf(account),
      ]).then(([staking, reward, own]) => {
        console.log('Promise.all:', staking, reward, own)
        setStaking(Number(ethers.utils.formatEther(staking)))
        setReward(Number(ethers.utils.formatEther(reward)))
        setOwn(Number(ethers.utils.formatEther(own)))
        setTotal(Number(ethers.utils.formatEther(staking.add(reward).add(own))))
      })
    }
  }, [protocol, mteToken, account])

  return { total, own, staking, reward }
}

export { usePortfolio }
