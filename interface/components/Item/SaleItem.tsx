import { FunctionComponent, useEffect, useState } from 'react'
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
  useDisclosure,
  Container,
  Wrap,
  WrapItem,
  Link,
} from '@chakra-ui/react'
import { useContract } from '../../hooks/Contract'
import { BigNumber, ethers } from 'ethers'
import { fetchOrigin } from '../../lib/fetch'
import { Collection } from '../Collection'
import { Item } from './Item'

interface SaleItemProps {
  sale: Sale
}

const SaleItem: FunctionComponent<SaleItemProps> = ({ sale }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [image, setImage] = useState<string>()
  const [audio, setAudio] = useState<string>()
  const [origins, setOrigins] = useState<Origin[]>([])
  const [royalties, setRoyalties] = useState<Royalty[]>([])
  const [isPurchasing, setIsPurchasing] = useState(false)
  const { market, originToken, fanficToken, protocol } = useContract()

  const purchase = async () => {
    try {
      // start purchase
      setIsPurchasing(true)

      // send transaction
      const tx = await market?.purchase(sale.id, { value: ethers.utils.parseEther(sale.price.toString()) })
      const receipt = await tx?.wait()
      const start = receipt?.events?.find((v) => v.event === 'Purchase')
      if (start === undefined) throw new Error('purchase event is not found')

      // end purchase
      setIsPurchasing(false)
    } catch (e) {
      setIsPurchasing(false)
    }
  }

  useEffect(() => {
    if (sale) {
      fetch(sale.fanficToken.uri)
        .then((res) => res.json())
        .then((json) => {
          setImage(json.image)
          setAudio(json.animation_url)
        })
    }
  }, [sale])

  useEffect(() => {
    if (fanficToken && protocol) {
      protocol?.rateOfLiquidity().then((rate) => {
        //const mteAmount = BigNumber.from(sale.price).mul(10000).div(rate)
        const mteAmount = BigNumber.from((sale.price * 10000) / rate.toNumber())
        fanficToken.royaltyInfo(sale.fanficToken.id, mteAmount).then((e) => {
          const [receivers, royaltyAmounts] = e
          const _royalties: Royalty[] = []
          for (let i = 0; i < receivers.length; i++) {
            _royalties.push({
              receiver: receivers[i] as string,
              value: (royaltyAmounts[i] as BigNumber).toNumber(),
            })
          }
          setRoyalties(_royalties)
        })
      })
    }
  }, [fanficToken, protocol, sale])

  useEffect(() => {
    if (originToken) {
      const promises = sale.fanficToken.originIds.map(async (e) => {
        return await fetchOrigin(originToken, e)
      })
      Promise.all(promises).then((res) => {
        setOrigins(res)
      })
    }
  }, [originToken, sale])

  return (
    <Box>
      <Link onClick={onOpen}>
        <Item image={image as string} audio={audio as string} />
      </Link>
      <Text fontSize="l" textAlign="center">
        {`SALE ${sale.id} / ${sale.price} ETH`}
      </Text>
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Container maxW="container.lg">
              <Text fontSize="6xl" textAlign="center" className="web3-title">
                Music Information
              </Text>
              <Wrap spacing="30px" justify="center" my="30">
                <WrapItem>
                  <Item image={image as string} audio={audio as string} />
                </WrapItem>
                <WrapItem>
                  <Box>
                    <Text fontSize="xl">1.owner</Text>
                    <Text fontSize="xl">{`- ${sale.fanficToken.owner}`}</Text>
                    <Text fontSize="xl">2.price</Text>
                    <Text fontSize="xl">{`- ${sale.price} ETH`}</Text>
                    <Text fontSize="xl">3.royalties</Text>
                    {royalties.map((e, i) => (
                      <Text fontSize="xl" key={i}>{`- ${e.value} MTE to ${e.receiver}`}</Text>
                    ))}
                    <Box textAlign="center" mt={10}>
                      <Button
                        onClick={purchase}
                        display="block"
                        margin="auto"
                        mb="20px"
                        bg="primary"
                        color="white"
                        w="120px"
                        isLoading={isPurchasing}
                      >
                        Purchase
                      </Button>
                    </Box>
                  </Box>
                </WrapItem>
              </Wrap>
              <Text fontSize="3xl" textAlign="center" mt="50" className="web3-title">
                Original Music
              </Text>
              <Collection pattern="ERC721" items={origins} />
            </Container>
          </ModalBody>
          <ModalFooter textAlign="center"></ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export { SaleItem }
