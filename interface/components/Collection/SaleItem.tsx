import { FunctionComponent } from 'react'
import {
  Box,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { useContract } from '../../hooks/Contract'
import { ethers } from 'ethers'

interface SaleItemProps {
  sale: Sale
}

const SaleItem: FunctionComponent<SaleItemProps> = ({ sale }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { market } = useContract()

  const purchase = async () => {
    const tx = await market?.purchase(sale.id, { value: ethers.utils.parseEther(sale.price.toString()) })
    const receipt = await tx?.wait()
    const start = receipt?.events?.find((v) => v.event === 'Purchase')
    if (start === undefined) throw new Error('purchase event is not found')
  }

  return (
    <Box textAlign="center" w="300px" h="300px">
      <Text fontSize="xl" textAlign="center" my="30">
        {sale.id}
      </Text>
      <Text fontSize="xl" textAlign="center" my="30">
        {`${sale.price} ETH`}
      </Text>
      <Button onClick={onOpen}>Purchase</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Form</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize="xl" textAlign="center" my="30">
              {`sale price: ${sale.price} ETH`}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={purchase}>Purchase</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export { SaleItem }
