import { OriginToken, FanficToken, Market } from '../typechain-types'
import { ethers } from 'ethers'

const fetchOrigin = async (originToken: OriginToken, id: number) => {
  return {
    id: id,
    uri: await originToken.tokenURI(id),
    owner: await originToken.ownerOf(id),
  } as Origin
}

const fetchFanfic = async (fanficToken: FanficToken, id: number) => {
  return {
    id: id,
    uri: await fanficToken.tokenURI(id),
    owner: await fanficToken.ownerOf(id),
    originIds: (await fanficToken.origins(id)).map((e) => e.toNumber()),
  } as Fanfic
}

const fetchSale = async (market: Market, fanficToken: FanficToken, id: number) => {
  const _sale = await market.sale(id)
  return {
    id: id,
    price: Number(ethers.utils.formatEther(_sale.price)),
    buyer: _sale.buyer,
    startBlockNumber: _sale.startBlockNumber.toNumber(),
    endBlockNumber: _sale.endBlockNumber.toNumber(),
    isSold: _sale.isSold,
    fanficToken: await fetchFanfic(fanficToken, _sale.tokenId.toNumber()),
  } as Sale
}

const fetchAllOrigins = async (originToken: OriginToken) => {
  const _currentId = (await originToken.totalSupply()).toNumber()
  if (_currentId === 0) {
    return []
  } else {
    const _ids = [...Array(_currentId)].map((_, i) => i + 1)
    const _promises = _ids.map(async (id) => await fetchOrigin(originToken, id))
    return await Promise.all(_promises)
  }
}

const fetchAllFanfics = async (fanficToken: FanficToken) => {
  const _currentId = (await fanficToken.totalSupply()).toNumber()
  if (_currentId === 0) {
    return []
  } else {
    const _ids = [...Array(_currentId)].map((_, i) => i + 1)
    const _promises = _ids.map(async (id) => await fetchFanfic(fanficToken, id))
    return await Promise.all(_promises)
  }
}

const fetchAllSales = async (market: Market, fanficToken: FanficToken) => {
  const _currentId = (await market.totalSupply()).toNumber()
  if (_currentId === 0) {
    return []
  } else {
    const _ids = [...Array(_currentId)].map((_, i) => i + 1)
    const _promises = _ids.map(async (id) => await fetchSale(market, fanficToken, id))
    return await Promise.all(_promises)
  }
}

const fetchOnSales = async (market: Market, fanficToken: FanficToken) => {
  const _sales = await fetchAllSales(market, fanficToken)
  return _sales
    .map((e) => (e.endBlockNumber === 0 ? e : undefined))
    .filter((e): e is Exclude<typeof e, undefined> => e !== undefined)
}

const fetchOwns = async (originToken: OriginToken, fanficToken: FanficToken, owner: string) => {
  const _tokens: Erc721[] = (await fetchAllOrigins(originToken)).concat(await fetchAllFanfics(fanficToken))
  return _tokens
    .map((e) => (e.owner == owner ? e : undefined))
    .filter((e): e is Exclude<typeof e, undefined> => e !== undefined)
}

export { fetchOrigin, fetchFanfic, fetchSale, fetchAllOrigins, fetchAllFanfics, fetchAllSales, fetchOnSales, fetchOwns }
