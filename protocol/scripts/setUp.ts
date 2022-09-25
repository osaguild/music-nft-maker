import { ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { FanficToken__factory, Market__factory, OriginToken__factory, Protocol__factory } from '../typechain-types'
import { address } from '../utils'

async function main() {
  // account check
  const deployer = (await ethers.getSigners())[0] as SignerWithAddress
  const balance = (await deployer.getBalance()).toString()
  console.log('deploying contract with the account:', deployer.address)
  console.log('account balance:', balance)

  // set up FanficToken
  await FanficToken__factory.connect(address.FANFIC_CONTRACT, deployer).setOriginToken(address.ORIGIN_CONTRACT)
  console.log('FanficToken.setOriginToken:', address.ORIGIN_CONTRACT)
  await FanficToken__factory.connect(address.FANFIC_CONTRACT, deployer).setProtocol(address.PROTOCOL_CONTRACT)
  console.log('FanficToken.setProtocol:', address.PROTOCOL_CONTRACT)
  //await FanficToken__factory.connect(address.FANFIC_CONTRACT, deployer).setDefaultRoyalty(address.SUB_4_ACCOUNT, 1000)
  //console.log('FanficToken.setDefaultRoyalty:', address.SUB_4_ACCOUNT, 1000)

  // set up Market
  await Market__factory.connect(address.MARKET_CONTRACT, deployer).setFanficToken(address.FANFIC_CONTRACT)
  console.log('Market.setFanficToken:', address.FANFIC_CONTRACT)
  await Market__factory.connect(address.MARKET_CONTRACT, deployer).setProtocol(address.PROTOCOL_CONTRACT)
  console.log('Market.setProtocol:', address.PROTOCOL_CONTRACT)

  // set up OriginToken
  await OriginToken__factory.connect(address.ORIGIN_CONTRACT, deployer).setProtocol(address.PROTOCOL_CONTRACT)
  console.log('OriginToken.setProtocol:', address.PROTOCOL_CONTRACT)

  // set up Protocol
  await Protocol__factory.connect(address.PROTOCOL_CONTRACT, deployer).setMteToken(address.MTE_CONTRACT)
  console.log('Protocol.setMteToken:', address.MTE_CONTRACT)
  await Protocol__factory.connect(address.PROTOCOL_CONTRACT, deployer).setStakingToken(address.STAKING_CONTRACT)
  console.log('Protocol.setStakingToken:', address.STAKING_CONTRACT)
  await Protocol__factory.connect(address.PROTOCOL_CONTRACT, deployer).setFanficToken(address.FANFIC_CONTRACT)
  console.log('Protocol.setFanficToken:', address.FANFIC_CONTRACT)
  await Protocol__factory.connect(address.PROTOCOL_CONTRACT, deployer).setMarket(address.MARKET_CONTRACT)
  console.log('Protocol.setMarket:', address.MARKET_CONTRACT)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
