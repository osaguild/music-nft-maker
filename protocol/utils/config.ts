import 'dotenv/config'

const address = {
  PROTOCOL_CONTRACT: process.env.NEXT_PUBLIC_PROTOCOL_CONTRACT as string,
  STAKING_CONTRACT: process.env.NEXT_PUBLIC_STAKING_CONTRACT as string,
  MTE_CONTRACT: process.env.NEXT_PUBLIC_MTE_CONTRACT as string,
  FANFIC_CONTRACT: process.env.NEXT_PUBLIC_FANFIC_CONTRACT as string,
  ORIGIN_CONTRACT: process.env.NEXT_PUBLIC_ORIGIN_CONTRACT as string,
  MARKET_CONTRACT: process.env.NEXT_PUBLIC_MARKET_CONTRACT as string,
  SUB_1_ACCOUNT: '0xf4aAA4b38a0E749415E37638879BeDfe47645a77',
  SUB_2_ACCOUNT: '0x164dCE432070439B6595c21d41CB28f9B8114342',
  SUB_3_ACCOUNT: '0xbD59fb743abA0f0AB1B037f73fc75150D07b7045',
  SUB_4_ACCOUNT: '0x0f16af1BdFeA64f8B8733603D346479f5B2c7DF5',
  ZERO_ADDRESS: '0x0000000000000000000000000000000000000000',
}

const uri = {
  ORIGIN_URI: process.env.ORIGIN_URI,
  FANFIC_URI: process.env.FANFIC_URI,
}
export { address, uri }
