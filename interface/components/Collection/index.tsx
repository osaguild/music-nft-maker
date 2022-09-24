import { FunctionComponent, useEffect, useState } from 'react'
import { Wrap, WrapItem } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { providers } from 'ethers'
import { Erc721Item } from './Erc721Item'
import { SaleItem } from './SaleItem'
import { useContract } from '../../hooks/Contract'
import { fetchOnSales, fetchOwns } from '../../lib/fetch'
import { isSale } from '../../types/typeGuard'

interface CollectionProps {
  pattern: Pattern
}

type Pattern = 'ON_SALE' | 'CREATED'

const Collection: FunctionComponent<CollectionProps> = ({ pattern }) => {
  const [items, setItems] = useState<Erc721[] | Sale[]>([])
  const { account } = useWeb3React<providers.Web3Provider>()
  const { originToken, fanficToken, market } = useContract()

  useEffect(() => {
    if (pattern === 'ON_SALE' && market && fanficToken) {
      fetchOnSales(market, fanficToken).then((e) => setItems(e))
    } else if (pattern === 'CREATED' && account && originToken && fanficToken) {
      fetchOwns(originToken, fanficToken, account).then((e) => setItems(e))
    }
  }, [pattern, account, originToken, fanficToken, market])

  return items ? (
    <Wrap spacing="30px" justify="center" my="30">
      {items.map((e, i) => (
        <WrapItem border="2px" className="web3-background" data-testid={`item-${e.id}`} key={i}>
          {isSale(e) ? <SaleItem sale={e} /> : <Erc721Item erc721={e} />}
        </WrapItem>
      ))}
    </Wrap>
  ) : (
    <></>
  )
}

export { Collection }
