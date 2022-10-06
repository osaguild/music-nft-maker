import { FunctionComponent } from 'react'
import { Flex, Text, Spacer, Link } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { Wallet } from '@osaguild/wallet'
import { networks } from '../../config'

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
      <Wallet networks={networks} />
    </Flex>
  )
}

export { Header }
