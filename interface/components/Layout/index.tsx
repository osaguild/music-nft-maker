import { FunctionComponent } from 'react'
import { Container, Box, Text } from '@chakra-ui/react'
import { Header } from './Header'
import { Market } from '../Market'
import { Footer } from './Footer'
import { Join } from '../Join'

interface LayoutProps {
  pattern: LayoutPattern
  children?: React.ReactNode
}

const Layout: FunctionComponent<LayoutProps> = ({ pattern }) => {
  return (
    <>
      <Header />
      <Container maxW="container.lg">
        {pattern === 'TOP' && (
          <Box>
            <Text fontSize="6xl" textAlign="center" my="30" className="web3-title" data-testid="text">
              Music Token Economy
            </Text>
            <Join />
            <Market />
          </Box>
        )}
      </Container>
      <Footer />
    </>
  )
}

export { Layout }
