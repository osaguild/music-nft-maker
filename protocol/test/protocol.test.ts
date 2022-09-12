import { ethers } from 'hardhat'
import { expect } from 'chai'
import { Protocol, StakingToken, MteToken } from '../typechain-types'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

describe('Protocol.sol', () => {
  let owner: SignerWithAddress
  let alice: SignerWithAddress
  let bob: SignerWithAddress
  let protocol: Protocol
  let staking: StakingToken
  let mte: MteToken

  before(async () => {
    const signers = await ethers.getSigners()
    owner = signers[0] as SignerWithAddress
    alice = signers[1] as SignerWithAddress
    bob = signers[2] as SignerWithAddress
    const pFactory = await ethers.getContractFactory('Protocol')
    protocol = await pFactory.deploy(owner.address, 100)
    const sFactory = await ethers.getContractFactory('StakingToken')
    staking = await sFactory.deploy(protocol.address)
    const mFactory = await ethers.getContractFactory('MteToken')
    mte = await mFactory.deploy(protocol.address)
    await protocol.setStakingToken(staking.address)
    await protocol.setMteToken(mte.address)
  })
  it('transfer 1000 MTE to alice and bob', async () => {
    await expect(protocol.connect(owner).provideLiquidity(alice.address, 0, 1000))
      .to.emit(mte, 'Transfer')
      .withArgs(ethers.constants.AddressZero, alice.address, 1000)
    expect(await mte.connect(owner).balanceOf(alice.address)).to.be.equals(1000)
    await expect(protocol.connect(owner).provideLiquidity(bob.address, 0, 1000))
      .to.emit(mte, 'Transfer')
      .withArgs(ethers.constants.AddressZero, bob.address, 1000)
    expect(await mte.connect(owner).balanceOf(bob.address)).to.be.equals(1000)
  })
  it('alice approves 500 MTE to contract before staking', async () => {
    await expect(mte.connect(alice).approve(protocol.address, 500))
      .to.emit(mte, 'Approval')
      .withArgs(alice.address, protocol.address, 500)
    expect(await mte.connect(alice).allowance(alice.address, protocol.address)).to.be.equals(500)
    expect(await mte.connect(alice).balanceOf(alice.address)).to.be.equals(1000)
  })
  it('alice stake 500 MTE to contract', async () => {
    await expect(protocol.connect(alice).stake(500))
      .to.emit(mte, 'Transfer')
      .withArgs(alice.address, protocol.address, 500)
      .to.emit(staking, 'Transfer')
      .withArgs(ethers.constants.AddressZero, alice.address, 1)
    expect(await mte.connect(alice).balanceOf(alice.address)).to.be.equals(500)
    expect(await mte.connect(alice).balanceOf(protocol.address)).to.be.equals(500)
    expect(await staking.connect(alice).balanceOf(alice.address)).to.be.equals(1)
    expect(await staking.connect(alice).ownerOf(1)).to.be.equals(alice.address)
    expect(await staking.connect(alice).tokenURI(1)).to.be.equals('https://osaguild.com/')
  })
  it('alice withdraw 1000 MTE is reverted', async () => {
    await expect(protocol.connect(alice).withdraw(1000)).revertedWith('Protocol: staking is not enough')
  })
  it('bob withdraw 500 MTE is reverted', async () => {
    await expect(protocol.connect(bob).withdraw(500)).revertedWith('Protocol: staking not found')
  })
  it('bob approves 500 MTE to contract before staking', async () => {
    await expect(mte.connect(bob).approve(protocol.address, 500))
      .to.emit(mte, 'Approval')
      .withArgs(bob.address, protocol.address, 500)
    expect(await mte.connect(bob).allowance(bob.address, protocol.address)).to.be.equals(500)
    expect(await mte.connect(bob).balanceOf(bob.address)).to.be.equals(1000)
  })
  it('bob stake 500 MTE to contract', async () => {
    await expect(protocol.connect(bob).stake(500))
      .to.emit(mte, 'Transfer')
      .withArgs(bob.address, protocol.address, 500)
      .to.emit(staking, 'Transfer')
      .withArgs(ethers.constants.AddressZero, bob.address, 2)
    expect(await mte.connect(bob).balanceOf(bob.address)).to.be.equals(500)
    expect(await mte.connect(bob).balanceOf(protocol.address)).to.be.equals(1000)
    expect(await staking.connect(bob).balanceOf(bob.address)).to.be.equals(1)
    expect(await staking.connect(bob).ownerOf(2)).to.be.equals(bob.address)
    expect(await staking.connect(bob).tokenURI(2)).to.be.equals('https://osaguild.com/')
  })
  it('check balance of staking before withdraw', async () => {
    expect(await protocol.connect(alice).balanceOfStaking(alice.address)).to.be.equals(500)
    expect(await protocol.connect(alice).balanceOfStaking(bob.address)).to.be.equals(500)
  })
  it('alice withdraw 500 MTE', async () => {
    await expect(protocol.connect(alice).withdraw(500))
      .to.emit(mte, 'Transfer')
      .withArgs(protocol.address, alice.address, 500)
      .to.emit(staking, 'Transfer')
      .withArgs(alice.address, ethers.constants.AddressZero, 1)
    expect(await mte.connect(alice).balanceOf(alice.address)).to.be.equals(1000)
    expect(await mte.connect(alice).balanceOf(protocol.address)).to.be.equals(500)
    expect(await staking.connect(alice).balanceOf(alice.address)).to.be.equals(0)
    await expect(staking.connect(alice).ownerOf(1)).revertedWith('ERC721: invalid token ID')
  })
  it('bob withdraw 100 MTE', async () => {
    await expect(protocol.connect(bob).withdraw(100))
      .to.emit(mte, 'Transfer')
      .withArgs(protocol.address, bob.address, 100)
    expect(await mte.connect(bob).balanceOf(bob.address)).to.be.equals(600)
    expect(await mte.connect(bob).balanceOf(protocol.address)).to.be.equals(400)
    expect(await staking.connect(bob).balanceOf(bob.address)).to.be.equals(1)
    expect(await staking.connect(bob).ownerOf(2)).to.be.equals(bob.address)
  })
  it('check balance of staking after withdraw', async () => {
    expect(await protocol.connect(alice).balanceOfStaking(alice.address)).to.be.equals(0)
    expect(await protocol.connect(alice).balanceOfStaking(bob.address)).to.be.equals(400)
  })
})
