import { address } from './config'

const convertAddress = (_address: string) => {
  switch (_address) {
    case address.PROTOCOL_CONTRACT:
      return 'PROTOCOL'
    case address.STAKING_CONTRACT:
      return 'STAKING'
    case address.MTE_CONTRACT:
      return 'MTE'
    case address.FANFIC_CONTRACT:
      return 'FANFIC'
    case address.ORIGIN_CONTRACT:
      return 'ORIGIN'
    case address.MARKET_CONTRACT:
      return 'MARKET'
    case address.SUB_1_ACCOUNT:
      return 'SUB_1'
    case address.SUB_2_ACCOUNT:
      return 'SUB_2'
    case address.SUB_3_ACCOUNT:
      return 'SUB_3'
    case address.SUB_4_ACCOUNT:
      return 'SUB_4'
    case address.ZERO_ADDRESS:
      return 'ZERO'
    default:
      return _address
  }
}

export { convertAddress }
