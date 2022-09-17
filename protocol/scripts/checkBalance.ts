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
} from '../typechain-types'
import { address } from './config'

const checkErc20 = async (mte: MteToken, protocol: Protocol, account: string) => {
  console.log(
    '[sub_1] balance:',
    ethers.utils.formatEther(await mte.balanceOf(account)).toString(),
    'MTE / approval:',
    ethers.utils.formatEther(await mte.allowance(account, address.PROTOCOL_CONTRACT)).toString(),
    'MTE / staking:',
    ethers.utils.formatEther(await protocol.balanceOfStaking(account)).toString(),
    'MTE'
  )
}

const checkErc721 = async (staking: StakingToken, origin: OriginToken, fanfic: FanficToken, account: string) => {
  console.log(
    '[sub_1] StakingToken:',
    (await staking.balanceOf(account)).toString(),
    '/ OriginToken:',
    (await origin.balanceOf(account)).toString(),
    '/ FanficToken:',
    (await fanfic.balanceOf(account)).toString()
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
  // ERC20
  await checkErc20(mte, protocol, address.SUB_1_ACCOUNT)
  await checkErc20(mte, protocol, address.SUB_2_ACCOUNT)
  await checkErc20(mte, protocol, address.SUB_3_ACCOUNT)
  await checkErc20(mte, protocol, address.SUB_4_ACCOUNT)
  // ERC721
  await checkErc721(staking, origin, fanfic, address.SUB_1_ACCOUNT)
  await checkErc721(staking, origin, fanfic, address.SUB_2_ACCOUNT)
  await checkErc721(staking, origin, fanfic, address.SUB_3_ACCOUNT)
  await checkErc721(staking, origin, fanfic, address.SUB_4_ACCOUNT)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
