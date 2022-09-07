import { FunctionComponent } from 'react'
import { Flex, Text, Spacer } from '@chakra-ui/react'
import { Wallet } from '../Wallet'

const Header: FunctionComponent = () => {
  return (
    <Flex>
      <Text fontSize="xl" fontWeight="bold" px={5} py={3}>
        Demo
      </Text>
      <Spacer />
      <Wallet />
    </Flex>
  )
}

export { Header }
