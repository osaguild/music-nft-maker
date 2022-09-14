import { ethers } from 'hardhat'
import { expect } from 'chai'
import { ERC2981MultipleRoyalties } from '../typechain-types'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { RoyaltyInfo, Address, calcRoyalty, printRoyalty } from './utils'

describe('ERC2981MultipleRoyalties.sol', () => {
  const defaultRoyalty: RoyaltyInfo = {
    receiver: '', // set alice in before()
    fraction: 1000, // 10%
  }
  const bobRoyalty: RoyaltyInfo = {
    receiver: '', // set bob in before()
    fraction: 2000, // 20%
  }
  const carolRoyalty: RoyaltyInfo = {
    receiver: '', // set carol in before()
    fraction: 3000, // 30%
  }
  const addresses: Address[] = []
  let owner: SignerWithAddress
  let alice: SignerWithAddress
  let bob: SignerWithAddress
  let carol: SignerWithAddress
  let erc2981: ERC2981MultipleRoyalties

  before(async () => {
    // signers
    const _signers = await ethers.getSigners()
    owner = _signers[0] as SignerWithAddress
    alice = _signers[1] as SignerWithAddress
    bob = _signers[2] as SignerWithAddress
    carol = _signers[3] as SignerWithAddress
    // set constants
    defaultRoyalty.receiver = alice.address
    bobRoyalty.receiver = bob.address
    carolRoyalty.receiver = carol.address
    addresses.push({ name: 'alice', address: alice.address })
    addresses.push({ name: 'bob', address: bob.address })
    addresses.push({ name: 'carol', address: carol.address })
    // deploy
    const _factory = await ethers.getContractFactory('ERC2981MultipleRoyalties')
    erc2981 = await _factory.deploy(owner.address, defaultRoyalty.receiver, defaultRoyalty.fraction)
  })
  it('check default royalty of 1000 price, tokenId is 1', async () => {
    const [_receivers, _amounts] = await erc2981.royaltyInfo(1, 1000)
    expect(_receivers[0]).to.be.equals(defaultRoyalty.receiver)
    expect(_amounts[0]).to.be.equals(calcRoyalty(defaultRoyalty, 1000))
    printRoyalty(addresses, _receivers, _amounts, 1, 1000)
  })
  it('add royalty info of bob, tokenId is 1', async () => {
    await expect(erc2981.addRoyaltyInfo(1, bobRoyalty.receiver, bobRoyalty.fraction))
      .emit(erc2981, 'AddRoyaltyInfo')
      .withArgs(1, bobRoyalty.receiver, bobRoyalty.fraction)
    const [_receivers, _amounts] = await erc2981.royaltyInfo(1, 1000)
    expect(_receivers[1]).to.be.equals(bob.address)
    expect(_amounts[1]).to.be.equals(calcRoyalty(bobRoyalty, 1000))
    printRoyalty(addresses, _receivers, _amounts, 1, 1000)
  })
  it('add royalty info of carol, tokenId is 1', async () => {
    await expect(erc2981.addRoyaltyInfo(1, carolRoyalty.receiver, carolRoyalty.fraction))
      .emit(erc2981, 'AddRoyaltyInfo')
      .withArgs(1, carolRoyalty.receiver, carolRoyalty.fraction)
    const [_receivers, _amounts] = await erc2981.royaltyInfo(1, 1000)
    expect(_receivers[2]).to.be.equals(carol.address)
    expect(_amounts[2]).to.be.equals(calcRoyalty(carolRoyalty, 1000))
    printRoyalty(addresses, _receivers, _amounts, 1, 1000)
  })
  it('add royalty info of carol, tokenId is 2', async () => {
    await expect(erc2981.addRoyaltyInfo(2, carolRoyalty.receiver, carolRoyalty.fraction))
      .emit(erc2981, 'AddRoyaltyInfo')
      .withArgs(2, carolRoyalty.receiver, carolRoyalty.fraction)
    const [_receivers, _amounts] = await erc2981.royaltyInfo(2, 1000)
    expect(_receivers[1]).to.be.equals(carol.address)
    expect(_amounts[1]).to.be.equals(calcRoyalty(carolRoyalty, 1000))
    printRoyalty(addresses, _receivers, _amounts, 2, 1000)
  })
  it('add over denominator royalty fee will reverted, tokenId is 2', async () => {
    await expect(erc2981.addRoyaltyInfo(2, carol.address, 10001)).to.be.revertedWith('ERC2981: over denominator')
  })
  it('add over total royalty fee will reverted, tokenId is 2', async () => {
    await expect(erc2981.addRoyaltyInfo(2, carol.address, 6001)).to.be.revertedWith('ERC2981: over total royalty fee')
  })
  it('delete royalty of tokenId 2', async () => {
    await expect(erc2981.resetTokenRoyalty(2)).emit(erc2981, 'ResetTokenRoyalty').withArgs(2)
    const [_receivers, _amounts] = await erc2981.royaltyInfo(2, 1000)
    expect(_receivers[0]).to.be.equals(defaultRoyalty.receiver)
    expect(_amounts[0]).to.be.equals(calcRoyalty(defaultRoyalty, 1000))
    expect(_receivers[1]).to.be.equals(undefined)
    expect(_amounts[1]).to.be.equals(undefined)
    printRoyalty(addresses, _receivers, _amounts, 2, 1000)
  })
  it('delete default royalty', async () => {
    await expect(erc2981.deleteDefaultRoyalty()).emit(erc2981, 'DeleteDefaultRoyalty')
    const [_receivers, _amounts] = await erc2981.royaltyInfo(1, 1000)
    expect(_receivers[0]).to.be.equals(bobRoyalty.receiver)
    expect(_amounts[0]).to.be.equals(calcRoyalty(bobRoyalty, 1000))
    expect(_receivers[1]).to.be.equals(carolRoyalty.receiver)
    expect(_amounts[1]).to.be.equals(calcRoyalty(carolRoyalty, 1000))
    printRoyalty(addresses, _receivers, _amounts, 1, 1000)
    const [receivers_, amounts_] = await erc2981.royaltyInfo(2, 1000)
    expect(receivers_[0]).to.be.equals(undefined)
    expect(amounts_[0]).to.be.equals(undefined)
    printRoyalty(addresses, receivers_, amounts_, 2, 1000)
  })
  it('delete royalty of tokenId 1', async () => {
    await erc2981.resetTokenRoyalty(1)
    const [_receivers, _amounts] = await erc2981.royaltyInfo(1, 1000)
    expect(_receivers[0]).to.be.equals(undefined)
    expect(_amounts[0]).to.be.equals(undefined)
    printRoyalty(addresses, _receivers, _amounts, 1, 1000)
  })
})
