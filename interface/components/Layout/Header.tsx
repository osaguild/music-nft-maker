import { FunctionComponent } from 'react'
import { Flex, Text, Spacer, Link } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { Wallet } from '../Wallet'

const Header: FunctionComponent = () => {
  const router = useRouter()

  return (
    <Flex>
      <Link onClick={() => router.push('/')}>
        <Text fontSize="xl" fontWeight="bold" px={5} py={3}>
          Demo
        </Text>
      </Link>
      <Spacer />
      <Wallet />
    </Flex>
  )
}

export { Header }
