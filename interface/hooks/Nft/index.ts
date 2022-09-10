import { useState, useEffect } from 'react'

const useOriginNft = () => {
  const [originNfts, setOriginNfts] = useState<OriginNft[]>([])

  useEffect(() => {
    const nfts = [
      { id: 1, url: 'xxx', author: '0xf4aAA4b38a0E749415E37638879BeDfe47645a77', owner: '', value: 100, onSale: true },
      {
        id: 2,
        url: 'xxx',
        author: '0xf4aAA4b38a0E749415E37638879BeDfe47645a77',
        owner: '0x164dCE432070439B6595c21d41CB28f9B8114342',
        value: 200,
        onSale: false,
      },
      { id: 3, url: 'xxx', author: '0xf4aAA4b38a0E749415E37638879BeDfe47645a77', owner: '', value: 300, onSale: true },
    ]
    setOriginNfts(nfts)
  }, [])

  return originNfts
}

const useFanficNft = () => {
  const [fanficNfts, setFanficNfts] = useState<FanficNft[]>([])

  useEffect(() => {
    const nfts = [
      {
        id: 1,
        url: 'xxx',
        author: '0xf4aAA4b38a0E749415E37638879BeDfe47645a77',
        owner: '',
        value: 100,
        onSale: true,
        originIds: ['1', '2'],
      },
      {
        id: 2,
        url: 'xxx',
        author: '0xf4aAA4b38a0E749415E37638879BeDfe47645a77',
        owner: '0x164dCE432070439B6595c21d41CB28f9B8114342',
        value: 200,
        onSale: false,
        originIds: ['2'],
      },
      {
        id: 3,
        url: 'xxx',
        author: '0xf4aAA4b38a0E749415E37638879BeDfe47645a77',
        owner: '',
        value: 300,
        onSale: true,
        originIds: ['2', '3'],
      },
    ]
    setFanficNfts(nfts)
  }, [])

  return fanficNfts
}

export { useOriginNft, useFanficNft }
