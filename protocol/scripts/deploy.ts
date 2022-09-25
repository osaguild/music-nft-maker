import { ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

async function main() {
  // account check
  const sub_1 = (await ethers.getSigners())[0] as SignerWithAddress
  console.log('sub_1 balance:', ethers.utils.formatEther(await sub_1.getBalance()), 'ETH')

  // deploy Protocol
  const protocolFactory = await ethers.getContractFactory('Protocol')
  const protocol = await protocolFactory.deploy(sub_1.address, 1) // 0.01%/block means 3156.6 APY
  console.log('Protocol address:', protocol.address)

  // deploy StakingToken !! need protocol address !!
  const stakingFactory = await ethers.getContractFactory('StakingToken')
  const staking = await stakingFactory.deploy(protocol.address)
  console.log('Staking address:', staking.address)

  // deploy MteToken !! need protocol address !!
  const mteFactory = await ethers.getContractFactory('MteToken')
  const mte = await mteFactory.deploy(protocol.address)
  console.log('MteToken address:', mte.address)

  // deploy FanficToken
  const fanficFactory = await ethers.getContractFactory('FanficToken')
  const fanfic = await fanficFactory.deploy(sub_1.address)
  console.log('FanficToken address:', fanfic.address)

  // deploy OriginToken
  const originFactory = await ethers.getContractFactory('OriginToken')
  const origin = await originFactory.deploy(sub_1.address)
  console.log('Origin address:', origin.address)

  // deploy Market
  const marketFactory = await ethers.getContractFactory('Market')
  const market = await marketFactory.deploy(sub_1.address)
  console.log('Market address:', market.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
