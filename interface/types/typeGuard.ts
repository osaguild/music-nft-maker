const isFanficToken = (token: Erc721): token is FanficToken => {
  return (token as FanficToken).originIds !== undefined
}

export { isFanficToken }
