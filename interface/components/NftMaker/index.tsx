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

type TokenType = 'ORIGIN' | 'FANFIC'

const NftMaker: FunctionComponent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [tokenType, setTokenType] = useState<TokenType>('ORIGIN')
  const [tokenUri, setTokenUri] = useState<string>()
  const [originIds, setOriginIds] = useState<string[]>([])
  const { originToken, fanficToken } = useContract()

  const makeOrigin = async () => {
    if (tokenUri) {
      const tx = await originToken?.mint(tokenUri)
      const receipt = await tx?.wait()
      const transfer = receipt?.events?.find((v) => v.event === 'Transfer')
      if (transfer === undefined) throw new Error('transfer event is not found')
    }
  }

  const makeFanfic = async () => {
    if (tokenUri) {
      const tx = await fanficToken?.mint(tokenUri, originIds)
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
            <RadioGroup onChange={(value) => setTokenType(value as TokenType)} value={tokenType} mb={5}>
              <Stack direction="row">
                <Radio value="ORIGIN">Origin Token</Radio>
                <Radio value="FANFIC">Fanfic Token</Radio>
              </Stack>
            </RadioGroup>
            <Input placeholder="token uri" value={tokenUri} onChange={(e) => setTokenUri(e.target.value)} />
            {tokenType === 'FANFIC' && (
              <Input
                placeholder="please input your token ids separated by commas"
                value={originIds}
                onChange={(e) => setOriginIds(e.target.value?.split(','))}
              />
            )}
            <Box></Box>
          </ModalBody>
          <ModalFooter>
            {tokenType === 'ORIGIN' ? (
              <Button onClick={makeOrigin}>Make Origin Token</Button>
            ) : (
              <Button onClick={makeFanfic}>Make Fanfic Token</Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export { NftMaker }
