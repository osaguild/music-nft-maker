import { FunctionComponent } from 'react'
import { Container, Box } from '@chakra-ui/react'
import { Header } from './Header'
import { Content } from '../Content'
import { Footer } from './Footer'

const Layout: FunctionComponent = () => {
  return (
    <Box>
      <Header />
      <Container maxW="container.lg">
        <Content />
      </Container>
      <Footer />
    </Box>
  )
}

export { Layout }
