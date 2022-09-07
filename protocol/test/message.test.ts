import { ethers } from 'hardhat'
import { expect } from 'chai'
import { Message } from '../typechain-types'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

describe('Message.sol', () => {
  let owner: SignerWithAddress
  let user: SignerWithAddress
  let contract: Message

  before(async () => {
    const signers = await ethers.getSigners()
    owner = signers[0] as SignerWithAddress
    user = signers[1] as SignerWithAddress
    const factory = await ethers.getContractFactory('Message')
    contract = await factory.deploy(owner.address)
  })
  it('addMessage', async () => {
    await expect(contract.connect(owner).addMessage('hello world!'))
      .to.emit(contract, 'AddMessage')
      .withArgs(owner.address, 'hello world!')
    await expect(contract.connect(owner).addMessage('my name is osaguild'))
      .to.emit(contract, 'AddMessage')
      .withArgs(owner.address, 'my name is osaguild')
  })
  it('addMessage is reverted', async () => {
    await expect(contract.connect(user).addMessage('hello world!')).to.be.revertedWith('Only owner can call')
  })
  it('getMessageLength', async () => {
    expect(await contract.connect(user).getMessageLength()).to.equal(2)
  })
  it('selectMessage', async () => {
    expect(await contract.connect(user).selectMessage(1)).to.equal('hello world!')
    expect(await contract.connect(user).selectMessage(2)).to.equal('my name is osaguild')
    expect(await contract.connect(user).selectMessage(3)).to.equal('')
  })
})
