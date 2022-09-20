const isFanfic = (e: Erc721): e is Fanfic => {
  return (e as Fanfic).originIds !== undefined
}

const isSale = (e: Erc721 | Sale): e is Sale => {
  return (e as Sale).price !== undefined
}

export { isFanfic, isSale }
