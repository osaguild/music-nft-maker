import { ethers } from 'hardhat'
import { expect } from 'chai'
import { Protocol, StakingToken, MteToken } from '../typechain-types'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { calcReward, printBalance, Balance } from './utils'

describe('Protocol.sol', () => {
  const balanceOf = {
    alice: 0,
    bob: 0,
    protocol: 0,
    stakingOfAlice: 0,
    stakingOfBob: 0,
  } as Balance
  const numerator = 100

  let owner: SignerWithAddress
  let alice: SignerWithAddress
  let bob: SignerWithAddress
  let protocol: Protocol
  let staking: StakingToken
  let mte: MteToken
  let stakedBlockOfAlice: number
  let stakedBlockOfBob: number

  before(async () => {
    const _signers = await ethers.getSigners()
    owner = _signers[0] as SignerWithAddress
    alice = _signers[1] as SignerWithAddress
    bob = _signers[2] as SignerWithAddress
    const _pFactory = await ethers.getContractFactory('Protocol')
    protocol = await _pFactory.deploy(owner.address, numerator)
    const _sFactory = await ethers.getContractFactory('StakingToken')
    staking = await _sFactory.deploy(protocol.address)
    const _mFactory = await ethers.getContractFactory('MteToken')
    mte = await _mFactory.deploy(protocol.address)
    await protocol.setStakingToken(staking.address)
    await protocol.setMteToken(mte.address)
  })
  it('transfer 1000 MTE to alice and 800 MTE to bob', async () => {
    // set balanceOf
    balanceOf.alice = 1000
    balanceOf.bob = 800
    // transfer
    await expect(protocol.connect(owner).provideLiquidity(alice.address, 0, balanceOf.alice))
      .to.emit(mte, 'Transfer')
      .withArgs(ethers.constants.AddressZero, alice.address, balanceOf.alice)
    expect(await mte.connect(owner).balanceOf(alice.address)).to.be.equals(balanceOf.alice)
    await expect(protocol.connect(owner).provideLiquidity(bob.address, 0, balanceOf.bob))
      .to.emit(mte, 'Transfer')
      .withArgs(ethers.constants.AddressZero, bob.address, balanceOf.bob)
    expect(await mte.connect(owner).balanceOf(bob.address)).to.be.equals(balanceOf.bob)
    // print balanceOf
    printBalance(balanceOf)
  })
  it('alice approves 500 MTE to contract before staking', async () => {
    // approve
    await expect(mte.connect(alice).approve(protocol.address, 500))
      .to.emit(mte, 'Approval')
      .withArgs(alice.address, protocol.address, 500)
    expect(await mte.connect(alice).allowance(alice.address, protocol.address)).to.be.equals(500)
  })
  it('alice stake 500 MTE to contract', async () => {
    // set balanceOf
    balanceOf.alice = 500
    balanceOf.protocol = 500
    balanceOf.stakingOfAlice = 500
    // stake
    await expect(protocol.connect(alice).stake(balanceOf.stakingOfAlice))
      .to.emit(mte, 'Transfer')
      .withArgs(alice.address, protocol.address, balanceOf.stakingOfAlice)
      .to.emit(staking, 'Transfer')
      .withArgs(ethers.constants.AddressZero, alice.address, 1)
    expect(await mte.connect(alice).balanceOf(alice.address)).to.be.equals(balanceOf.alice)
    expect(await mte.connect(alice).balanceOf(protocol.address)).to.be.equals(balanceOf.protocol)
    expect(await staking.connect(alice).balanceOf(alice.address)).to.be.equals(1)
    expect(await staking.connect(alice).ownerOf(1)).to.be.equals(alice.address)
    expect(await staking.connect(alice).tokenURI(1)).to.be.equals('https://osaguild.com/')
    // set block number
    stakedBlockOfAlice = await ethers.provider.getBlockNumber()
    // balanceOf
    printBalance(balanceOf)
  })
  it('alice withdraw 1000 MTE is reverted', async () => {
    await expect(protocol.connect(alice).withdraw(1000)).revertedWith('Protocol: staking is not enough')
  })
  it('bob withdraw 500 MTE is reverted', async () => {
    await expect(protocol.connect(bob).withdraw(500)).revertedWith('Protocol: staking not found')
  })
  it('bob approves 400 MTE to contract before staking', async () => {
    await expect(mte.connect(bob).approve(protocol.address, 400))
      .to.emit(mte, 'Approval')
      .withArgs(bob.address, protocol.address, 400)
    expect(await mte.connect(bob).allowance(bob.address, protocol.address)).to.be.equals(400)
  })
  it('bob stake 400 MTE to contract', async () => {
    // set balanceOf
    balanceOf.bob = 400
    balanceOf.protocol = 900
    balanceOf.stakingOfBob = 400
    // stake
    await expect(protocol.connect(bob).stake(balanceOf.stakingOfBob))
      .to.emit(mte, 'Transfer')
      .withArgs(bob.address, protocol.address, balanceOf.stakingOfBob)
      .to.emit(staking, 'Transfer')
      .withArgs(ethers.constants.AddressZero, bob.address, 2)
    expect(await mte.connect(bob).balanceOf(bob.address)).to.be.equals(balanceOf.bob)
    expect(await mte.connect(bob).balanceOf(protocol.address)).to.be.equals(balanceOf.protocol)
    expect(await staking.connect(bob).balanceOf(bob.address)).to.be.equals(1)
    expect(await staking.connect(bob).ownerOf(2)).to.be.equals(bob.address)
    expect(await staking.connect(bob).tokenURI(2)).to.be.equals('https://osaguild.com/')
    // set block number
    stakedBlockOfBob = await ethers.provider.getBlockNumber()
    // print balanceOf
    printBalance(balanceOf)
  })
  it('check balance of staking and reward before withdraw', async () => {
    const _block = await ethers.provider.getBlockNumber()
    const _rewardOfAlice = calcReward(numerator, undefined, balanceOf.stakingOfAlice, _block - stakedBlockOfAlice)
    const _rewardOfBob = calcReward(numerator, undefined, balanceOf.stakingOfBob, _block - stakedBlockOfBob)
    expect(await protocol.connect(alice).balanceOfStaking(alice.address)).to.be.equals(balanceOf.stakingOfAlice)
    expect(await protocol.connect(alice).balanceOfStaking(bob.address)).to.be.equals(balanceOf.stakingOfBob)
    expect(await protocol.connect(alice).balanceOfReward(alice.address)).to.be.equals(_rewardOfAlice)
    expect(await protocol.connect(alice).balanceOfReward(bob.address)).to.be.equals(_rewardOfBob)
  })
  it('check mintable', async () => {
    expect(await protocol.connect(alice).mintable(alice.address)).to.be.equals(true)
    expect(await protocol.connect(alice).mintable(bob.address)).to.be.equals(true)
  })
  it('alice withdraw 500 MTE', async () => {
    // withdraw
    const _withdraw = 500
    const _tx = await protocol.connect(alice).withdraw(_withdraw)
    const _block = await ethers.provider.getBlockNumber()
    const _reward = calcReward(numerator, undefined, _withdraw, _block - stakedBlockOfAlice)
    // set balanceOf
    balanceOf.alice += _withdraw + _reward
    balanceOf.protocol -= _withdraw + _reward
    balanceOf.stakingOfAlice -= _withdraw
    // check
    await expect(_tx)
      .to.emit(mte, 'Transfer')
      .withArgs(protocol.address, alice.address, _withdraw + _reward)
    await expect(_tx).to.emit(staking, 'Transfer').withArgs(alice.address, ethers.constants.AddressZero, 1)
    expect(await mte.connect(alice).balanceOf(alice.address)).to.be.equals(balanceOf.alice)
    expect(await mte.connect(alice).balanceOf(protocol.address)).to.be.equals(balanceOf.protocol)
    expect(await staking.connect(alice).balanceOf(alice.address)).to.be.equals(0)
    await expect(staking.connect(alice).ownerOf(1)).revertedWith('ERC721: invalid token ID')
    // print balanceOf
    printBalance(balanceOf)
  })
  it('bob withdraw 100 MTE', async () => {
    // withdraw
    const _withdraw = 100
    const _tx = await protocol.connect(bob).withdraw(_withdraw)
    const _block = await ethers.provider.getBlockNumber()
    const _reward = calcReward(numerator, undefined, _withdraw, _block - stakedBlockOfBob)
    // set balanceOf
    balanceOf.bob += _withdraw + _reward
    balanceOf.protocol -= _withdraw + _reward
    balanceOf.stakingOfBob -= _withdraw
    // check
    await expect(_tx)
      .to.emit(mte, 'Transfer')
      .withArgs(protocol.address, bob.address, _withdraw + _reward)
    expect(await mte.connect(bob).balanceOf(bob.address)).to.be.equals(balanceOf.bob)
    expect(await mte.connect(bob).balanceOf(protocol.address)).to.be.equals(balanceOf.protocol)
    expect(await staking.connect(bob).balanceOf(bob.address)).to.be.equals(1)
    expect(await staking.connect(bob).ownerOf(2)).to.be.equals(bob.address)
    // print balanceOf
    printBalance(balanceOf)
  })
  it('check mintable', async () => {
    expect(await protocol.connect(alice).mintable(alice.address)).to.be.equals(false)
    expect(await protocol.connect(alice).mintable(bob.address)).to.be.equals(true)
  })
})
