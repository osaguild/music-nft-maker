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
import { useContract } from '../../hooks/Contract'
import { address } from '../../config/address'
import { ethers } from 'ethers'

const Join: FunctionComponent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [value, setValue] = useState('1000')
  const { protocol, mteToken } = useContract()

  const approve = async () => {
    const tx = await mteToken?.approve(address.PROTOCOL_CONTRACT, ethers.utils.parseEther(value))
    const receipt = await tx?.wait()
    const approval = receipt?.events?.find((v) => v.event === 'Approval')
    if (approval === undefined) throw new Error('approve event is not found')
  }

  const join = async () => {
    const tx = await protocol?.stake(ethers.utils.parseEther(value))
    const receipt = await tx?.wait()
    const transfer = receipt?.events?.find((v) => v.event === 'Transfer')
    if (transfer === undefined) throw new Error('stake event is not found')
    onClose
  }

  return (
    <Box textAlign="center" my={20}>
      <Text fontSize="2xl">please join our creator token economics</Text>
      <Button verticalAlign="bottom" onClick={onOpen} mt={10}>
        Join
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Form</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup size="sm">
              <Input placeholder="value of MTE" value={value} onChange={(e) => setValue(e.target.value)} />
              <InputRightAddon>MTE</InputRightAddon>
            </InputGroup>
          </ModalBody>
          <ModalFooter>
            <Button onClick={approve}>Approve</Button>
            <Button onClick={join}>Stake</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export { Join }
