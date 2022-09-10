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

const Join: FunctionComponent = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [value, setValue] = useState('1000')

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
              <Input placeholder="1" value={value} onChange={(e) => setValue(e.target.value)} />
              <InputRightAddon>MTE</InputRightAddon>
            </InputGroup>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Stake</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export { Join }
