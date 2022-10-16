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
  RadioGroup,
  Stack,
  Radio,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
} from '@chakra-ui/react'
import { IpfsUploader, Event, SuccessEvent, FailedEvent, UploadedData, Config } from '@osaguild/ipfs-uploader'
import { useContract } from '../../hooks/Contract'
import { apiKey } from '../../config'

type TokenType = 'ORIGIN' | 'FANFIC'

const NftMaker: FunctionComponent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [tokenType, setTokenType] = useState<TokenType>('ORIGIN')
  const [tokenUri, setTokenUri] = useState<string>('')
  const [originIds, setOriginIds] = useState<string[]>([])
  const { originToken, fanficToken } = useContract()
  const ipfsUploaderConfig: Config = {
    enableChange: {
      metadataName: false,
      metadataKeyValue: false,
      imageName: false,
      audioName: false,
    },
    imageSize: 'm',
    pattern: 'audio',
    pinataApiJwt: apiKey.PINATA_API_JWT,
  }

  const mint = async () => {
    try {
      // validation
      if (tokenUri === '') throw new Error('tokenUri is required')
      else if (tokenType === 'FANFIC' && originIds.length === 0) throw new Error('originIds is required')

      // mint
      if (tokenType === 'ORIGIN') {
        const tx = await originToken?.mint(tokenUri)
        const receipt = await tx?.wait()
        const event = receipt?.events?.find((v) => v.event === 'Transfer')
        if (event === undefined) throw new Error('transfer event is not found')
      } else {
        const tx = await fanficToken?.mint(tokenUri, originIds)
        const receipt = await tx?.wait()
        const event = receipt?.events?.find((v) => v.event === 'Transfer')
        if (event === undefined) throw new Error('transfer event is not found')
      }
    } catch (e) {
      // todo: implement error handling
      console.log(e)
    }
  }

  const uploadEvent = (event: Event) => {
    try {
      // todo: implement upload event handling
      if (event.eventType === 'FILE_SELECTED') {
        // nothing to do
      } else if (event.eventType === 'VALIDATION_ERROR') {
        // nothing to do
      } else if (event.eventType === 'UPLOADING') {
        // nothing to do
      } else if (event.eventType === 'SUCCESS') {
        // set tokenUri from ipfs hash of uploaded metadata
        const uploadedData = (event as SuccessEvent).uploadedData
        const metadata = uploadedData[uploadedData.length - 1] as UploadedData
        setTokenUri(`https://gateway.pinata.cloud/ipfs/${metadata.log.IpfsHash}`)
      } else if (event.eventType === 'FAILED') {
        throw new Error(`failed to upload: ${(event as FailedEvent).message}`)
      } else {
        throw new Error('unknown event')
      }
    } catch (e) {
      // todo: implement error handling
      console.log(e)
    }
  }

  const tokenUriIsValid = tokenUri.length === 0 ? true : false
  const tokenTypeIsValid = tokenType === 'ORIGIN' || 'FANFIC' ? false : true
  const originIdsAreValid = tokenType === 'FANFIC' && originIds.length === 0 ? true : false

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
            <Accordion allowToggle>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    1.upload
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <IpfsUploader callback={uploadEvent} config={ipfsUploaderConfig} />
                </AccordionPanel>
              </AccordionItem>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    2.mint
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <FormControl id="token-type" isInvalid={tokenTypeIsValid} isRequired>
                    <FormLabel>token type</FormLabel>
                    <RadioGroup onChange={(value) => setTokenType(value as TokenType)} value={tokenType} mb={5}>
                      <Stack direction="row">
                        <Radio value="ORIGIN">Origin Token</Radio>
                        <Radio value="FANFIC">Fanfic Token</Radio>
                      </Stack>
                    </RadioGroup>
                    <FormHelperText>
                      select &quot;Origin Token&quot; to provide original music or &quot;Fanfic Token&quot; to provide
                      secondary creation music
                    </FormHelperText>
                    {tokenTypeIsValid && <FormErrorMessage>token type is required</FormErrorMessage>}
                  </FormControl>
                  <FormControl id="token-uri" isInvalid={tokenUriIsValid} mt="5" isRequired>
                    <FormLabel>token uri</FormLabel>
                    <Input placeholder="token uri" value={tokenUri} onChange={(e) => setTokenUri(e.target.value)} />
                    <FormHelperText>
                      automatically set the uri of uploaded metadata file. if you want to change it, please change it.
                    </FormHelperText>
                    {tokenUriIsValid && <FormErrorMessage>token uri is required</FormErrorMessage>}
                  </FormControl>
                  {tokenType === 'FANFIC' && (
                    <FormControl id="origin-ids" isInvalid={originIdsAreValid} mt="5" isRequired>
                      <FormLabel>origin id</FormLabel>
                      <Input
                        placeholder="please enter the origin ids used for the secondary creation"
                        value={originIds}
                        onChange={(e) => setOriginIds(e.target.value?.split(','))}
                      />
                      <FormHelperText>
                        please enter the origin ids used for the secondary creation, separated by commas
                      </FormHelperText>
                      {originIdsAreValid && <FormErrorMessage>origin id is required</FormErrorMessage>}
                    </FormControl>
                  )}
                  <Box textAlign="center" mt="5">
                    <Button onClick={mint}>mint</Button>
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export { NftMaker }
