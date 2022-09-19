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
import { isFanficToken } from '../../types/typeGuard'
import { Pattern } from '.'

interface ItemProps {
  token: Erc721
  pattern: Pattern
}

const Item: FunctionComponent<ItemProps> = ({ token, pattern }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [price, setPrice] = useState('1000')
  const { market } = useContract()

  const startSale = async () => {
    const tx = await market?.startSale(token.id, ethers.utils.parseEther(price))
    const receipt = await tx?.wait()
    const start = receipt?.events?.find((v) => v.event === 'StartSale')
    if (start === undefined) throw new Error('start sale event is not found')
  }

  return (
    <Box textAlign="center" w="300px" h="300px">
      <Text fontSize="xl" textAlign="center" my="30">
        {isFanficToken(token) ? `Fanfic Token ${token.id} ` : `Origin Token ${token.id}`}
      </Text>
      {pattern == 'CREATED' && isFanficToken(token) && (
        <>
          <Button onClick={onOpen}>Exhibit</Button>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Form</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <InputGroup size="sm">
                  <Input placeholder="value of MTE" value={price} onChange={(e) => setPrice(e.target.value)} />
                  <InputRightAddon>MTE</InputRightAddon>
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

export { Item }
