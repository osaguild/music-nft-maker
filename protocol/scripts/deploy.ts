import { ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { FanficToken__factory, Market__factory, OriginToken__factory, Protocol__factory } from '../typechain-types'
import { address } from './config'

async function main() {
  // account check
  const deployer = (await ethers.getSigners())[0] as SignerWithAddress
  const balance = (await deployer.getBalance()).toString()
  console.log('deploying contract with the account:', deployer.address)
  console.log('account balance:', balance)

  // deploy Protocol
  const protocolFactory = await ethers.getContractFactory('Protocol')
  const protocol = await protocolFactory.deploy(deployer.address, 2000) // APY is 20%
  console.log('Protocol address:', protocol.address)

  // deploy StakingToken !! need protocol address !!
  const stakingFactory = await ethers.getContractFactory('StakingToken')
  const staking = await stakingFactory.deploy(address.PROTOCOL_CONTRACT)
  console.log('Staking address:', staking.address)

  // deploy MteToken !! need protocol address !!
  const mteFactory = await ethers.getContractFactory('MteToken')
  const mte = await mteFactory.deploy(address.PROTOCOL_CONTRACT)
  console.log('MteToken address:', mte.address)

  // deploy FanficToken
  const fanficFactory = await ethers.getContractFactory('FanficToken')
  const fanfic = await fanficFactory.deploy(deployer.address)
  console.log('FanficToken address:', fanfic.address)

  // deploy OriginToken
  const originFactory = await ethers.getContractFactory('OriginToken')
  const origin = await originFactory.deploy(deployer.address)
  console.log('Origin address:', origin.address)

  // deploy Market
  const marketFactory = await ethers.getContractFactory('Market')
  const market = await marketFactory.deploy(deployer.address)
  console.log('Market address:', market.address)

  // set up FanficToken
  await FanficToken__factory.connect(address.FANFIC_CONTRACT, deployer).setOriginToken(address.ORIGIN_CONTRACT)
  console.log('FanficToken.setOriginToken:', address.ORIGIN_CONTRACT)
  await FanficToken__factory.connect(address.FANFIC_CONTRACT, deployer).setProtocol(address.PROTOCOL_CONTRACT)
  console.log('FanficToken.setProtocol:', address.PROTOCOL_CONTRACT)
  await FanficToken__factory.connect(address.FANFIC_CONTRACT, deployer).setDefaultRoyalty(address.SUB_4_ACCOUNT, 1000)
  console.log('FanficToken.setDefaultRoyalty:', address.SUB_4_ACCOUNT, 1000)

  // set up Market
  await Market__factory.connect(address.MARKET_CONTRACT, deployer).setFanficToken(address.FANFIC_CONTRACT)
  console.log('Market.setFanficToken:', address.FANFIC_CONTRACT)

  // set up OriginToken
  await OriginToken__factory.connect(address.ORIGIN_CONTRACT, deployer).setProtocol(address.PROTOCOL_CONTRACT)
  console.log('OriginToken.setProtocol:', address.PROTOCOL_CONTRACT)

  // set up Protocol
  await Protocol__factory.connect(address.PROTOCOL_CONTRACT, deployer).setMteToken(address.MTE_CONTRACT)
  console.log('Protocol.setMteToken:', address.MTE_CONTRACT)
  await Protocol__factory.connect(address.PROTOCOL_CONTRACT, deployer).setStakingToken(address.STAKING_CONTRACT)
  console.log('Protocol.setStakingToken:', address.STAKING_CONTRACT)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
