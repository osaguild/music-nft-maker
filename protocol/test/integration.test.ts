import { ethers } from 'hardhat'
import { expect } from 'chai'
import { Market, FanficToken, OriginToken, Protocol, StakingToken, MteToken } from '../typechain-types'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { StakingInfo, SaleInfo } from '../utils'
import { BigNumber } from 'ethers'

describe('Integration Test', () => {
  let alice: SignerWithAddress //  default receiver / contract owner
  let bob: SignerWithAddress //    staker / creator
  let carol: SignerWithAddress //  staker / creator
  let daniel: SignerWithAddress // staker / secondary creator
  let ellie: SignerWithAddress //  buyer
  let market: Market
  let fanfic: FanficToken
  let origin: OriginToken
  let protocol: Protocol
  let staking: StakingToken
  let mte: MteToken
  const stakingOfAlice: StakingInfo[] = []
  const stakingOfBob: StakingInfo[] = []
  const stakingOfCarol: StakingInfo[] = []
  const stakingOfDaniel: StakingInfo[] = []
  const sales: SaleInfo[] = []

  before(async () => {
    // signers
    const signers = await ethers.getSigners()
    alice = signers[0] as SignerWithAddress
    bob = signers[1] as SignerWithAddress
    carol = signers[2] as SignerWithAddress
    daniel = signers[3] as SignerWithAddress
    ellie = signers[4] as SignerWithAddress
    // deploy
    const _pFactory = await ethers.getContractFactory('Protocol')
    protocol = await _pFactory.deploy(alice.address, 2000) // APY is 20%
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
    await protocol.setMteToken(mte.address)
    await protocol.setStakingToken(staking.address)
    await protocol.setFanficToken(fanfic.address)
    await protocol.setMarket(market.address)
    await origin.setProtocol(protocol.address)
    await fanfic.setOriginToken(origin.address)
    await fanfic.setProtocol(protocol.address)
    await market.setFanficToken(fanfic.address)
    await market.setProtocol(protocol.address)
  })
  describe('1.set up', () => {
    it('transfer 1000 MTE to staker', async () => {
      await protocol.connect(alice).provideLiquidity(alice.address, 0, ethers.utils.parseEther('1000'))
      expect(await mte.connect(alice).balanceOf(alice.address)).to.be.equals(ethers.utils.parseEther('1000'))
      await protocol.connect(alice).provideLiquidity(bob.address, 0, ethers.utils.parseEther('1000'))
      expect(await mte.connect(alice).balanceOf(bob.address)).to.be.equals(ethers.utils.parseEther('1000'))
      await protocol.connect(alice).provideLiquidity(carol.address, 0, ethers.utils.parseEther('1000'))
      expect(await mte.connect(alice).balanceOf(carol.address)).to.be.equals(ethers.utils.parseEther('1000'))
      await protocol.connect(alice).provideLiquidity(daniel.address, 0, ethers.utils.parseEther('1000'))
      expect(await mte.connect(alice).balanceOf(daniel.address)).to.be.equals(ethers.utils.parseEther('1000'))
    })
  })
  describe('2.staking', () => {
    describe('[success]', () => {
      it('bob approve 200 MTE', async () => {
        await expect(mte.connect(bob).approve(protocol.address, ethers.utils.parseEther('200')))
          .emit(mte, 'Approval')
          .withArgs(bob.address, protocol.address, ethers.utils.parseEther('200'))
        expect(await mte.connect(bob).allowance(bob.address, protocol.address)).to.be.equals(
          ethers.utils.parseEther('200')
        )
      })
      it('bob stake 100 MTE', async () => {
        const tx = await protocol.connect(bob).stake(ethers.utils.parseEther('100'))
        await expect(tx).emit(mte, 'Transfer').withArgs(bob.address, protocol.address, ethers.utils.parseEther('100'))
        await expect(tx).emit(staking, 'Transfer').withArgs(ethers.constants.AddressZero, bob.address, 1)
        await expect(tx).emit(protocol, 'Stake').withArgs(bob.address, bob.address, ethers.utils.parseEther('100'))
        expect(await mte.connect(bob).balanceOf(bob.address)).to.be.equals(ethers.utils.parseEther('900')) // 1000 -> 900
        expect(await mte.connect(bob).balanceOf(protocol.address)).to.be.equals(ethers.utils.parseEther('100')) // 0 -> 100
        expect(await staking.connect(bob).balanceOf(bob.address)).to.be.equals(1)
        expect(await staking.connect(bob).ownerOf(1)).to.be.equals(bob.address)
        expect(await mte.connect(bob).allowance(bob.address, protocol.address)).to.be.equals(
          ethers.utils.parseEther('100')
        )
        stakingOfBob.push({
          startBlock: await ethers.provider.getBlockNumber(),
          endBlock: 0,
          price: ethers.utils.parseEther('100'),
        })
      })
      it('carol approve 200 MTE', async () => {
        await expect(mte.connect(carol).approve(protocol.address, ethers.utils.parseEther('200')))
          .emit(mte, 'Approval')
          .withArgs(carol.address, protocol.address, ethers.utils.parseEther('200'))
        expect(await mte.connect(carol).allowance(carol.address, protocol.address)).to.be.equals(
          ethers.utils.parseEther('200')
        )
      })
      it('carol stake 200 MTE', async () => {
        const tx = await protocol.connect(carol).stake(ethers.utils.parseEther('200'))
        await expect(tx).emit(mte, 'Transfer').withArgs(carol.address, protocol.address, ethers.utils.parseEther('200'))
        await expect(tx).emit(staking, 'Transfer').withArgs(ethers.constants.AddressZero, carol.address, 2)
        await expect(tx).emit(protocol, 'Stake').withArgs(carol.address, carol.address, ethers.utils.parseEther('200'))
        expect(await mte.connect(carol).balanceOf(carol.address)).to.be.equals(ethers.utils.parseEther('800')) // 1000 -> 800
        expect(await mte.connect(carol).balanceOf(protocol.address)).to.be.equals(ethers.utils.parseEther('300')) // 100 -> 300
        expect(await staking.connect(carol).balanceOf(carol.address)).to.be.equals(1)
        expect(await staking.connect(carol).ownerOf(2)).to.be.equals(carol.address)
        expect(await mte.connect(carol).allowance(carol.address, protocol.address)).to.be.equals(0)
        stakingOfCarol.push({
          startBlock: await ethers.provider.getBlockNumber(),
          endBlock: 0,
          price: ethers.utils.parseEther('200'),
        })
      })
      it('daniel approve 100 MTE', async () => {
        await expect(mte.connect(daniel).approve(protocol.address, ethers.utils.parseEther('100')))
          .emit(mte, 'Approval')
          .withArgs(daniel.address, protocol.address, ethers.utils.parseEther('100'))
        expect(await mte.connect(daniel).allowance(daniel.address, protocol.address)).to.be.equals(
          ethers.utils.parseEther('100')
        )
      })
      it('daniel stake 100 MTE', async () => {
        const tx = await protocol.connect(daniel).stake(ethers.utils.parseEther('100'))
        await expect(tx)
          .emit(mte, 'Transfer')
          .withArgs(daniel.address, protocol.address, ethers.utils.parseEther('100'))
        await expect(tx).emit(staking, 'Transfer').withArgs(ethers.constants.AddressZero, daniel.address, 3)
        await expect(tx)
          .emit(protocol, 'Stake')
          .withArgs(daniel.address, daniel.address, ethers.utils.parseEther('100'))
        expect(await mte.connect(daniel).balanceOf(daniel.address)).to.be.equals(ethers.utils.parseEther('900')) // 1000 -> 900
        expect(await mte.connect(daniel).balanceOf(protocol.address)).to.be.equals(ethers.utils.parseEther('400')) // 300 -> 400
        expect(await staking.connect(daniel).balanceOf(daniel.address)).to.be.equals(1)
        expect(await staking.connect(daniel).ownerOf(3)).to.be.equals(daniel.address)
        expect(await mte.connect(daniel).allowance(daniel.address, protocol.address)).to.be.equals(0)
        stakingOfDaniel.push({
          startBlock: await ethers.provider.getBlockNumber(),
          endBlock: 0,
          price: ethers.utils.parseEther('100'),
        })
      })
      it('bob stake 100 MTE', async () => {
        const tx = await protocol.connect(bob).stake(ethers.utils.parseEther('100'))
        await expect(tx).emit(mte, 'Transfer').withArgs(bob.address, protocol.address, ethers.utils.parseEther('100'))
        await expect(tx).emit(protocol, 'Stake').withArgs(bob.address, bob.address, ethers.utils.parseEther('100'))
        expect(await mte.connect(bob).balanceOf(bob.address)).to.be.equals(ethers.utils.parseEther('800')) // 900 -> 800
        expect(await mte.connect(bob).balanceOf(protocol.address)).to.be.equals(ethers.utils.parseEther('500')) // 400 -> 500
        expect(await staking.connect(bob).balanceOf(bob.address)).to.be.equals(1) // staking token does not mint
        expect(await staking.connect(bob).ownerOf(1)).to.be.equals(bob.address)
        expect(await mte.connect(bob).allowance(bob.address, protocol.address)).to.be.equals(0)
        if (stakingOfBob[0]) {
          stakingOfBob[0].endBlock = await ethers.provider.getBlockNumber()
        }
        stakingOfBob.push({
          startBlock: await ethers.provider.getBlockNumber(),
          endBlock: 0,
          price: (stakingOfBob[0] as StakingInfo).price.add(ethers.utils.parseEther('100')),
        })
      })
    })
    describe('[failed]', () => {
      it('can not mint if the approval amount is zero', async () => {
        expect(await mte.connect(bob).allowance(bob.address, protocol.address)).to.be.equals(0)
        await expect(protocol.connect(bob).stake(ethers.utils.parseEther('100'))).to.be.revertedWith(
          'ERC20: insufficient allowance'
        )
      })
      it('can not mint over the approved amounts', async () => {
        // approval 100 MTE
        await expect(mte.connect(bob).approve(protocol.address, ethers.utils.parseEther('100')))
          .emit(mte, 'Approval')
          .withArgs(bob.address, protocol.address, ethers.utils.parseEther('100'))
        expect(await mte.connect(bob).allowance(bob.address, protocol.address)).to.be.equals(
          ethers.utils.parseEther('100')
        )
        // stake 200 MTE
        await expect(protocol.connect(bob).stake(ethers.utils.parseEther('200'))).to.be.revertedWith(
          'ERC20: insufficient allowance'
        )
      })
    })
  })
  describe('3.mint origin token', () => {
    describe('[success]', () => {
      it('bob mint origin token as tokenId 1', async () => {
        await expect(origin.connect(bob).mint('https://osaguild.com/origin/1'))
          .emit(origin, 'Transfer')
          .withArgs(ethers.constants.AddressZero, bob.address, 1)
        expect(await origin.connect(bob).balanceOf(bob.address)).to.be.equals(1)
        expect(await origin.connect(bob).ownerOf(1)).to.be.equals(bob.address)
      })
      it('carol mint origin token as tokenId 2', async () => {
        await expect(origin.connect(carol).mint('https://osaguild.com/origin/2'))
          .emit(origin, 'Transfer')
          .withArgs(ethers.constants.AddressZero, carol.address, 2)
        expect(await origin.connect(bob).balanceOf(bob.address)).to.be.equals(1)
        expect(await origin.connect(carol).ownerOf(2)).to.be.equals(carol.address)
      })
      it('bob mint origin token as tokenId 3', async () => {
        await expect(origin.connect(bob).mint('https://osaguild.com/origin/3'))
          .emit(origin, 'Transfer')
          .withArgs(ethers.constants.AddressZero, bob.address, 3)
        expect(await origin.connect(bob).balanceOf(bob.address)).to.be.equals(2)
        expect(await origin.connect(bob).ownerOf(3)).to.be.equals(bob.address)
      })
      it('carol mint origin token as tokenId 4', async () => {
        await expect(origin.connect(carol).mint('https://osaguild.com/origin/4'))
          .emit(origin, 'Transfer')
          .withArgs(ethers.constants.AddressZero, carol.address, 4)
        expect(await origin.connect(bob).balanceOf(bob.address)).to.be.equals(2)
        expect(await origin.connect(carol).ownerOf(4)).to.be.equals(carol.address)
      })
    })
    describe('[failed]', () => {
      it('only member can mint origin token', async () => {
        await expect(origin.connect(ellie).mint('https://osaguild.com/origin/5')).to.be.revertedWith(
          'OriginToken: not mintable'
        )
      })
      // todo: add test that burned staking token user can not mint origin token. because you are not member now.
    })
  })
  describe('4.mint fanfic token', () => {
    describe('[success]', () => {
      it('daniel mint fanfic token as tokenId 1 witch origin tokenId is 1', async () => {
        await expect(fanfic.connect(daniel).mint('https://osaguild.com/fanfic/1', [1]))
          .emit(fanfic, 'Transfer')
          .withArgs(ethers.constants.AddressZero, daniel.address, 1)
        expect(await fanfic.connect(daniel).ownerOf(1)).to.be.equals(daniel.address)
        expect(await fanfic.connect(daniel).balanceOf(daniel.address)).to.be.equals(1)
      })
      it('daniel mint fanfic token as tokenId 2 witch origin tokenId are 3 and 4', async () => {
        await expect(fanfic.connect(daniel).mint('https://osaguild.com/fanfic/2', [3, 4]))
          .emit(fanfic, 'Transfer')
          .withArgs(ethers.constants.AddressZero, daniel.address, 2)
        expect(await fanfic.connect(daniel).ownerOf(2)).to.be.equals(daniel.address)
        expect(await fanfic.connect(daniel).balanceOf(daniel.address)).to.be.equals(2)
      })
      it('daniel mint fanfic token as tokenId 3 witch origin tokenId are 2 and 3', async () => {
        await expect(fanfic.connect(daniel).mint('https://osaguild.com/fanfic/3', [2, 3]))
          .emit(fanfic, 'Transfer')
          .withArgs(ethers.constants.AddressZero, daniel.address, 3)
        expect(await fanfic.connect(daniel).ownerOf(3)).to.be.equals(daniel.address)
        expect(await fanfic.connect(daniel).balanceOf(daniel.address)).to.be.equals(3)
      })
      it('daniel mint fanfic token as tokenId 4 witch origin tokenId is 4', async () => {
        await expect(fanfic.connect(daniel).mint('https://osaguild.com/fanfic/4', [4]))
          .emit(fanfic, 'Transfer')
          .withArgs(ethers.constants.AddressZero, daniel.address, 4)
        expect(await fanfic.connect(daniel).ownerOf(4)).to.be.equals(daniel.address)
        expect(await fanfic.connect(daniel).balanceOf(daniel.address)).to.be.equals(4)
      })
    })
    describe('[failed]', () => {
      it('only member can mint fanfic token', async () => {
        await expect(fanfic.connect(ellie).mint('https://osaguild.com/fanfic/5', [1])).to.be.revertedWith(
          'FanficToken: not mintable'
        )
      })
      // todo: add test that burned staking token user can not mint fanfic token. because you are not member now.
    })
  })
  describe('5.on sale', () => {
    describe('[success]', () => {
      it('daniel approves tokenId 1 to market', async () => {
        await expect(fanfic.connect(daniel).approve(market.address, 3))
          .to.emit(fanfic, 'Approval')
          .withArgs(daniel.address, market.address, 3)
        expect(await fanfic.connect(daniel).getApproved(3)).to.be.equals(market.address)
      })
      it('daniel start sale of tokenId 3 as saleId 1', async () => {
        await expect(market.connect(daniel).startSale(3, ethers.utils.parseEther('0.01'))) // sale price is 0.01 ETH
          .to.emit(market, 'StartSale')
          .withArgs(1, 3, ethers.utils.parseEther('0.01'), daniel.address)
        sales.push({
          tokenId: 3,
          price: ethers.utils.parseEther('0.01'),
          buyer: ethers.constants.AddressZero,
          startBlock: await ethers.provider.getBlockNumber(),
          endBlock: 0,
          sold: false,
        })
        const _sale = await market.connect(daniel).sale(1)
        expect(_sale.tokenId).to.be.deep.equals(sales[0]?.tokenId)
        expect(_sale.price).to.be.deep.equals(sales[0]?.price)
        expect(_sale.buyer).to.be.deep.equals(sales[0]?.buyer)
        expect(_sale.startBlockNumber).to.be.deep.equals(sales[0]?.startBlock)
        expect(_sale.endBlockNumber).to.be.deep.equals(sales[0]?.endBlock)
        expect(_sale.isSold).to.be.equals(sales[0]?.sold)
        expect(await market.connect(daniel).totalSupply()).to.be.equals(1)
      })
      it('daniel approves tokenId 2 to market', async () => {
        await expect(fanfic.connect(daniel).approve(market.address, 2))
          .to.emit(fanfic, 'Approval')
          .withArgs(daniel.address, market.address, 2)
        expect(await fanfic.connect(daniel).getApproved(2)).to.be.equals(market.address)
      })
      it('daniel start sale of tokenId 2 as saleId 2', async () => {
        await expect(market.connect(daniel).startSale(2, ethers.utils.parseEther('0.02'))) // sale price is 0.02 ETH
          .to.emit(market, 'StartSale')
          .withArgs(2, 2, ethers.utils.parseEther('0.02'), daniel.address)
        sales.push({
          tokenId: 2,
          price: ethers.utils.parseEther('0.02'),
          buyer: ethers.constants.AddressZero,
          startBlock: await ethers.provider.getBlockNumber(),
          endBlock: 0,
          sold: false,
        })
        const _sale = await market.connect(daniel).sale(2)
        expect(_sale.tokenId).to.be.deep.equals(sales[1]?.tokenId)
        expect(_sale.price).to.be.deep.equals(sales[1]?.price)
        expect(_sale.buyer).to.be.deep.equals(sales[1]?.buyer)
        expect(_sale.startBlockNumber).to.be.deep.equals(sales[1]?.startBlock)
        expect(_sale.endBlockNumber).to.be.deep.equals(sales[1]?.endBlock)
        expect(_sale.isSold).to.be.equals(sales[1]?.sold)
        expect(await market.connect(daniel).totalSupply()).to.be.equals(2)
      })
      it('daniel approves tokenId 1 to market', async () => {
        await expect(fanfic.connect(daniel).approve(market.address, 1))
          .to.emit(fanfic, 'Approval')
          .withArgs(daniel.address, market.address, 1)
        expect(await fanfic.connect(daniel).getApproved(1)).to.be.equals(market.address)
      })
      it('daniel start sale of tokenId 1 as saleId 3', async () => {
        await expect(market.connect(daniel).startSale(1, ethers.utils.parseEther('0.03'))) // sale price is 0.02 ETH
          .to.emit(market, 'StartSale')
          .withArgs(3, 1, ethers.utils.parseEther('0.03'), daniel.address)
        sales.push({
          tokenId: 1,
          price: ethers.utils.parseEther('0.03'),
          buyer: ethers.constants.AddressZero,
          startBlock: await ethers.provider.getBlockNumber(),
          endBlock: 0,
          sold: false,
        })
        const _sale = await market.connect(daniel).sale(3)
        expect(_sale.tokenId).to.be.deep.equals(sales[2]?.tokenId)
        expect(_sale.price).to.be.deep.equals(sales[2]?.price)
        expect(_sale.buyer).to.be.deep.equals(sales[2]?.buyer)
        expect(_sale.startBlockNumber).to.be.deep.equals(sales[2]?.startBlock)
        expect(_sale.endBlockNumber).to.be.deep.equals(sales[2]?.endBlock)
        expect(_sale.isSold).to.be.equals(sales[2]?.sold)
        expect(await market.connect(daniel).totalSupply()).to.be.equals(3)
      })
    })
    describe('[failed]', () => {
      it('only owner can approve fanfic token to sale', async () => {
        await expect(fanfic.connect(ellie).approve(market.address, 4)).to.be.revertedWith(
          'ERC721: approve caller is not token owner nor approved for all'
        )
      })
      it('only approved token can be sale', async () => {
        await expect(market.connect(daniel).startSale(4, ethers.utils.parseEther('0.01'))).to.be.revertedWith(
          'Market: not approved'
        )
      })
      it('only owner can start sale', async () => {
        await expect(fanfic.connect(daniel).approve(market.address, 4))
          .to.emit(fanfic, 'Approval')
          .withArgs(daniel.address, market.address, 4)
        await expect(market.connect(ellie).startSale(4, ethers.utils.parseEther('0.01'))).to.be.revertedWith(
          'Market: not owner'
        )
      })
      it('can not start sale which have already started sale', async () => {
        await expect(market.connect(daniel).startSale(1, ethers.utils.parseEther('0.01'))).to.be.revertedWith(
          'Market: already on sale'
        )
      })
    })
  })
  describe('6.purchase', () => {
    describe('[success]', () => {
      it('ellie purchases saleId 1', async () => {
        // set balance of ETH
        const balanceOfEllie = await ethers.provider.getBalance(ellie.address)
        const balanceOfProtocol = await ethers.provider.getBalance(protocol.address)
        // tx event
        const _tx = await market.connect(ellie).purchase(1, { value: ethers.utils.parseEther('0.01') })
        await expect(_tx).to.emit(market, 'Purchase').withArgs(1, 3, ethers.utils.parseEther('0.01'), ellie.address)
        await expect(_tx).to.emit(fanfic, 'Transfer').withArgs(daniel.address, ellie.address, 3)
        await expect(_tx)
          .to.emit(protocol, 'Stake')
          .withArgs(bob.address, market.address, ethers.utils.parseEther('10'))
        await expect(_tx)
          .to.emit(protocol, 'Stake')
          .withArgs(carol.address, market.address, ethers.utils.parseEther('10'))
        await expect(_tx)
          .to.emit(protocol, 'Stake')
          .withArgs(daniel.address, market.address, ethers.utils.parseEther('80'))
        const _receipt = await ethers.provider.getTransactionReceipt(_tx.hash)
        // set gas used
        const gasUsed = _receipt.cumulativeGasUsed
        const gasPrice = _receipt.effectiveGasPrice
        // set sale
        if (sales[0]) {
          sales[0].buyer = ellie.address
          sales[0].sold = true
          sales[0].endBlock = await ethers.provider.getBlockNumber()
        }
        // check sale
        expect(await fanfic.connect(ellie).ownerOf(3)).to.be.equals(ellie.address)
        const _sale = await market.connect(ellie).sale(1)
        expect(_sale.tokenId).to.be.deep.equals(sales[0]?.tokenId)
        expect(_sale.price).to.be.deep.equals(sales[0]?.price)
        expect(_sale.buyer).to.be.deep.equals(sales[0]?.buyer)
        expect(_sale.startBlockNumber).to.be.deep.equals(sales[0]?.startBlock)
        expect(_sale.endBlockNumber).to.be.deep.equals(sales[0]?.endBlock)
        expect(_sale.isSold).to.be.equals(sales[0]?.sold)
        // check balance of ETH
        expect(await ethers.provider.getBalance(ellie.address)).to.be.deep.equals(
          balanceOfEllie.sub(ethers.utils.parseEther('0.01')).sub(gasUsed.mul(gasPrice))
        )
        expect(await ethers.provider.getBalance(protocol.address)).to.be.deep.equals(
          balanceOfProtocol.add(ethers.utils.parseEther('0.01'))
        )
        // check balance of MTE
        expect(await protocol.connect(ellie).balanceOfStaking(alice.address)).to.be.deep.equals(
          ethers.utils.parseEther('0')
        )
        expect(await protocol.connect(ellie).balanceOfStaking(bob.address)).to.be.deep.equals(
          ethers.utils.parseEther('210')
        )
        expect(await protocol.connect(ellie).balanceOfStaking(carol.address)).to.be.deep.equals(
          ethers.utils.parseEther('210')
        )
        expect(await protocol.connect(ellie).balanceOfStaking(daniel.address)).to.be.deep.equals(
          ethers.utils.parseEther('180')
        )
        // set sale
        if (sales[0]) {
          sales[0].buyer = ellie.address
          sales[0].sold = true
          sales[0].endBlock = await ethers.provider.getBlockNumber()
        }
        // set staking
        if (stakingOfBob[1]) {
          stakingOfBob[1].endBlock = await ethers.provider.getBlockNumber()
        }
        stakingOfBob.push({
          startBlock: await ethers.provider.getBlockNumber(),
          endBlock: 0,
          price: (stakingOfBob[1] as StakingInfo).price.add(ethers.utils.parseEther('10')),
        })
        if (stakingOfCarol[0]) {
          stakingOfCarol[0].endBlock = await ethers.provider.getBlockNumber()
        }
        stakingOfCarol.push({
          startBlock: await ethers.provider.getBlockNumber(),
          endBlock: 0,
          price: (stakingOfCarol[0] as StakingInfo).price.add(ethers.utils.parseEther('10')),
        })
        if (stakingOfDaniel[0]) {
          stakingOfDaniel[0].endBlock = await ethers.provider.getBlockNumber()
        }
        stakingOfDaniel.push({
          startBlock: await ethers.provider.getBlockNumber(),
          endBlock: 0,
          price: (stakingOfDaniel[0] as StakingInfo).price.add(ethers.utils.parseEther('80')),
        })
      })
      it('ellie purchases saleId 2', async () => {
        // set balance of ETH
        const balanceOfEllie = await ethers.provider.getBalance(ellie.address)
        const balanceOfProtocol = await ethers.provider.getBalance(protocol.address)
        // tx event
        const _tx = await market.connect(ellie).purchase(2, { value: ethers.utils.parseEther('0.02') })
        await expect(_tx).to.emit(market, 'Purchase').withArgs(2, 2, ethers.utils.parseEther('0.02'), ellie.address)
        await expect(_tx).to.emit(fanfic, 'Transfer').withArgs(daniel.address, ellie.address, 2)
        await expect(_tx)
          .to.emit(protocol, 'Stake')
          .withArgs(bob.address, market.address, ethers.utils.parseEther('20'))
        await expect(_tx)
          .to.emit(protocol, 'Stake')
          .withArgs(carol.address, market.address, ethers.utils.parseEther('20'))
        await expect(_tx)
          .to.emit(protocol, 'Stake')
          .withArgs(daniel.address, market.address, ethers.utils.parseEther('160'))
        const _receipt = await ethers.provider.getTransactionReceipt(_tx.hash)
        // set gas used
        const gasUsed = _receipt.cumulativeGasUsed
        const gasPrice = _receipt.effectiveGasPrice
        // set sale
        if (sales[1]) {
          sales[1].buyer = ellie.address
          sales[1].sold = true
          sales[1].endBlock = await ethers.provider.getBlockNumber()
        }
        // check sale
        expect(await fanfic.connect(ellie).ownerOf(2)).to.be.equals(ellie.address)
        const _sale = await market.connect(ellie).sale(2)
        expect(_sale.tokenId).to.be.deep.equals(sales[1]?.tokenId)
        expect(_sale.price).to.be.deep.equals(sales[1]?.price)
        expect(_sale.buyer).to.be.deep.equals(sales[1]?.buyer)
        expect(_sale.startBlockNumber).to.be.deep.equals(sales[1]?.startBlock)
        expect(_sale.endBlockNumber).to.be.deep.equals(sales[1]?.endBlock)
        expect(_sale.isSold).to.be.equals(sales[1]?.sold)
        // check balance of ETH
        expect(await ethers.provider.getBalance(ellie.address)).to.be.deep.equals(
          balanceOfEllie.sub(ethers.utils.parseEther('0.02')).sub(gasUsed.mul(gasPrice))
        )
        expect(await ethers.provider.getBalance(protocol.address)).to.be.deep.equals(
          balanceOfProtocol.add(ethers.utils.parseEther('0.02'))
        )
        // check balance of MTE
        expect(await protocol.connect(ellie).balanceOfStaking(alice.address)).to.be.deep.equals(
          ethers.utils.parseEther('0')
        )
        expect(await protocol.connect(ellie).balanceOfStaking(bob.address)).to.be.deep.equals(
          ethers.utils.parseEther('230')
        )
        expect(await protocol.connect(ellie).balanceOfStaking(carol.address)).to.be.deep.equals(
          ethers.utils.parseEther('230')
        )
        expect(await protocol.connect(ellie).balanceOfStaking(daniel.address)).to.be.deep.equals(
          ethers.utils.parseEther('340')
        )
        // set sale
        if (sales[1]) {
          sales[1].buyer = ellie.address
          sales[1].sold = true
          sales[1].endBlock = await ethers.provider.getBlockNumber()
        }
        // set staking
        if (stakingOfBob[2]) {
          stakingOfBob[2].endBlock = await ethers.provider.getBlockNumber()
        }
        stakingOfBob.push({
          startBlock: await ethers.provider.getBlockNumber(),
          endBlock: 0,
          price: (stakingOfBob[2] as StakingInfo).price.add(ethers.utils.parseEther('20')),
        })
        if (stakingOfCarol[1]) {
          stakingOfCarol[1].endBlock = await ethers.provider.getBlockNumber()
        }
        stakingOfCarol.push({
          startBlock: await ethers.provider.getBlockNumber(),
          endBlock: 0,
          price: (stakingOfCarol[1] as StakingInfo).price.add(ethers.utils.parseEther('20')),
        })
        if (stakingOfDaniel[1]) {
          stakingOfDaniel[1].endBlock = await ethers.provider.getBlockNumber()
        }
        stakingOfDaniel.push({
          startBlock: await ethers.provider.getBlockNumber(),
          endBlock: 0,
          price: (stakingOfDaniel[1] as StakingInfo).price.add(ethers.utils.parseEther('160')),
        })
      })
    })
    describe('[failed]', () => {
      it('can not purchase under the price', async () => {
        await expect(market.connect(ellie).purchase(3, { value: ethers.utils.parseEther('0.02') })).to.be.revertedWith(
          'Market: not match price'
        )
      })
      it('can not purchase over the price', async () => {
        await expect(market.connect(ellie).purchase(3, { value: ethers.utils.parseEther('0.04') })).to.be.revertedWith(
          'Market: not match price'
        )
      })
      it('only open sale can be purchased', async () => {
        await expect(market.connect(ellie).purchase(1, { value: ethers.utils.parseEther('0.01') })).to.be.revertedWith(
          'Market: already closed'
        )
      })
    })
  })
  describe('7.close sale', () => {
    describe('[failed]', () => {
      it('only owner can close sale', async () => {
        await expect(market.connect(bob).closeSale(3)).to.be.revertedWith('Market: not owner')
      })
      it('can not close already closed sale', async () => {
        await expect(market.connect(ellie).closeSale(1)).to.be.revertedWith('Market: already closed')
      })
    })
    describe('[success]', () => {
      it('daniel can close saleId 3', async () => {
        await expect(market.connect(daniel).closeSale(3)).to.emit(market, 'CloseSale').withArgs(3, 1)
        // set sale
        if (sales[2]) {
          sales[2].sold = false
          sales[2].endBlock = await ethers.provider.getBlockNumber()
        }
        const _sale = await market.connect(carol).sale(3)
        expect(_sale.tokenId).to.be.deep.equals(sales[2]?.tokenId)
        expect(_sale.price).to.be.deep.equals(sales[2]?.price)
        expect(_sale.buyer).to.be.deep.equals(sales[2]?.buyer)
        expect(_sale.startBlockNumber).to.be.deep.equals(sales[2]?.startBlock)
        expect(_sale.endBlockNumber).to.be.deep.equals(sales[2]?.endBlock)
        expect(_sale.isSold).to.be.equals(sales[2]?.sold)
      })
      it('can not purchase after closing', async () => {
        await expect(market.connect(daniel).purchase(3, { value: ethers.utils.parseEther('0.03') })).to.be.revertedWith(
          'Market: already closed'
        )
      })
    })
  })
  describe('8.check balance of staking', () => {
    describe('[success]', () => {
      it('alice', async () => {
        expect(await protocol.connect(alice).balanceOfStaking(alice.address)).to.be.deep.equals(0)
        expect(await protocol.connect(alice).balanceOfReward(alice.address)).to.be.deep.equals(0)
      })
      it('bob', async () => {
        expect(await protocol.connect(bob).balanceOfStaking(bob.address)).to.be.deep.equals(
          ethers.utils.parseEther('230')
        )
        let totalReward = BigNumber.from(0)
        for (let i = 0; i < stakingOfBob.length; i++) {
          if ((stakingOfBob[i]?.endBlock as number) === 0) {
            const blockDiff = (await ethers.provider.getBlockNumber()) - (stakingOfBob[i]?.startBlock as number)
            totalReward = totalReward.add((stakingOfBob[i]?.price as BigNumber).mul(blockDiff).div(5))
          } else {
            const blockDiff = (stakingOfBob[i]?.endBlock as number) - (stakingOfBob[i]?.startBlock as number)
            totalReward = totalReward.add((stakingOfBob[i]?.price as BigNumber).mul(blockDiff).div(5))
          }
        }
        expect(await protocol.connect(bob).balanceOfReward(bob.address)).to.be.deep.equals(totalReward)
      })
      it('carol', async () => {
        expect(await protocol.connect(carol).balanceOfStaking(carol.address)).to.be.deep.equals(
          ethers.utils.parseEther('230')
        )
        let totalReward = BigNumber.from(0)
        for (let i = 0; i < stakingOfCarol.length; i++) {
          if ((stakingOfCarol[i]?.endBlock as number) === 0) {
            const blockDiff = (await ethers.provider.getBlockNumber()) - (stakingOfCarol[i]?.startBlock as number)
            totalReward = totalReward.add((stakingOfCarol[i]?.price as BigNumber).mul(blockDiff).div(5))
          } else {
            const blockDiff = (stakingOfCarol[i]?.endBlock as number) - (stakingOfCarol[i]?.startBlock as number)
            totalReward = totalReward.add((stakingOfCarol[i]?.price as BigNumber).mul(blockDiff).div(5))
          }
        }
        expect(await protocol.connect(carol).balanceOfReward(carol.address)).to.be.deep.equals(totalReward)
      })
      it('daniel', async () => {
        expect(await protocol.connect(daniel).balanceOfStaking(daniel.address)).to.be.deep.equals(
          ethers.utils.parseEther('340')
        )
        let totalReward = BigNumber.from(0)
        for (let i = 0; i < stakingOfDaniel.length; i++) {
          if ((stakingOfDaniel[i]?.endBlock as number) === 0) {
            const blockDiff = (await ethers.provider.getBlockNumber()) - (stakingOfDaniel[i]?.startBlock as number)
            totalReward = totalReward.add((stakingOfDaniel[i]?.price as BigNumber).mul(blockDiff).div(5))
          } else {
            const blockDiff = (stakingOfDaniel[i]?.endBlock as number) - (stakingOfDaniel[i]?.startBlock as number)
            totalReward = totalReward.add((stakingOfDaniel[i]?.price as BigNumber).mul(blockDiff).div(5))
          }
        }
        expect(await protocol.connect(daniel).balanceOfReward(daniel.address)).to.be.deep.equals(totalReward)
      })
    })
  })
  describe('9.withdraw', () => {
    // todo: withdraw is not implemented yet
  })
})
