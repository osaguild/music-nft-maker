import { ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import {
  FanficToken__factory,
  Market__factory,
  MteToken__factory,
  OriginToken__factory,
  Protocol__factory,
} from '../typechain-types'
import { address, uri } from '../utils'

async function main() {
  // account check
  const sub_1 = (await ethers.getSigners())[0] as SignerWithAddress
  const sub_2 = (await ethers.getSigners())[1] as SignerWithAddress
  const sub_3 = (await ethers.getSigners())[2] as SignerWithAddress
  const sub_4 = (await ethers.getSigners())[3] as SignerWithAddress
  console.log('sub_1 balance:', ethers.utils.formatEther(await sub_1.getBalance()), 'ETH')
  console.log('sub_2 balance:', ethers.utils.formatEther(await sub_2.getBalance()), 'ETH')
  console.log('sub_3 balance:', ethers.utils.formatEther(await sub_3.getBalance()), 'ETH')
  console.log('sub_4 balance:', ethers.utils.formatEther(await sub_4.getBalance()), 'ETH')

  // 1.transfer MTE
  console.log('1.transfer MTE start')

  await Protocol__factory.connect(address.PROTOCOL_CONTRACT, sub_1).provideLiquidity(
    address.SUB_1_ACCOUNT,
    0,
    ethers.utils.parseEther('100')
  )
  console.log('complete to transfer 100 MTE to sub_1')

  await Protocol__factory.connect(address.PROTOCOL_CONTRACT, sub_1).provideLiquidity(
    address.SUB_2_ACCOUNT,
    0,
    ethers.utils.parseEther('100')
  )
  console.log('complete to transfer 100 MTE to sub_2')

  await Protocol__factory.connect(address.PROTOCOL_CONTRACT, sub_1).provideLiquidity(
    address.SUB_3_ACCOUNT,
    0,
    ethers.utils.parseEther('100')
  )
  console.log('complete to transfer 100 MTE to sub_3')

  await Protocol__factory.connect(address.PROTOCOL_CONTRACT, sub_1).provideLiquidity(
    address.SUB_4_ACCOUNT,
    0,
    ethers.utils.parseEther('100')
  )
  console.log('complete to transfer 100 MTE to sub_4')

  // 2.staking
  console.log('2.staking start')

  await MteToken__factory.connect(address.MTE_CONTRACT, sub_1).approve(
    address.PROTOCOL_CONTRACT,
    ethers.utils.parseEther('100')
  )
  await Protocol__factory.connect(address.PROTOCOL_CONTRACT, sub_1).stake(ethers.utils.parseEther('100'))
  console.log('complete to stake 100 MTE from sub_1')

  await MteToken__factory.connect(address.MTE_CONTRACT, sub_2).approve(
    address.PROTOCOL_CONTRACT,
    ethers.utils.parseEther('100')
  )
  await Protocol__factory.connect(address.PROTOCOL_CONTRACT, sub_2).stake(ethers.utils.parseEther('100'))
  console.log('complete to stake 100 MTE from sub_2')

  await MteToken__factory.connect(address.MTE_CONTRACT, sub_2).approve(
    address.PROTOCOL_CONTRACT,
    ethers.utils.parseEther('100')
  )
  await Protocol__factory.connect(address.PROTOCOL_CONTRACT, sub_3).stake(ethers.utils.parseEther('100'))
  console.log('complete to stake 100 MTE from sub_3')

  await MteToken__factory.connect(address.MTE_CONTRACT, sub_4).approve(
    address.PROTOCOL_CONTRACT,
    ethers.utils.parseEther('100')
  )
  await Protocol__factory.connect(address.PROTOCOL_CONTRACT, sub_4).stake(ethers.utils.parseEther('100'))
  console.log('complete to stake 100 MTE from sub_4')

  // 3.create origin token
  console.log('3.create origin token')

  await OriginToken__factory.connect(address.ORIGIN_CONTRACT, sub_1).mint(uri.ORIGIN_URI)
  console.log('complete to mint origin token, token id is 1')

  await OriginToken__factory.connect(address.ORIGIN_CONTRACT, sub_2).mint(uri.ORIGIN_URI)
  console.log('complete to mint origin token, token id is 2')

  await OriginToken__factory.connect(address.ORIGIN_CONTRACT, sub_3).mint(uri.ORIGIN_URI)
  console.log('complete to mint origin token, token id is 3')

  await OriginToken__factory.connect(address.ORIGIN_CONTRACT, sub_4).mint(uri.ORIGIN_URI)
  console.log('complete to mint origin token, token id is 4')

  // 4.create fanfic
  console.log('4.create fanfic token')

  await FanficToken__factory.connect(address.FANFIC_CONTRACT, sub_1).mint(uri.FANFIC_URI, [2, 3, 4])
  console.log('complete to mint fanfic token, token id is 1 / origin ids are 2, 3 and 4')

  await FanficToken__factory.connect(address.FANFIC_CONTRACT, sub_2).mint(uri.FANFIC_URI, [1])
  console.log('complete to mint fanfic token, token id is 2 / origin ids are 1')

  // 5.start sale
  console.log('5.start sale')

  await FanficToken__factory.connect(address.FANFIC_CONTRACT, sub_1).approve(address.MARKET_CONTRACT, 1)
  await Market__factory.connect(address.MARKET_CONTRACT, sub_1).startSale(1, ethers.utils.parseEther('0.01'))
  console.log('complete to start sale of fanfic id 1')

  await FanficToken__factory.connect(address.FANFIC_CONTRACT, sub_2).approve(address.MARKET_CONTRACT, 2)
  await Market__factory.connect(address.MARKET_CONTRACT, sub_2).startSale(2, ethers.utils.parseEther('0.02'))
  console.log('complete to start sale of fanfic id 2')

  // 6.purchase
  console.log('6.purchase')

  await Market__factory.connect(address.MARKET_CONTRACT, sub_3).purchase(1, { value: ethers.utils.parseEther('0.01') })
  console.log('complete to purchase of fanfic id 1')

  await Market__factory.connect(address.MARKET_CONTRACT, sub_4).purchase(2, { value: ethers.utils.parseEther('0.02') })
  console.log('complete to purchase of fanfic id 2')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
