import { BigNumber, utils } from 'ethers'

const convertToShortAddress = (address: string) => {
  return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`
}

const convertToShortEth = (wei: BigNumber) => {
  return utils.formatEther(wei).slice(0, 5)
}

export { convertToShortAddress, convertToShortEth }
