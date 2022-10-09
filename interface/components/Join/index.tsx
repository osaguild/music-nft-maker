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
  Link,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useContract } from '../../hooks/Contract'
import { address } from '../../config'
import { ethers } from 'ethers'

const Join: FunctionComponent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [value, setValue] = useState('100')
  const { protocol, mteToken } = useContract()
  const router = useRouter()

  const approve = async () => {
    const tx = await mteToken?.approve(address().PROTOCOL_CONTRACT, ethers.utils.parseEther(value))
    const receipt = await tx?.wait()
    const event = receipt?.events?.find((v) => v.event === 'Approval')
    if (event === undefined) throw new Error('approve event is not found')
  }

  const join = async () => {
    const tx = await protocol?.stake(ethers.utils.parseEther(value))
    const receipt = await tx?.wait()
    const event = receipt?.events?.find((v) => v.event === 'Stake')
    if (event === undefined) throw new Error('stake event is not found')
    onClose
  }

  return (
    <Box textAlign="center" my={10}>
      <Text fontSize="xl">
        Please join our ecosystem. If you are member, click{' '}
        <Link onClick={() => router.push('/member')} className="web3-text">
          here
        </Link>{' '}
        for member page.
      </Text>
      <Button verticalAlign="bottom" onClick={onOpen} mt={5} bg="primary">
        Join Us
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
