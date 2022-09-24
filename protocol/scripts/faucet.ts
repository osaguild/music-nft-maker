import { ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { MteToken__factory, Protocol__factory } from '../typechain-types'
import { address } from '../utils'

async function main() {
  // account check
  const deployer = (await ethers.getSigners())[0] as SignerWithAddress
  const balance = (await deployer.getBalance()).toString()
  console.log('run contract with the account:', deployer.address)
  console.log('account balance:', balance)
  // faucet
  const target = address.SUB_1_ACCOUNT
  const amount = ethers.utils.parseEther('100')
  await Protocol__factory.connect(address.PROTOCOL_CONTRACT, deployer).provideLiquidity(target, 0, amount)
  console.log('send', amount.toString(), 'to', target)
  console.log(
    'balance of',
    target,
    'is',
    (await MteToken__factory.connect(address.MTE_CONTRACT, deployer).balanceOf(target)).toString(),
    'MTE'
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
