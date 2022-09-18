import { FunctionComponent } from 'react'
import { Button, Container, Text, Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { Alert } from '../Alert'
import { Header } from './Header'
import { Collection } from '../Collection'
import { Footer } from './Footer'
import { Join } from '../Join'
import { Portfolio } from '../Portfolio'
import { NftMaker } from '../NftMaker'

interface LayoutProps {
  pattern: 'TOP' | 'MEMBER'
  children?: React.ReactNode
}

const Layout: FunctionComponent<LayoutProps> = ({ pattern }) => {
  const router = useRouter()

  return (
    <>
      <Alert />
      <Header />
      <Container maxW="container.lg">
        {pattern === 'TOP' && (
          <Box textAlign="center">
            <Text fontSize="6xl" textAlign="center" my="30" className="web3-title" data-testid="text">
              Music Token Economy
            </Text>
            <Button onClick={() => router.push('/member')}>member</Button>
            <Join />
            <Text fontSize="2xl" textAlign="center" my="30">
              Market
            </Text>
            <Collection pattern="ON_SALE" />
          </Box>
        )}
        {pattern === 'MEMBER' && (
          <Box textAlign="center">
            <Portfolio />
            <Text fontSize="2xl" my="30">
              Created Music
            </Text>
            <NftMaker />
            <Collection pattern="CREATED" />
          </Box>
        )}
      </Container>
      <Footer />
    </>
  )
}

export { Layout }
