import { ethers } from 'hardhat'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { Message__factory } from '../typechain-types'

const MESSAGE_CONTRACT = '0x913E7686B0B92c815D96Ed4B79a93E42DDFa8d06'

async function main() {
  // account check
  const deployer = (await ethers.getSigners())[0] as SignerWithAddress
  const balance = (await deployer.getBalance()).toString()
  console.log('deploying contract with the account:', deployer.address)
  console.log('account balance:', balance)

  // message
  await Message__factory.connect(MESSAGE_CONTRACT, deployer).addMessage('Hello everyone!')
  await Message__factory.connect(MESSAGE_CONTRACT, deployer).addMessage('My name is osaguild')
  await Message__factory.connect(MESSAGE_CONTRACT, deployer).addMessage('Im web3 developer')
  await Message__factory.connect(MESSAGE_CONTRACT, deployer).addMessage('Im living in Japan')
  await Message__factory.connect(MESSAGE_CONTRACT, deployer).addMessage('Please follow me')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
