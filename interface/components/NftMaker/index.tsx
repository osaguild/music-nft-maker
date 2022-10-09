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
  const [originUri, setOriginUri] = useState<string>(
    'https://gateway.pinata.cloud/ipfs/QmQ5AeuuVj7SbFaShS8N4SBiWJCPbgw7cF7tcBexZ4cQuK'
  )
  const [fanficUri, setFanficUri] = useState<string>(
    'https://gateway.pinata.cloud/ipfs/QmQ5bTDRUzfoV5ehuVTUi113F81ZQTFTrFH8dpWgsTE12X'
  )
  const [originIds, setOriginIds] = useState<string[]>([])
  const { originToken, fanficToken } = useContract()

  const makeOrigin = async () => {
    if (originUri) {
      const tx = await originToken?.mint(originUri)
      const receipt = await tx?.wait()
      const event = receipt?.events?.find((v) => v.event === 'Transfer')
      if (event === undefined) throw new Error('transfer event is not found')
    }
  }

  const makeFanfic = async () => {
    if (fanficUri) {
      const tx = await fanficToken?.mint(fanficUri, originIds)
      const receipt = await tx?.wait()
      const event = receipt?.events?.find((v) => v.event === 'Transfer')
      if (event === undefined) throw new Error('transfer event is not found')
    }
  }

  return (
    <Box textAlign="center">
      <Button verticalAlign="bottom" onClick={onOpen} bg="primary">
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
            {tokenType === 'ORIGIN' ? (
              <Input placeholder="token uri" value={originUri} onChange={(e) => setOriginUri(e.target.value)} />
            ) : (
              <>
                <Input placeholder="token uri" value={fanficUri} onChange={(e) => setFanficUri(e.target.value)} />
                <Input
                  placeholder="please input your token ids separated by commas"
                  value={originIds}
                  onChange={(e) => setOriginIds(e.target.value?.split(','))}
                />
              </>
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
