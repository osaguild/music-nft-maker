import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-etherscan'
import '@nomiclabs/hardhat-waffle'
import '@nomiclabs/hardhat-solhint'
import 'solidity-coverage'
import 'hardhat-gas-reporter'
import * as dotenv from 'dotenv'

const PATH_TO_HARDHAT_ENV = `${__dirname}/.env`
dotenv.config({ path: PATH_TO_HARDHAT_ENV })

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY as string
const SUB_1 = process.env.SUB_1_PRIVATE_KEY as string
const SUB_2 = process.env.SUB_2_PRIVATE_KEY as string
const SUB_3 = process.env.SUB_3_PRIVATE_KEY as string
const SUB_4 = process.env.SUB_4_PRIVATE_KEY as string
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY as string
const COIN_MARKET_CAP_API_KEY = process.env.COIN_MARKET_CAP_API_KEY as string

module.exports = {
  solidity: '0.8.9',
  networks: {
    goerli: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [`${SUB_1}`, `${SUB_2}`, `${SUB_3}`, `${SUB_4}`],
      gasPrice: 100000000000,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    currency: 'USD',
    coinmarketcap: COIN_MARKET_CAP_API_KEY,
    token: 'ETH',
  },
}
