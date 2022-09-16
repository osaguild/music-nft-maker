import { ethers } from 'hardhat'
import { expect } from 'chai'
import { OriginToken, Protocol, StakingToken, MteToken } from '../typechain-types'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

describe('OriginToken.sol', () => {
  let alice: SignerWithAddress
  let bob: SignerWithAddress
  let origin: OriginToken
  let protocol: Protocol
  let staking: StakingToken
  let mte: MteToken

  before(async () => {
    // signers
    const signers = await ethers.getSigners()
    alice = signers[0] as SignerWithAddress
    bob = signers[1] as SignerWithAddress
    // deploy
    const _pFactory = await ethers.getContractFactory('Protocol')
    protocol = await _pFactory.deploy(alice.address, 1000)
    const _sFactory = await ethers.getContractFactory('StakingToken')
    staking = await _sFactory.deploy(protocol.address)
    const _mFactory = await ethers.getContractFactory('MteToken')
    mte = await _mFactory.deploy(protocol.address)
    const _oFactory = await ethers.getContractFactory('OriginToken')
    origin = await _oFactory.deploy(alice.address)
    // set address of contract
    await protocol.setStakingToken(staking.address)
    await protocol.setMteToken(mte.address)
    await origin.setProtocol(protocol.address)
  })
  it('transfer 1000 MTE to alice and bob', async () => {
    await protocol.connect(alice).provideLiquidity(alice.address, 0, 1000)
    expect(await mte.connect(alice).balanceOf(alice.address)).to.be.equals(1000)
    await protocol.connect(alice).provideLiquidity(bob.address, 0, 1000)
    expect(await mte.connect(alice).balanceOf(bob.address)).to.be.equals(1000)
  })
  it('bob stakes 100 MTE', async () => {
    await mte.connect(bob).approve(protocol.address, 100)
    await protocol.connect(bob).stake(100)
    expect(await mte.connect(alice).balanceOf(bob.address)).to.be.equals(900)
    expect(await protocol.connect(bob).balanceOfStaking(bob.address)).to.be.equals(100)
  })
  it('alice can not mint', async () => {
    await expect(origin.connect(alice).mint('https://osaguild.com/1')).to.be.revertedWith('OriginToken: not mintable')
    expect(await protocol.connect(alice).balanceOfStaking(alice.address)).to.be.equals(0)
  })
  it('bob can mint', async () => {
    await expect(origin.connect(bob).mint('https://osaguild.com/1'))
      .to.emit(origin, 'Transfer')
      .withArgs(ethers.constants.AddressZero, bob.address, 1)
    expect(await protocol.connect(bob).balanceOfStaking(bob.address)).to.be.equals(100)
    expect(await origin.connect(bob).tokenURI(1)).to.be.equals('https://osaguild.com/1')
    expect(await origin.connect(bob).ownerOf(1)).to.be.equals(bob.address)
  })
})
