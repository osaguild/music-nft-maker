import { FunctionComponent, useEffect, useState } from 'react'
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
  Image,
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
  const [image, setImage] = useState<string>()

  const purchase = async () => {
    const tx = await market?.purchase(sale.id, { value: ethers.utils.parseEther(sale.price.toString()) })
    const receipt = await tx?.wait()
    const start = receipt?.events?.find((v) => v.event === 'Purchase')
    if (start === undefined) throw new Error('purchase event is not found')
  }

  useEffect(() => {
    if (sale) {
      console.log('fanfic uri:', sale.fanficToken.uri)
      fetch(sale.fanficToken.uri)
        .then((res) => res.json())
        .then((json) => {
          setImage(json.image)
        })
    }
  }, [sale])

  return (
    <Box textAlign="center" w="350px" h="350px">
      <Text fontSize="xl" textAlign="center" position="absolute" height="30px" color="black" w="350px">
        {`id: ${sale.id} / price:${sale.price} ETH`}
      </Text>
      <Button onClick={onOpen} position="absolute" color="black" mt="300px">
        Purchase
      </Button>
      <Image src={image} />
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
