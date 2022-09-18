import { ethers } from 'hardhat'
import { expect } from 'chai'
import { BigNumber } from 'ethers'
import { Market, FanficToken, OriginToken, Protocol, StakingToken, MteToken } from '../typechain-types'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

describe('Market.sol', () => {
  let alice: SignerWithAddress // default receiver
  let bob: SignerWithAddress // author of origin token
  let carol: SignerWithAddress // seller
  let daniel: SignerWithAddress // buyer
  let market: Market
  let fanfic: FanficToken
  let origin: OriginToken
  let protocol: Protocol
  let staking: StakingToken
  let mte: MteToken
  let startBlockOfSaleId1: number
  let endBlockOfSaleId1: number
  let startBlockOfSaleId2: number
  let endBlockOfSaleId2: number
  let balanceOfAliceBefore: BigNumber
  let balanceOfBobBefore: BigNumber
  let balanceOfCarolBefore: BigNumber
  let balanceOfDanielBefore: BigNumber
  let gasUsed: BigNumber
  let gasPrice: BigNumber

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
    const _mtFactory = await ethers.getContractFactory('MteToken')
    mte = await _mtFactory.deploy(protocol.address)
    const _oFactory = await ethers.getContractFactory('OriginToken')
    origin = await _oFactory.deploy(alice.address)
    const _fFactory = await ethers.getContractFactory('FanficToken')
    fanfic = await _fFactory.deploy(alice.address)
    const _maFactory = await ethers.getContractFactory('Market')
    market = await _maFactory.deploy(alice.address)
    // set address of contract
    await protocol.setStakingToken(staking.address)
    await protocol.setMteToken(mte.address)
    await origin.setProtocol(protocol.address)
    await fanfic.setOriginToken(origin.address)
    await fanfic.setProtocol(protocol.address)
    await market.setFanficToken(fanfic.address)
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
  it('bob mint origin token as tokenId 1', async () => {
    await expect(origin.connect(bob).mint('https://osaguild.com/origin/1'))
      .emit(origin, 'Transfer')
      .withArgs(ethers.constants.AddressZero, bob.address, 1)
    expect(await origin.connect(bob).ownerOf(1)).to.be.equals(bob.address)
  })
  it('carol mint fanfic token as tokenId 1 witch origin tokenId is 1', async () => {
    await expect(fanfic.connect(carol).mint('https://osaguild.com/fanfic/1', [1]))
      .emit(fanfic, 'Transfer')
      .withArgs(ethers.constants.AddressZero, carol.address, 1)
    expect(await fanfic.connect(carol).ownerOf(1)).to.be.equals(carol.address)
    expect(await fanfic.connect(carol).tokenURI(1)).to.be.equals('https://osaguild.com/fanfic/1')
  })
  it('carol approves tokenId 1 to market', async () => {
    await expect(fanfic.connect(carol).approve(market.address, 1))
      .to.emit(fanfic, 'Approval')
      .withArgs(carol.address, market.address, 1)
    expect(await fanfic.connect(carol).getApproved(1)).to.be.equals(market.address)
  })
  it('alice can not start sale of tokenId 1', async () => {
    await expect(market.connect(alice).startSale(1, 1000)).to.be.revertedWith('Market: not owner')
  })
  it('carol start sale of tokenId 1 as saleId 1', async () => {
    await expect(market.connect(carol).startSale(1, 1000))
      .to.emit(market, 'StartSale')
      .withArgs(1, 1, 1000, carol.address)
    startBlockOfSaleId1 = await ethers.provider.getBlockNumber()
    expect(await market.connect(carol).totalSupply()).to.be.equals(1)
    const _sale = await market.connect(carol).sale(1)
    expect(_sale.tokenId).to.be.deep.equals(1)
    expect(_sale.price).to.be.deep.equals(1000)
    expect(_sale.buyer).to.be.deep.equals(ethers.constants.AddressZero)
    expect(_sale.startBlockNumber).to.be.deep.equals(startBlockOfSaleId1)
    expect(_sale.endBlockNumber).to.be.deep.equals(0)
    expect(_sale.isSold).to.be.equals(false)
  })
  it('can not purchase under the price', async () => {
    await expect(market.connect(bob).purchase(1, { value: 999 })).to.be.revertedWith('Market: not match price')
  })
  it('can not purchase over the price', async () => {
    await expect(market.connect(bob).purchase(1, { value: 1001 })).to.be.revertedWith('Market: not match price')
  })
  it('alice can not close sale of tokenId 1', async () => {
    await expect(market.connect(alice).closeSale(1)).to.be.revertedWith('Market: not owner')
  })
  it('carol can close sale of tokenId 1', async () => {
    await expect(market.connect(carol).closeSale(1)).to.emit(market, 'CloseSale').withArgs(1, 1)
    endBlockOfSaleId1 = await ethers.provider.getBlockNumber()
    expect(await market.connect(carol).totalSupply()).to.be.equals(1)
    const _sale = await market.connect(carol).sale(1)
    expect(_sale.tokenId).to.be.deep.equals(1)
    expect(_sale.price).to.be.deep.equals(1000)
    expect(_sale.buyer).to.be.deep.equals(ethers.constants.AddressZero)
    expect(_sale.startBlockNumber).to.be.deep.equals(startBlockOfSaleId1)
    expect(_sale.endBlockNumber).to.be.deep.equals(endBlockOfSaleId1)
    expect(_sale.isSold).to.be.equals(false)
  })
  it('can not close already closed sale', async () => {
    await expect(market.connect(carol).closeSale(1)).to.be.revertedWith('Market: already closed')
  })
  it('can not purchase already closed sale', async () => {
    await expect(market.connect(alice).purchase(1, { value: 1000 })).to.be.revertedWith('Market: already closed')
  })
  it('carol start sale of tokenId 1 as saleId 2', async () => {
    await expect(market.connect(carol).startSale(1, 1000))
      .to.emit(market, 'StartSale')
      .withArgs(2, 1, 1000, carol.address)
    startBlockOfSaleId2 = await ethers.provider.getBlockNumber()
    expect(await market.connect(carol).totalSupply()).to.be.equals(2)
    const _sale = await market.connect(carol).sale(2)
    expect(_sale.tokenId).to.be.deep.equals(1)
    expect(_sale.price).to.be.deep.equals(1000)
    expect(_sale.buyer).to.be.deep.equals(ethers.constants.AddressZero)
    expect(_sale.startBlockNumber).to.be.deep.equals(startBlockOfSaleId2)
    expect(_sale.endBlockNumber).to.be.deep.equals(0)
    expect(_sale.isSold).to.be.equals(false)
  })
  it('daniel purchases saleId 2', async () => {
    // set balance of before purchase
    balanceOfAliceBefore = await ethers.provider.getBalance(alice.address)
    balanceOfBobBefore = await ethers.provider.getBalance(bob.address)
    balanceOfCarolBefore = await ethers.provider.getBalance(carol.address)
    balanceOfDanielBefore = await ethers.provider.getBalance(daniel.address)
    // tx
    const _tx = await market.connect(daniel).purchase(2, { value: 1000 })
    const _receipt = await ethers.provider.getTransactionReceipt(_tx.hash)
    // set gas used
    gasUsed = _receipt.cumulativeGasUsed
    gasPrice = _receipt.effectiveGasPrice
    // check transaction
    endBlockOfSaleId2 = await ethers.provider.getBlockNumber()
    expect(await market.connect(daniel).totalSupply()).to.be.equals(2)
    expect(await fanfic.connect(daniel).ownerOf(1)).to.be.equals(daniel.address)
    const _sale = await market.connect(carol).sale(2)
    expect(_sale.tokenId).to.be.deep.equals(1)
    expect(_sale.price).to.be.deep.equals(1000)
    expect(_sale.buyer).to.be.deep.equals(daniel.address)
    expect(_sale.startBlockNumber).to.be.deep.equals(startBlockOfSaleId2)
    expect(_sale.endBlockNumber).to.be.deep.equals(endBlockOfSaleId2)
    expect(_sale.isSold).to.be.equals(true)
  })
  it('check royalty value of ETH', async () => {
    expect(await alice.getBalance()).to.be.equals(balanceOfAliceBefore.add(200))
    expect(await bob.getBalance()).to.be.equals(balanceOfBobBefore.add(100))
    expect(await carol.getBalance()).to.be.equals(balanceOfCarolBefore.add(700))
    expect(await daniel.getBalance()).to.be.equals(balanceOfDanielBefore.sub(1000).sub(gasUsed.mul(gasPrice)))
  })
})
