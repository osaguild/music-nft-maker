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
  // set up
  const deployer = (await ethers.getSigners())[0] as SignerWithAddress
  const protocol = await Protocol__factory.connect(address.PROTOCOL_CONTRACT, deployer)
  const mte = await MteToken__factory.connect(address.MTE_CONTRACT, deployer)
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
