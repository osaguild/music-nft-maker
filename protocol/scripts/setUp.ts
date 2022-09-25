import { ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { FanficToken__factory, Market__factory, OriginToken__factory, Protocol__factory } from '../typechain-types'
import { address } from '../utils'

async function main() {
  // account check
  const sub_1 = (await ethers.getSigners())[0] as SignerWithAddress
  console.log('sub_1 balance:', ethers.utils.formatEther(await sub_1.getBalance()), 'ETH')

  // set up FanficToken
  await FanficToken__factory.connect(address.FANFIC_CONTRACT, sub_1).setOriginToken(address.ORIGIN_CONTRACT)
  console.log('FanficToken.setOriginToken:', address.ORIGIN_CONTRACT)
  await FanficToken__factory.connect(address.FANFIC_CONTRACT, sub_1).setProtocol(address.PROTOCOL_CONTRACT)
  console.log('FanficToken.setProtocol:', address.PROTOCOL_CONTRACT)
  //await FanficToken__factory.connect(address.FANFIC_CONTRACT, sub_1).setDefaultRoyalty(address.SUB_4_ACCOUNT, 1000)
  //console.log('FanficToken.setDefaultRoyalty:', address.SUB_4_ACCOUNT, 1000)

  // set up Market
  await Market__factory.connect(address.MARKET_CONTRACT, sub_1).setFanficToken(address.FANFIC_CONTRACT)
  console.log('Market.setFanficToken:', address.FANFIC_CONTRACT)
  await Market__factory.connect(address.MARKET_CONTRACT, sub_1).setProtocol(address.PROTOCOL_CONTRACT)
  console.log('Market.setProtocol:', address.PROTOCOL_CONTRACT)

  // set up OriginToken
  await OriginToken__factory.connect(address.ORIGIN_CONTRACT, sub_1).setProtocol(address.PROTOCOL_CONTRACT)
  console.log('OriginToken.setProtocol:', address.PROTOCOL_CONTRACT)

  // set up Protocol
  await Protocol__factory.connect(address.PROTOCOL_CONTRACT, sub_1).setMteToken(address.MTE_CONTRACT)
  console.log('Protocol.setMteToken:', address.MTE_CONTRACT)
  await Protocol__factory.connect(address.PROTOCOL_CONTRACT, sub_1).setStakingToken(address.STAKING_CONTRACT)
  console.log('Protocol.setStakingToken:', address.STAKING_CONTRACT)
  await Protocol__factory.connect(address.PROTOCOL_CONTRACT, sub_1).setFanficToken(address.FANFIC_CONTRACT)
  console.log('Protocol.setFanficToken:', address.FANFIC_CONTRACT)
  await Protocol__factory.connect(address.PROTOCOL_CONTRACT, sub_1).setMarket(address.MARKET_CONTRACT)
  console.log('Protocol.setMarket:', address.MARKET_CONTRACT)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
