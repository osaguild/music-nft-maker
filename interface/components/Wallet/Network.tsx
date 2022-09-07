import { FunctionComponent, useState, useEffect } from 'react'
import { providers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { Menu, MenuButton, MenuList, MenuItem, Image, Button, Box, Text } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { networks } from '../../config/network'
import { switchNetwork } from '../../lib/metamask'

const Network: FunctionComponent = () => {
  const { chainId } = useWeb3React<providers.Web3Provider>()
  const [currentNetwork, setCurrentNetwork] = useState<Network | undefined>()

  useEffect(() => {
    if (chainId) setCurrentNetwork(networks.filter((network) => network.chainId === chainId)[0])
    else setCurrentNetwork(undefined)
  }, [chainId])

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} w={160} mx={1} my={2}>
        {currentNetwork ? (
          <Box>
            <Image boxSize="1.5rem" borderRadius="full" src={currentNetwork.icon} alt="chain logo" />
            <Text textAlign="left" mt={-5} ml={9}>
              {currentNetwork.name}
            </Text>
          </Box>
        ) : (
          <Box>network</Box>
        )}
      </MenuButton>
      <MenuList w={10}>
        {networks.map((network) => (
          <MenuItem key={network.chainId} onClick={() => switchNetwork(network.chainId)}>
            <Image boxSize="1.5rem" borderRadius="full" src={network.icon} alt="chain logo" ml={0.5} mr={3} />
            <span>{network.name}</span>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}

export { Network }
