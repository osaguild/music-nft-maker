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
  RadioGroup,
  Stack,
  Radio,
  useDisclosure,
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useContract } from '../../hooks/Contract'
import { isFanfic } from '../../types/typeGuard'
import { address } from '../../config/address'

interface Erc721ItemProps {
  erc721: Erc721
}

type EventType = 'APPROVE' | 'START_SALE'

const Erc721Item: FunctionComponent<Erc721ItemProps> = ({ erc721 }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [eventType, setEventType] = useState<EventType>('APPROVE')
  const [price, setPrice] = useState('0.01')
  const { market, fanficToken } = useContract()

  const approve = async () => {
    const tx = await fanficToken?.approve(address.MARKET_CONTRACT, erc721.id)
    const receipt = await tx?.wait()
    const start = receipt?.events?.find((v) => v.event === 'Approval')
    if (start === undefined) throw new Error('start sale event is not found')
  }

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
                <RadioGroup onChange={(value) => setEventType(value as EventType)} value={eventType} mb={5}>
                  <Stack direction="row">
                    <Radio value="APPROVE">Approve</Radio>
                    <Radio value="START_SALE">Start Sale</Radio>
                  </Stack>
                </RadioGroup>
                {eventType === 'START_SALE' && (
                  <InputGroup size="sm">
                    <Input placeholder="value of ETH" value={price} onChange={(e) => setPrice(e.target.value)} />
                    <InputRightAddon>ETH</InputRightAddon>
                  </InputGroup>
                )}
              </ModalBody>
              <ModalFooter>
                {eventType === 'APPROVE' ? (
                  <Button onClick={approve}>Approve</Button>
                ) : (
                  <Button onClick={startSale}>Start Sale</Button>
                )}
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )}
    </Box>
  )
}

export { Erc721Item }
