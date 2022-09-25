import { FunctionComponent, useEffect, useState } from 'react'
import { Container, Text, Box } from '@chakra-ui/react'
import { Alert } from '../Alert'
import { Header } from './Header'
import { Collection } from '../Collection'
import { Footer } from './Footer'
import { Join } from '../Join'
import { Portfolio } from '../Portfolio'
import { NftMaker } from '../NftMaker'
import { useContract } from '../../hooks/Contract'
import { fetchOnSales, fetchOwns } from '../../lib/fetch'
import { useWeb3React } from '@web3-react/core'

interface LayoutProps {
  pattern: 'TOP' | 'MEMBER'
  children?: React.ReactNode
}

const Layout: FunctionComponent<LayoutProps> = ({ pattern }) => {
  const { originToken, fanficToken, market } = useContract()
  const [items, setItems] = useState<Erc721[] | Sale[]>([])
  const { account } = useWeb3React()

  useEffect(() => {
    if (market && fanficToken && originToken && account) {
      if (pattern === 'TOP') {
        fetchOnSales(market, fanficToken).then((e) => setItems(e))
      } else if (pattern === 'MEMBER') {
        fetchOwns(originToken, fanficToken, account).then((e) => setItems(e))
      }
    }
  }, [pattern, account, originToken, fanficToken, market])

  return (
    <>
      <Alert />
      <Header />
      <Container maxW="container.lg">
        {pattern === 'TOP' ? (
          <Box textAlign="center">
            <Text fontSize="6xl" textAlign="center" my="30" className="web3-title" data-testid="text">
              Music Token Economy
            </Text>
            <Join />
            <Text fontSize="3xl" textAlign="center" mt="50" className="web3-title">
              Market Place
            </Text>
            <Collection pattern="SALE" items={items} />
          </Box>
        ) : pattern === 'MEMBER' ? (
          <Box textAlign="center">
            <Portfolio />
            <Text fontSize="2xl" my="30">
              Created Music
            </Text>
            <NftMaker />
            <Collection pattern="ERC721" items={items} />
          </Box>
        ) : (
          <></>
        )}
      </Container>
      <Footer />
    </>
  )
}

export { Layout }
