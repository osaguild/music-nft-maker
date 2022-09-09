import { FunctionComponent } from 'react'
import { Container, Text } from '@chakra-ui/react'
import { Alert } from '../Alert'
import { Header } from './Header'
import { Market } from '../Market'
import { Footer } from './Footer'
import { Join } from '../Join'
import { Portfolio } from '../Portfolio'

interface LayoutProps {
  pattern: LayoutPattern
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
            <Market />
          </>
        )}
        {pattern === 'MEMBER' && (
          <>
            <Portfolio />
          </>
        )}
      </Container>
      <Footer />
    </>
  )
}

export { Layout }
