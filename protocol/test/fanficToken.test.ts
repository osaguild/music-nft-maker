import { ethers } from 'hardhat'
import { BigNumber } from 'ethers'
import { expect } from 'chai'
import { FanficToken, OriginToken, Protocol, StakingToken, MteToken } from '../typechain-types'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

describe('OriginToken.sol', () => {
  let alice: SignerWithAddress // default receiver
  let bob: SignerWithAddress // author of origin token
  let carol: SignerWithAddress // author of origin token
  let daniel: SignerWithAddress // fanfic token owner
  let fanfic: FanficToken
  let origin: OriginToken
  let protocol: Protocol
  let staking: StakingToken
  let mte: MteToken

  before(async () => {
    // signers
    const signers = await ethers.getSigners()
    alice = signers[0] as SignerWithAddress
    bob = signers[1] as SignerWithAddress
    carol = signers[2] as SignerWithAddress
    daniel = signers[3] as SignerWithAddress
    // deploy
    const _pFactory = await ethers.getContractFactory('Protocol')
    protocol = await _pFactory.deploy(alice.address, 1000)
    const _sFactory = await ethers.getContractFactory('StakingToken')
    staking = await _sFactory.deploy(protocol.address)
    const _mFactory = await ethers.getContractFactory('MteToken')
    mte = await _mFactory.deploy(protocol.address)
    const _oFactory = await ethers.getContractFactory('OriginToken')
    origin = await _oFactory.deploy(alice.address)
    const _fFactory = await ethers.getContractFactory('FanficToken')
    fanfic = await _fFactory.deploy(alice.address)
    // set address of contract
    await protocol.setStakingToken(staking.address)
    await protocol.setMteToken(mte.address)
    await origin.setProtocol(protocol.address)
    await fanfic.setOriginToken(origin.address)
    await fanfic.setProtocol(protocol.address)
  })
  it('set alice as default receiver and royalty is 20%', async () => {
    await expect(fanfic.connect(alice).setDefaultRoyalty(alice.address, 2000))
      .emit(fanfic, 'SetDefaultRoyalty')
      .withArgs(alice.address, 2000)
    const [_receivers, _amounts] = await fanfic.connect(alice).royaltyInfo(1, 1000)
    expect(_receivers[0]).to.be.equals(alice.address)
    expect(_amounts[0]).to.be.equals(200)
  })
  it('transfer 1000 MTE to all', async () => {
    await protocol.connect(alice).provideLiquidity(alice.address, 0, 1000)
    expect(await mte.connect(alice).balanceOf(alice.address)).to.be.equals(1000)
    await protocol.connect(alice).provideLiquidity(bob.address, 0, 1000)
    expect(await mte.connect(alice).balanceOf(bob.address)).to.be.equals(1000)
    await protocol.connect(alice).provideLiquidity(carol.address, 0, 1000)
    expect(await mte.connect(alice).balanceOf(carol.address)).to.be.equals(1000)
    await protocol.connect(alice).provideLiquidity(daniel.address, 0, 1000)
    expect(await mte.connect(alice).balanceOf(daniel.address)).to.be.equals(1000)
  })
  it('bob, carol and daniel stake 100 MTE', async () => {
    await mte.connect(bob).approve(protocol.address, 100)
    await protocol.connect(bob).stake(100)
    expect(await mte.connect(bob).balanceOf(bob.address)).to.be.equals(900)
    expect(await protocol.connect(bob).balanceOfStaking(bob.address)).to.be.equals(100)
    await mte.connect(carol).approve(protocol.address, 100)
    await protocol.connect(carol).stake(100)
    expect(await mte.connect(carol).balanceOf(carol.address)).to.be.equals(900)
    expect(await protocol.connect(carol).balanceOfStaking(carol.address)).to.be.equals(100)
    await mte.connect(daniel).approve(protocol.address, 100)
    await protocol.connect(daniel).stake(100)
    expect(await mte.connect(daniel).balanceOf(daniel.address)).to.be.equals(900)
    expect(await protocol.connect(daniel).balanceOfStaking(daniel.address)).to.be.equals(100)
  })
  it('bob mint 2 origin token as tokenId 1 and 2', async () => {
    await expect(origin.connect(bob).mint('https://osaguild.com/origin/1'))
      .emit(origin, 'Transfer')
      .withArgs(ethers.constants.AddressZero, bob.address, 1)
    expect(await origin.connect(bob).ownerOf(1)).to.be.equals(bob.address)
    await expect(origin.connect(bob).mint('https://osaguild.com/origin/2'))
      .emit(origin, 'Transfer')
      .withArgs(ethers.constants.AddressZero, bob.address, 2)
    expect(await origin.connect(bob).ownerOf(1)).to.be.equals(bob.address)
  })
  it('carol mint 1 origin token as tokenId 3', async () => {
    await expect(origin.connect(carol).mint('https://osaguild.com/origin/3'))
      .emit(origin, 'Transfer')
      .withArgs(ethers.constants.AddressZero, carol.address, 3)
    expect(await origin.connect(carol).ownerOf(3)).to.be.equals(carol.address)
  })
  it('alice can not mint fanfic token', async () => {
    await expect(fanfic.connect(alice).mint('https://osaguild.com/fanfic/1', [])).to.be.revertedWith(
      'FanficToken: not mintable'
    )
    expect(await protocol.connect(alice).balanceOfStaking(alice.address)).to.be.equals(0)
  })
  it('daniel mint fanfic token as tokenId 1 witch origin tokenIds are 1 and 3', async () => {
    await expect(fanfic.connect(daniel).mint('https://osaguild.com/fanfic/1', [1, 3]))
      .emit(fanfic, 'Transfer')
      .withArgs(ethers.constants.AddressZero, daniel.address, 1)
    expect(await fanfic.connect(daniel).ownerOf(1)).to.be.equals(daniel.address)
    expect(await fanfic.connect(daniel).tokenURI(1)).to.be.equals('https://osaguild.com/fanfic/1')
  })
  it('daniel mint fanfic token as tokenId 2 witch origin tokenIds are 1 and 2', async () => {
    await expect(fanfic.connect(daniel).mint('https://osaguild.com/fanfic/2', [1, 2]))
      .emit(fanfic, 'Transfer')
      .withArgs(ethers.constants.AddressZero, daniel.address, 2)
    expect(await fanfic.connect(daniel).ownerOf(2)).to.be.equals(daniel.address)
    expect(await fanfic.connect(daniel).tokenURI(2)).to.be.equals('https://osaguild.com/fanfic/2')
  })
  it('daniel mint fanfic token as tokenId 3 witch origin tokenIds are 3', async () => {
    await expect(fanfic.connect(daniel).mint('https://osaguild.com/fanfic/3', [3]))
      .emit(fanfic, 'Transfer')
      .withArgs(ethers.constants.AddressZero, daniel.address, 3)
    expect(await fanfic.connect(daniel).ownerOf(3)).to.be.equals(daniel.address)
    expect(await fanfic.connect(daniel).tokenURI(3)).to.be.equals('https://osaguild.com/fanfic/3')
  })
  it('check royalty of tokenId 1', async () => {
    const [_receivers, _amounts] = await fanfic.connect(daniel).royaltyInfo(1, 1000)
    expect(_receivers).to.be.deep.equals([alice.address, bob.address, carol.address])
    expect(_amounts).to.be.deep.equals([BigNumber.from(200), BigNumber.from(100), BigNumber.from(100)])
  })
  it('check royalty of tokenId 2', async () => {
    const [_receivers, _amounts] = await fanfic.connect(daniel).royaltyInfo(2, 1000)
    expect(_receivers).to.be.deep.equals([alice.address, bob.address, bob.address])
    expect(_amounts).to.be.deep.equals([BigNumber.from(200), BigNumber.from(100), BigNumber.from(100)])
  })
  it('check royalty of tokenId 3', async () => {
    const [_receivers, _amounts] = await fanfic.connect(daniel).royaltyInfo(3, 1000)
    expect(_receivers).to.be.deep.equals([alice.address, carol.address])
    expect(_amounts).to.be.deep.equals([BigNumber.from(200), BigNumber.from(100)])
  })
})
