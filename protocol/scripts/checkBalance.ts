import { ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { JsonRpcProvider } from '@ethersproject/providers'
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
import { address, convertAddress } from '../utils'

const checkEth = async (account: string, name: string, provider: JsonRpcProvider) => {
  console.log(name, 'balance:', ethers.utils.formatEther(await provider.getBalance(account)).toString(), 'ETH')
}

const checkMte = async (
  mte: MteToken,
  protocol: Protocol,
  account: string,
  name: string,
  provider: JsonRpcProvider
) => {
  console.log(
    name,
    'balance:',
    ethers.utils.formatEther(await mte.balanceOf(account)).toString(),
    'MTE / approval:',
    ethers.utils.formatEther(await mte.allowance(account, address.PROTOCOL_CONTRACT)).toString(),
    'MTE / staking:',
    ethers.utils.formatEther(await protocol.balanceOfStaking(account)).toString(),
    'MTE / eth:',
    ethers.utils.formatEther(await provider.getBalance(account)).toString(),
    'ETH'
  )
}

const checkStaking = async (staking: StakingToken) => {
  const _current = (await staking.totalSupply()).toNumber()
  for (let i = 1; i <= _current; i++) {
    console.log('id:', i, '/ owner:', convertAddress(await staking.ownerOf(i)))
  }
}

const checkOrigin = async (origin: OriginToken) => {
  const _current = (await origin.totalSupply()).toNumber()
  for (let i = 1; i <= _current; i++) {
    console.log('id:', i, '/ owner:', convertAddress(await origin.ownerOf(i)))
  }
}

const checkFanfic = async (fanfic: FanficToken) => {
  const _current = (await fanfic.totalSupply()).toNumber()
  for (let i = 1; i <= _current; i++) {
    let message = ''
    const [receivers, amounts] = await fanfic.royaltyInfo(i, 100)
    for (let j = 0; j < receivers.length; j++) {
      message = message + `(${j + 1})${amounts[j]?.toNumber()}% to ${convertAddress(receivers[j] as string)}, `
    }
    console.log(
      'id:',
      i,
      '/ owner:',
      convertAddress(await fanfic.ownerOf(i)),
      '/ approved:',
      convertAddress(await fanfic.getApproved(i)),
      '/ royalty:',
      message
    )
  }
}

const checkSale = async (market: Market) => {
  const _current = (await market.totalSupply()).toNumber()
  for (let i = 1; i <= _current; i++) {
    const _sale = await market.sale(i)
    console.log(
      'id:',
      i,
      '/ tokenId:',
      _sale.tokenId.toNumber(),
      '/ price:',
      ethers.utils.formatEther(_sale.price),
      'ETH / buyer:',
      convertAddress(_sale.buyer),
      '/ start:',
      _sale.startBlockNumber.toNumber(),
      '/ end:',
      _sale.endBlockNumber.toNumber(),
      '/ sold:',
      _sale.isSold
    )
  }
}

async function main() {
  // set up
  const provider = ethers.provider
  const signer = (await ethers.getSigners())[0] as SignerWithAddress
  const mte = MteToken__factory.connect(address.MTE_CONTRACT, signer)
  const protocol = Protocol__factory.connect(address.PROTOCOL_CONTRACT, signer)
  const staking = StakingToken__factory.connect(address.STAKING_CONTRACT, signer)
  const origin = OriginToken__factory.connect(address.ORIGIN_CONTRACT, signer)
  const fanfic = FanficToken__factory.connect(address.FANFIC_CONTRACT, signer)
  const market = Market__factory.connect(address.MARKET_CONTRACT, signer)
  // ETH
  console.log('[check for ETH is starting...]')
  await checkEth(address.SUB_1_ACCOUNT, 'sub_1', provider)
  await checkEth(address.SUB_2_ACCOUNT, 'sub_2', provider)
  await checkEth(address.SUB_3_ACCOUNT, 'sub_3', provider)
  await checkEth(address.SUB_4_ACCOUNT, 'sub_4', provider)
  await checkEth(address.PROTOCOL_CONTRACT, 'protocol', provider)
  // MteToken
  console.log('[check for MteToken is starting...]')
  await checkMte(mte, protocol, address.SUB_1_ACCOUNT, 'sub_1', provider)
  await checkMte(mte, protocol, address.SUB_2_ACCOUNT, 'sub_2', provider)
  await checkMte(mte, protocol, address.SUB_3_ACCOUNT, 'sub_3', provider)
  await checkMte(mte, protocol, address.SUB_4_ACCOUNT, 'sub_4', provider)
  await checkMte(mte, protocol, address.PROTOCOL_CONTRACT, 'protocol', provider)
  // StakingToken
  console.log('[check for StakingToken is starting...]')
  await checkStaking(staking)
  // OriginToken
  console.log('[check for OriginToken is starting...]')
  await checkOrigin(origin)
  // FanficToken
  console.log('[check for FanficToken is starting...]')
  await checkFanfic(fanfic)
  // Sale
  console.log('[check for Sale is starting...]')
  await checkSale(market)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
