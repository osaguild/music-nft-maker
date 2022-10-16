import { FunctionComponent } from 'react'
import { Flex, Text, Spacer, Link } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { Wallet, EventType } from '@osaguild/wallet'
import { networks } from '../../config'
import { useAlertProvider } from '../../hooks/AlertContext'

const Header: FunctionComponent = () => {
  const router = useRouter()
  const { setAlert } = useAlertProvider()

  const callback = (eventType: EventType, message: string) => {
    if (eventType === 'CONNECT_ERROR' || eventType === 'UNKNOWN_ERROR' || eventType === 'SWITCH_NETWORK_ERROR') {
      if (setAlert) setAlert({ message, status: 'error' })
    }
  }

  return (
    <Flex bg="bg">
      <Link onClick={() => router.push('/')}>
        <Text fontSize="xl" fontWeight="bold" px={5} py={3}>
          Demo
        </Text>
      </Link>
      <Spacer />
      <Wallet networks={networks} callback={callback} />
    </Flex>
  )
}

export { Header }
