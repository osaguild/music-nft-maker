import { ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import {
  MteToken__factory,
  MteToken,
  Protocol__factory,
  Protocol,
  FanficToken__factory,
  FanficToken,
  OriginToken__factory,
  OriginToken,
  StakingToken__factory,
  StakingToken,
  Market__factory,
  Market,
} from '../typechain-types'
import { address } from '../utils/config'

const checkErc20 = async (mte: MteToken, protocol: Protocol, account: string, name: string) => {
  console.log(
    name,
    'balance:',
    ethers.utils.formatEther(await mte.balanceOf(account)).toString(),
    'MTE / approval:',
    ethers.utils.formatEther(await mte.allowance(account, address.PROTOCOL_CONTRACT)).toString(),
    'MTE / staking:',
    ethers.utils.formatEther(await protocol.balanceOfStaking(account)).toString(),
    'MTE'
  )
}

const checkErc721 = async (
  staking: StakingToken,
  origin: OriginToken,
  fanfic: FanficToken,
  account: string,
  name: string
) => {
  console.log(
    name,
    'StakingToken:',
    (await staking.balanceOf(account)).toString(),
    '/ OriginToken:',
    (await origin.balanceOf(account)).toString(),
    '/ FanficToken:',
    (await fanfic.balanceOf(account)).toString()
  )
}

const checkMarket = async (market: Market, id: number) => {
  const sale = await market.sale(id)
  console.log(
    'saleId',
    id,
    '/ tokenId',
    sale.tokenId.toNumber(),
    '/ price',
    ethers.utils.formatEther(sale.price),
    '/ buyer',
    sale.buyer,
    '/ start',
    sale.startBlockNumber.toString(),
    '/ end',
    sale.endBlockNumber.toString(),
    '/ sold',
    sale.isSold
  )
}

async function main() {
  // set up
  const signer = (await ethers.getSigners())[0] as SignerWithAddress
  const mte = MteToken__factory.connect(address.MTE_CONTRACT, signer)
  const protocol = Protocol__factory.connect(address.PROTOCOL_CONTRACT, signer)
  const staking = StakingToken__factory.connect(address.STAKING_CONTRACT, signer)
  const origin = OriginToken__factory.connect(address.ORIGIN_CONTRACT, signer)
  const fanfic = FanficToken__factory.connect(address.FANFIC_CONTRACT, signer)
  const market = Market__factory.connect(address.MARKET_CONTRACT, signer)
  // ERC20
  console.log('check for ERC20 is starting...')
  await checkErc20(mte, protocol, address.SUB_1_ACCOUNT, 'sub_1')
  await checkErc20(mte, protocol, address.SUB_2_ACCOUNT, 'sub_2')
  await checkErc20(mte, protocol, address.SUB_3_ACCOUNT, 'sub_3')
  await checkErc20(mte, protocol, address.SUB_4_ACCOUNT, 'sub_4')
  // ERC721
  console.log('check for ERC721 is starting...')
  await checkErc721(staking, origin, fanfic, address.SUB_1_ACCOUNT, 'sub_1')
  await checkErc721(staking, origin, fanfic, address.SUB_2_ACCOUNT, 'sub_2')
  await checkErc721(staking, origin, fanfic, address.SUB_3_ACCOUNT, 'sub_3')
  await checkErc721(staking, origin, fanfic, address.SUB_4_ACCOUNT, 'sub_4')
  // Market
  console.log('check for market is starting...')
  for (let i = 1; i <= (await market.totalSupply()).toNumber(); i++) {
    await checkMarket(market, i)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
