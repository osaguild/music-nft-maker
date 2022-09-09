import { FunctionComponent } from 'react'
import { Container, Text } from '@chakra-ui/react'
import { Alert } from '../Alert'
import { Header } from './Header'
import { Collection } from '../Collection'
import { Footer } from './Footer'
import { Join } from '../Join'
import { Portfolio } from '../Portfolio'
import { NftMaker } from '../NftMaker'

interface LayoutProps {
  pattern: 'TOP' | 'CREATOR' | 'FAN'
  children?: React.ReactNode
}

const Layout: FunctionComponent<LayoutProps> = ({ pattern }) => {
  return (
    <>
      <Alert />
      <Header />
      <Container maxW="container.lg">
        {pattern === 'TOP' && (
          <>
            <Text fontSize="6xl" textAlign="center" my="30" className="web3-title" data-testid="text">
              Music Token Economy
            </Text>
            <Join />
            <Text fontSize="2xl" textAlign="center" my="30">
              Market
            </Text>
            <Collection pattern="MARKET" />
          </>
        )}
        {pattern === 'CREATOR' && (
          <>
            <Portfolio />
            <Text fontSize="2xl" my="30">
              Created Music
            </Text>
            <NftMaker />
            <Collection pattern="CREATOR" />
          </>
        )}
        {pattern === 'FAN' && (
          <>
            <Portfolio />
            <Text fontSize="2xl" my="30">
              Created Play List
            </Text>
            <NftMaker />
            <Collection pattern="FAN" />
          </>
        )}
      </Container>
      <Footer />
    </>
  )
}

export { Layout }
