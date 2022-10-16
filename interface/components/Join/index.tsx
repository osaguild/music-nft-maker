import { FunctionComponent, useState } from 'react'
import {
  Box,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  InputGroup,
  Input,
  InputRightAddon,
  useDisclosure,
  Link,
  Stack,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useContract } from '../../hooks/Contract'
import { address } from '../../config'
import { ethers } from 'ethers'

const Join: FunctionComponent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [value, setValue] = useState('100')
  const [isApproving, setIsApproving] = useState(false)
  const [isStaking, setIsStaking] = useState(false)
  const { protocol, mteToken } = useContract()
  const router = useRouter()

  const approve = async () => {
    try {
      // start approve
      setIsApproving(true)

      // send transaction
      const tx = await mteToken?.approve(address.PROTOCOL_CONTRACT, ethers.utils.parseEther(value))
      const receipt = await tx?.wait()
      const event = receipt?.events?.find((v) => v.event === 'Approval')
      if (event === undefined) throw new Error('approve event is not found')

      // end approve
      setIsApproving(false)
    } catch (e) {
      // todo: error handling
      setIsApproving(false)
    }
  }

  const stake = async () => {
    try {
      // start stake
      setIsStaking(true)

      // send transaction
      const tx = await protocol?.stake(ethers.utils.parseEther(value))
      const receipt = await tx?.wait()
      const event = receipt?.events?.find((v) => v.event === 'Stake')
      if (event === undefined) throw new Error('stake event is not found')

      // end stake
      setIsStaking(false)
      onClose
    } catch (e) {
      // todo: error handling
      setIsStaking(false)
    }
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
      <Button verticalAlign="bottom" onClick={onOpen} mt={5} bg="primary" color="white">
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
            <Stack spacing="2" direction="row" justify="center" mt="5">
              <Button onClick={approve} isLoading={isApproving} w="120px" bg="primary" color="white">
                Approve
              </Button>
              <Button onClick={stake} isLoading={isStaking} w="120px" bg="primary" color="white">
                Stake
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export { Join }
