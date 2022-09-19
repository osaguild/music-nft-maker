import { FunctionComponent, useEffect, useState } from 'react'
import { Wrap, WrapItem } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { providers } from 'ethers'
import { Item } from './Item'
import { useContract } from '../../hooks/Contract'

interface CollectionProps {
  pattern: Pattern
}

type Pattern = 'ON_SALE' | 'CREATED'

const Collection: FunctionComponent<CollectionProps> = ({ pattern }) => {
  const [tokens, setTokens] = useState<Erc721[]>([])
  const { account } = useWeb3React<providers.Web3Provider>()
  const { originToken, fanficToken } = useContract()

  const fetchOriginTokens = async () => {
    const _totalSupply = await originToken?.totalSupply()
    if (!_totalSupply || _totalSupply?.toNumber() === 0) {
      return []
    } else {
      const _ids = [...Array(_totalSupply?.toNumber())].map((_, i) => i + 1)
      const _promises = _ids.map(async (e) => {
        return {
          id: e,
          uri: await originToken?.tokenURI(e),
          owner: await originToken?.ownerOf(e),
        } as OriginToken
      })
      return await Promise.all(_promises)
    }
  }

  const fetchFanficTokens = async () => {
    const _totalSupply = await fanficToken?.totalSupply()
    if (!_totalSupply || _totalSupply?.toNumber() === 0) {
      return []
    } else {
      const _ids = [...Array(_totalSupply?.toNumber())].map((_, i) => i + 1)
      const _promises = _ids.map(async (e) => {
        return {
          id: e,
          uri: await fanficToken?.tokenURI(e),
          owner: await fanficToken?.ownerOf(e),
          originIds: [],
          saleInfo: [],
        } as FanficToken
      })
      return await Promise.all(_promises)
    }
  }

  const onSaleTokens = async () => {
    return [] as Erc721[]
  }

  const createdTokens = async (owner: string) => {
    const _tokens: Erc721[] = (await fetchOriginTokens()).concat(await fetchFanficTokens())
    _tokens.map((e) => (e.owner == owner ? e : null))
    return _tokens
  }

  useEffect(() => {
    if (pattern === 'ON_SALE') {
      onSaleTokens().then((e) => setTokens(e))
    } else if (pattern === 'CREATED' && account) {
      createdTokens(account).then((e) => setTokens(e))
    }
  }, [pattern, account, originToken, fanficToken])

  return (
    <>
      <Wrap spacing="30px" justify="center" my="50">
        {tokens ? (
          tokens.map((e, i) => (
            <WrapItem border="2px" className="web3-background" data-testid={`item-${e.id}`} key={i}>
              <Item token={e} pattern={pattern} />
            </WrapItem>
          ))
        ) : (
          <></>
        )}
      </Wrap>
    </>
  )
}

export { Collection }
export type { Pattern }
