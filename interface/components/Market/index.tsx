import { FunctionComponent } from 'react'
import { Wrap, WrapItem, Text } from '@chakra-ui/react'
import { useOnSaleMusics } from '../../hooks/Music'
import { useOnSalePlayLists } from '../../hooks/PlayList'
import { Nft } from '../Nft'

const Market: FunctionComponent = () => {
  const musics = useOnSaleMusics()
  const playLists = useOnSalePlayLists()

  return (
    <>
      <Text fontSize="2xl" textAlign="center" my="30">
        Market
      </Text>
      <Wrap spacing="30px" justify="center" my="50">
        {musics ? (
          musics.map((e, i) => (
            <WrapItem border="2px" className="web3-background" data-testid={`item-${i}`} key={i}>
              <Nft nft={e} />
            </WrapItem>
          ))
        ) : (
          <></>
        )}
        {playLists ? (
          musics.map((e, i) => (
            <WrapItem border="2px" className="web3-background" data-testid={`item-${i}`} key={i}>
              <Nft nft={e} />
            </WrapItem>
          ))
        ) : (
          <></>
        )}
      </Wrap>
    </>
  )
}

export { Market }
