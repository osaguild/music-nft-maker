import { FunctionComponent, useState } from 'react'
import {
  Box,
  Text,
  Select,
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
  const [role, setRole] = useState<Role>('CREATOR')

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
            <Select value={role} onChange={(e) => setRole(e.target.value as Role)}>
              <option value="CREATOR">CREATOR</option>
              <option value="FAN">FAN</option>
            </Select>
            <InputGroup size="sm">
              <Input placeholder="1" />
              <InputRightAddon children="MTE" />
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
