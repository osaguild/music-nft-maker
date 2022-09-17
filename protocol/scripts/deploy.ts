import { ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { FanficToken__factory, Market__factory, OriginToken__factory, Protocol__factory } from '../typechain-types'

async function main() {
  // accounts
  const defaultReceiver = '0x0f16af1BdFeA64f8B8733603D346479f5B2c7DF5' // sub_4
  // contracts
  const fanficAddress = '0x10536c868b366484B3ef2b9b13Ce8f186f6aa0FA'
  const marketAddress = '0xFBF76141dD7ce0941F496fF44f7d44C23A23631F'
  const mteAddress = '0x5752814c4654170769FdFCa15003477771547C28'
  const originAddress = '0x2BfD1139c3F1aa3BEF838639Bf1Cb2d9E83bd509'
  const protocolAddress = '0x4d36c54f8B1AEFb8e79905E8D38260f46a146C96'
  const stakingAddress = '0xe2001e1e5FeE006323D75F91aFD57C34af4bCb4B'

  // account check
  const deployer = (await ethers.getSigners())[0] as SignerWithAddress
  const balance = (await deployer.getBalance()).toString()
  console.log('deploying contract with the account:', deployer.address)
  console.log('account balance:', balance)

  // deploy FanficToken
  const fanficFactory = await ethers.getContractFactory('FanficToken')
  const fanfic = await fanficFactory.deploy(deployer.address)
  console.log('FanficToken address:', fanfic.address)

  // deploy Market
  const marketFactory = await ethers.getContractFactory('Market')
  const market = await marketFactory.deploy(deployer.address)
  console.log('Market address:', market.address)

  // deploy MteToken
  const mteFactory = await ethers.getContractFactory('MteToken')
  const mte = await mteFactory.deploy(deployer.address)
  console.log('MteToken address:', mte.address)

  // deploy OriginToken
  const originFactory = await ethers.getContractFactory('OriginToken')
  const origin = await originFactory.deploy(deployer.address)
  console.log('Origin address:', origin.address)

  // deploy Protocol
  const protocolFactory = await ethers.getContractFactory('Protocol')
  const protocol = await protocolFactory.deploy(deployer.address, 2000) // APY is 20%
  console.log('Protocol address:', protocol.address)

  // deploy StakingToken
  const stakingFactory = await ethers.getContractFactory('StakingToken')
  const staking = await stakingFactory.deploy(deployer.address)
  console.log('Staking address:', staking.address)

  // set up FanficToken
  await FanficToken__factory.connect(fanficAddress, deployer).setOriginToken(originAddress)
  console.log('FanficToken.setOriginToken:', originAddress)
  await FanficToken__factory.connect(fanficAddress, deployer).setProtocol(protocolAddress)
  console.log('FanficToken.setProtocol:', protocolAddress)
  await FanficToken__factory.connect(fanficAddress, deployer).setDefaultRoyalty(defaultReceiver, 1000)
  console.log('FanficToken.setDefaultRoyalty:', defaultReceiver, 1000)

  // set up Market
  await Market__factory.connect(marketAddress, deployer).setFanficToken(fanficAddress)
  console.log('Market.setFanficToken:', fanficAddress)

  // set up OriginToken
  await OriginToken__factory.connect(originAddress, deployer).setProtocol(protocolAddress)
  console.log('OriginToken.setProtocol:', protocolAddress)

  // set up Protocol
  await Protocol__factory.connect(protocolAddress, deployer).setMteToken(mteAddress)
  console.log('Protocol.setMteToken:', mteAddress)
  await Protocol__factory.connect(protocolAddress, deployer).setStakingToken(stakingAddress)
  console.log('Protocol.setStakingToken:', stakingAddress)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
