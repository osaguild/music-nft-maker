import { useState, useEffect } from 'react'

const useOnSalePlayLists = () => {
  const [playLists, setPlayLists] = useState<PlayList[]>([])

  useEffect(() => {
    const _playLists = [
      { id: 1, url: 'xxx', musicUrls: ['aaa', 'bbb'], author: 'osaguild', value: 0.01, isSale: true },
      { id: 2, url: 'xxx', musicUrls: ['aaa', 'bbb'], author: 'osaguild', value: 0.01, isSale: true },
      { id: 3, url: 'xxx', musicUrls: ['aaa', 'bbb'], author: 'osaguild', value: 0.01, isSale: true },
    ]
    setPlayLists(_playLists)
  }, [])

  return playLists
}

const useOwnPlayLists = () => {
  const [playLists, setPlayLists] = useState<PlayList[]>([])

  useEffect(() => {
    const _playLists = [
      { id: 1, url: 'xxx', musicUrls: ['aaa', 'bbb'], author: 'osaguild', value: 0.01, isSale: true },
      { id: 3, url: 'xxx', musicUrls: ['aaa', 'bbb'], author: 'osaguild', value: 0.01, isSale: true },
    ]
    setPlayLists(_playLists)
  }, [])

  return playLists
}

export { useOnSalePlayLists, useOwnPlayLists }
