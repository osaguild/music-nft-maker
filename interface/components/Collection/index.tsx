import { FunctionComponent, useEffect, useState } from 'react'
import { Wrap, WrapItem } from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core'
import { providers } from 'ethers'
import { useOriginNft, useFanficNft } from '../../hooks/Nft'
import { Item } from './Item'

interface CollectionProps {
  pattern: 'ON_SALE' | 'CREATED' | 'OWN'
}

const Collection: FunctionComponent<CollectionProps> = ({ pattern }) => {
  const [nfts, setNfts] = useState<Nft[]>([])
  const { account } = useWeb3React<providers.Web3Provider>()
  const originNft = useOriginNft()
  const fanficNfts = useFanficNft()

  useEffect(() => {
    if (pattern === 'ON_SALE') {
      setNfts(originNft.concat(fanficNfts).filter((nft) => nft.onSale))
    } else if (pattern === 'CREATED') {
      setNfts(
        originNft.concat(fanficNfts).filter((nft) => {
          return nft.author === account ? nft : undefined
        })
      )
    } else if (pattern === 'OWN') {
      setNfts(
        originNft.concat(fanficNfts).filter((nft) => {
          return nft.owner === account ? nft : undefined
        })
      )
    }
  }, [pattern, account, originNft, fanficNfts])

  return (
    <>
      <Wrap spacing="30px" justify="center" my="50">
        {nfts ? (
          nfts.map((e, i) => (
            <WrapItem border="2px" className="web3-background" data-testid={`item-${i}`} key={i}>
              <Item nft={e} saleable={pattern === 'ON_SALE' ? true : false} />
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
