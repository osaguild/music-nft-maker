import { FunctionComponent, useState } from 'react'
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
  InputGroup,
  Input,
  InputRightAddon,
  useDisclosure,
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useContract } from '../../hooks/Contract'
import { isFanfic } from '../../types/typeGuard'

interface Erc721ItemProps {
  erc721: Erc721
}

const Erc721Item: FunctionComponent<Erc721ItemProps> = ({ erc721 }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [price, setPrice] = useState('0.01')
  const { market } = useContract()

  const startSale = async () => {
    const tx = await market?.startSale(erc721.id, ethers.utils.parseEther(price))
    const receipt = await tx?.wait()
    const start = receipt?.events?.find((v) => v.event === 'StartSale')
    if (start === undefined) throw new Error('start sale event is not found')
  }

  return (
    <Box textAlign="center" w="300px" h="300px">
      <Text fontSize="xl" textAlign="center" my="30">
        {isFanfic(erc721) ? `Fanfic Token ${erc721.id} ` : `Origin Token ${erc721.id}`}
      </Text>
      {isFanfic(erc721) && (
        <>
          <Button onClick={onOpen}>Exhibit</Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Form</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <InputGroup size="sm">
                  <Input placeholder="value of ETH" value={price} onChange={(e) => setPrice(e.target.value)} />
                  <InputRightAddon>ETH</InputRightAddon>
                </InputGroup>
              </ModalBody>
              <ModalFooter>
                <Button onClick={startSale}>Start Sale</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </Box>
  )
}

export { Erc721Item }
