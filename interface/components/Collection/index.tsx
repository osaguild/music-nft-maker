import { FunctionComponent } from 'react'
import { Wrap, WrapItem } from '@chakra-ui/react'
import { isFanfic } from '../../types/typeGuard'
import { SaleItem } from '../Item/SaleItem'
import { FanficItem } from '../Item/FanficItem'
import { OriginItem } from '../Item/OriginItem'
interface CollectionProps {
  pattern: Pattern
  items: Sale[] | Erc721[]
}

type Pattern = 'ON_SALE' | 'OWN_TOKEN' | 'RELATED_ORIGIN'

const Collection: FunctionComponent<CollectionProps> = ({ pattern, items }) => {
  return (
    <Wrap spacing="30px" justify="center">
      {items.map((e, i) => (
        <WrapItem key={i}>
          {pattern === 'ON_SALE' ? (
            <SaleItem sale={e as Sale} />
          ) : pattern === 'OWN_TOKEN' && !isFanfic(e as Erc721) ? (
            <OriginItem origin={e as Origin} />
          ) : pattern === 'OWN_TOKEN' && isFanfic(e as Erc721) ? (
            <FanficItem fanfic={e as Fanfic} />
          ) : pattern === 'RELATED_ORIGIN' ? (
            <OriginItem origin={e as Origin} />
          ) : (
            <></>
          )}
        </WrapItem>
      ))}
    </Wrap>
  )
}

export { Collection }
