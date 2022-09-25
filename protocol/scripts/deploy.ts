import { ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

async function main() {
  // account check
  const deployer = (await ethers.getSigners())[0] as SignerWithAddress
  const balance = (await deployer.getBalance()).toString()
  console.log('deploying contract with the account:', deployer.address)
  console.log('account balance:', balance)

  // deploy Protocol
  const protocolFactory = await ethers.getContractFactory('Protocol')
  const protocol = await protocolFactory.deploy(deployer.address, 1) // 0.01%/block means 3156.6 APY
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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
