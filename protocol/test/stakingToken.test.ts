import { ethers } from 'hardhat'
import { expect } from 'chai'
import { StakingToken } from '../typechain-types'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

describe('StakingToken.sol', () => {
  let alice: SignerWithAddress
  let bob: SignerWithAddress
  let staking: StakingToken

  before(async () => {
    const signers = await ethers.getSigners()
    alice = signers[0] as SignerWithAddress
    bob = signers[1] as SignerWithAddress
    const factory = await ethers.getContractFactory('StakingToken')
    staking = await factory.deploy(alice.address)
  })
  it('alice can mint', async () => {
    await expect(staking.connect(alice).mint(bob.address, 'https://osaguild.com/1'))
      .to.emit(staking, 'Transfer')
      .withArgs(ethers.constants.AddressZero, bob.address, 1)
    expect(await staking.connect(alice).tokenURI(1)).to.be.equals('https://osaguild.com/1')
    expect(await staking.connect(alice).ownerOf(1)).to.be.equals(bob.address)
    expect(await staking.connect(alice).totalSupply()).to.be.equals(1)
  })
  it('bob can not mint', async () => {
    await expect(staking.connect(bob).mint(alice.address, 'https://osaguild.com/2')).to.be.revertedWith(
      'Ownable: caller is not the owner'
    )
    await expect(staking.connect(bob).tokenURI(2)).to.be.revertedWith('ERC721: invalid token ID')
  })
  it('bob can not burn', async () => {
    await expect(staking.connect(bob).burn(1)).to.be.revertedWith('Ownable: caller is not the owner')
    expect(await staking.connect(bob).tokenURI(1)).to.be.equals('https://osaguild.com/1')
    expect(await staking.connect(bob).ownerOf(1)).to.be.equals(bob.address)
  })
  it('alice can burn', async () => {
    await expect(staking.connect(alice).burn(1))
      .to.emit(staking, 'Transfer')
      .withArgs(bob.address, ethers.constants.AddressZero, 1)
    await expect(staking.connect(alice).tokenURI(1)).to.be.revertedWith('ERC721: invalid token ID')
    expect(await staking.connect(alice).totalSupply()).to.be.equals(1)
  })
})
