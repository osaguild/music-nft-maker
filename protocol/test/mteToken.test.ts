import { ethers } from 'hardhat'
import { expect } from 'chai'
import { MteToken } from '../typechain-types'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

describe('MteToken.sol', () => {
  let alice: SignerWithAddress
  let bob: SignerWithAddress
  let mte: MteToken

  before(async () => {
    const signers = await ethers.getSigners()
    alice = signers[0] as SignerWithAddress
    bob = signers[1] as SignerWithAddress
    const factory = await ethers.getContractFactory('MteToken')
    mte = await factory.deploy(alice.address)
  })
  it('alice can mint', async () => {
    await expect(mte.connect(alice).mint(bob.address, 100))
      .to.emit(mte, 'Transfer')
      .withArgs(ethers.constants.AddressZero, bob.address, 100)
    expect(await mte.connect(alice).balanceOf(bob.address)).to.be.equals(100)
  })
  it('bob can not mint', async () => {
    await expect(mte.connect(bob).mint(alice.address, 100)).to.be.revertedWith('Ownable: caller is not the owner')
    expect(await mte.connect(bob).balanceOf(alice.address)).to.be.equals(0)
  })
})
