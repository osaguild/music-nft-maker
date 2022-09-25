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

type Pattern = 'SALE' | 'ERC721'

const Collection: FunctionComponent<CollectionProps> = ({ pattern, items }) => {
  return (
    <Wrap spacing="30px" justify="center" mt="10">
      {items.map((e, i) => (
        <WrapItem key={i}>
          {pattern === 'SALE' ? (
            <SaleItem sale={e as Sale} />
          ) : pattern === 'ERC721' && !isFanfic(e as Erc721) ? (
            <OriginItem origin={e as Origin} />
          ) : pattern === 'ERC721' && isFanfic(e as Erc721) ? (
            <FanficItem fanfic={e as Fanfic} />
          ) : (
            <></>
          )}
        </WrapItem>
      ))}
    </Wrap>
  )
}

export { Collection }
