import { FunctionComponent, useState } from 'react'
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  ModalFooter,
  RadioGroup,
  Stack,
  Radio,
  useDisclosure,
} from '@chakra-ui/react'
import { useContract } from '../../hooks/Contract'

const NftMaker: FunctionComponent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [tokenType, setTokenType] = useState('ORIGIN')
  const [tokenUri, setTokenUri] = useState<string>()
  const { originToken } = useContract()

  const make = async () => {
    if (tokenUri) {
      const tx = await originToken?.mint(tokenUri)
      const receipt = await tx?.wait()
      const transfer = receipt?.events?.find((v) => v.event === 'Transfer')
      if (transfer === undefined) throw new Error('transfer event is not found')
    }
  }

  return (
    <Box textAlign="center">
      <Button verticalAlign="bottom" onClick={onOpen} mt={10}>
        Make New
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Form</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RadioGroup onChange={setTokenType} value={tokenType} mb={5}>
              <Stack direction="row">
                <Radio value="ORIGIN">Origin Token</Radio>
                <Radio value="FANFIC">Fanfic Token</Radio>
              </Stack>
            </RadioGroup>
            <Input placeholder="token uri" value={tokenUri} onChange={(e) => setTokenUri(e.target.value)} />
          </ModalBody>
          <ModalFooter>
            <Button onClick={make}>Make</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export { NftMaker }
