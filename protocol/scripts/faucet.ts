import { ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { MteToken__factory, MteToken, Protocol, Protocol__factory } from '../typechain-types'
import { address, convertAddress } from '../utils'
import { BigNumber } from 'ethers'

const withdraw = async (protocol: Protocol, mte: MteToken, to: string, amount: BigNumber) => {
  await protocol.provideLiquidity(to, 0, amount)
  console.log(
    convertAddress(to),
    'received',
    ethers.utils.formatEther(amount),
    'MTE / totalBalance is',
    ethers.utils.formatEther(await mte.balanceOf(to)),
    'MTE'
  )
}

async function main() {
  // account check
  const sub_1 = (await ethers.getSigners())[0] as SignerWithAddress
  console.log('sub_1 balance:', ethers.utils.formatEther(await sub_1.getBalance()), 'ETH')

  // set up
  const protocol = await Protocol__factory.connect(address.PROTOCOL_CONTRACT, sub_1)
  const mte = await MteToken__factory.connect(address.MTE_CONTRACT, sub_1)
  // faucet
  await withdraw(protocol, mte, address.SUB_1_ACCOUNT, ethers.utils.parseEther('100'))
  await withdraw(protocol, mte, address.SUB_2_ACCOUNT, ethers.utils.parseEther('100'))
  await withdraw(protocol, mte, address.SUB_3_ACCOUNT, ethers.utils.parseEther('100'))
  await withdraw(protocol, mte, address.SUB_4_ACCOUNT, ethers.utils.parseEther('100'))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
