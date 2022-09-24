import { FunctionComponent, useState, useEffect } from 'react'
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
  Image,
} from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useContract } from '../../hooks/Contract'
import { isFanfic } from '../../types/typeGuard'
import { address } from '../../config'

interface Erc721ItemProps {
  erc721: Erc721
}

type EventType = 'APPROVE' | 'START_SALE'

const Erc721Item: FunctionComponent<Erc721ItemProps> = ({ erc721 }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [eventType, setEventType] = useState<EventType>('APPROVE')
  const [price, setPrice] = useState('0.01')
  const [image, setImage] = useState<string>()
  const { market, fanficToken } = useContract()

  const approve = async () => {
    const tx = await fanficToken?.approve(address().MARKET_CONTRACT, erc721.id)
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

  useEffect(() => {
    if (erc721) {
      fetch(erc721.uri)
        .then((res) => res.json())
        .then((json) => setImage(json.image))
    }
  }, [erc721])

  return (
    <Box textAlign="center" w="350" h="350px">
      <Text fontSize="l" textAlign="center" position="absolute" height="30px" color="black" w="350px" mt={2}>
        {`id: ${erc721.id}`}
      </Text>
      <Image src={image} alt="fanfic token image" />
      {isFanfic(erc721) && (
        <>
          <Box textAlign="center" w="350px" height="30px" position="absolute" mt="-50px">
            <Button onClick={onOpen} color="black">
              Exhibit
            </Button>
          </Box>
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
