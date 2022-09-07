const switchNetwork = async (chainId: number) => {
  const { ethereum } = window
  await ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: `0x${chainId.toString(16)}` }],
  })
}

export { switchNetwork }
