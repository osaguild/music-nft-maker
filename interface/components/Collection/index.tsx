import { FunctionComponent, useEffect, useState } from 'react'
import { Wrap, WrapItem } from '@chakra-ui/react'
import { useOnSaleMusics, useOwnMusics } from '../../hooks/Music'
import { useOnSalePlayLists, useOwnPlayLists } from '../../hooks/PlayList'
import { Item } from './Item'

interface CollectionProps {
  pattern: 'MARKET' | 'CREATOR' | 'FAN'
}

const Collection: FunctionComponent<CollectionProps> = ({ pattern }) => {
  const [nfts, setNfts] = useState<Nft[]>([])
  const onSaleMusics = useOnSaleMusics()
  const onSalePlayLists = useOnSalePlayLists()
  const ownMusics = useOwnMusics()
  const ownPlayLists = useOwnPlayLists()

  useEffect(() => {
    if (pattern === 'MARKET') setNfts(onSaleMusics.concat(onSalePlayLists))
    else if (pattern === 'CREATOR') setNfts(ownMusics)
    else setNfts(ownPlayLists)
  }, [onSaleMusics, onSalePlayLists, ownMusics, ownPlayLists, pattern])

  return (
    <>
      <Wrap spacing="30px" justify="center" my="50">
        {nfts ? (
          nfts.map((e, i) => (
            <WrapItem border="2px" className="web3-background" data-testid={`item-${i}`} key={i}>
              <Item nft={e} saleable={pattern === 'MARKET' ? true : false} />
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
