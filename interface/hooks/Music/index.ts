import { useState, useEffect } from 'react'

const useOnSaleMusics = () => {
  const [musics, setMusics] = useState<Music[]>([])

  useEffect(() => {
    const _musics = [
      { id: 1, url: 'xxx', author: 'osaguild', value: 0.01, isSale: true },
      { id: 2, url: 'xxx', author: 'osaguild', value: 0.01, isSale: true },
      { id: 3, url: 'xxx', author: 'osaguild', value: 0.01, isSale: true },
    ]
    setMusics(_musics)
  }, [])

  return musics
}

export { useOnSaleMusics }
