import { ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { FanficToken__factory, Market__factory, OriginToken__factory, Protocol__factory } from '../typechain-types'

async function main() {
  // accounts
  const defaultReceiver = '0x0f16af1BdFeA64f8B8733603D346479f5B2c7DF5' // sub_4
  // contracts
  const protocolAddress = '0x49273516c29a92Ba7152b0BD934091c838c71F7C'
  const stakingAddress = '0xA4F19B9955b797f412dcE952C36AE4E9959414a2'
  const mteAddress = '0xB034fE8111Bf487422961C8083cA7cd3eACd8986'
  const fanficAddress = '0x94798Ac04e9A0694D3D352Ee711B00b99dDbE0eF'
  const originAddress = '0xb9e51c795b03C840ABB2344e16866BAba09dADDD'
  const marketAddress = '0x28e2362AA5091Db22BB483dC4420A31718135216'

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
  const staking = await stakingFactory.deploy(protocolAddress)
  console.log('Staking address:', staking.address)

  // deploy MteToken !! need protocol address !!
  const mteFactory = await ethers.getContractFactory('MteToken')
  const mte = await mteFactory.deploy(protocolAddress)
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
