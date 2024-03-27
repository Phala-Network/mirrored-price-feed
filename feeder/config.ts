import type { Chain, Hex } from 'viem'
import { mainnet, baseSepolia, astarZkatana, astarZkyoto } from 'viem/chains'
import { tanssiDancebox, mapoMakalu } from './chains'

export interface Source {
  chain: Chain
  provider: string
  contracts: Record<string, Hex>
}

export interface Relay {
  chain: Chain
  sources: {
    source: string
    pairs: string[]
  }[]
  contracts: Record<string, Hex>
}

export const sources: Readonly<Record<string, Source>> = {
  etherum: {
    chain: mainnet,
    provider: 'chainlink',
    contracts: {
      'AAVE-USD': '0x547a514d5e3769680Ce22B2361c10Ea13619e8a9',
      'CRV-USD': '0xCd627aA160A6fA45Eb793D19Ef54f5062F20f33f',
      'ETH-USD': '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419',
      'BTC-USD': '0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c',
      'DAI-USD': '0xAed0c38402a5d19df6E4c03F4E2DceD6e29c1ee9',
      'USDT-USD': '0x3E7d1eAB13ad0104d2750B8863b489D65364e32D',
      'USDC-USD': '0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6',
    }
  }
}

export const relays: Readonly<Record<string, Relay>> = {
  baseSepolia: {
    chain: baseSepolia,
    sources: [
      {
        source: 'etherum',
        pairs: ['AAVE-USD', 'CRV-USD', 'ETH-USD', 'BTC-USD', 'DAI-USD', 'USDT-USD', 'USDC-USD'],
      }
    ],
    contracts: {
      'AAVE-USD': '0x739d71fC66397a28B3A3b7d40eeB865CA05f0185',
      'CRV-USD': '0xf38b25b79A72393Fca2Af88cf948D98c64726273',
      'ETH-USD': '0x2E1640853bB2dD9f47831582665477865F9240DB',
      'BTC-USD': '0x1e73C20c42a7de166868da4c47963d137030492A',
      'DAI-USD': '0xB842f535a88021F95e1a94245Fa549a7f75084Dc',
      'USDT-USD': '0x92E9b9348949455580EB820ba041f4cAaB998e3f',
      'USDC-USD': '0x49899fBd9be6b23d5e4AF697a92dc1E6C695862b',
    },
  },

  tanssiDancebox: {
    chain: tanssiDancebox,
    sources: [
      {
        source: 'etherum',
        pairs: ['AAVE-USD', 'CRV-USD', 'ETH-USD', 'BTC-USD', 'DAI-USD', 'USDT-USD', 'USDC-USD'],
      }
    ],
    contracts: {
      'AAVE-USD': '0x2E1640853bB2dD9f47831582665477865F9240DB',
      'CRV-USD': '0xf38b25b79A72393Fca2Af88cf948D98c64726273',
      'ETH-USD': '0x739d71fC66397a28B3A3b7d40eeB865CA05f0185',
      'BTC-USD': '0x89BC5048d634859aef743fF2152363c0e83a6a49',
      'DAI-USD': '0x1f56d8c7D72CE2210Ef340E00119CDac2b05449B',
      'USDT-USD': '0x5018c16707500D2C89a0446C08f347A024f55AE3',
      'USDC-USD': '0x4b8331Ce5Ae6cd33bE669c10Ded9AeBA774Bf252',
    },
  },

  zkatana: {
    chain: astarZkatana,
    sources: [
      {
        source: 'etherum',
        pairs: ['AAVE-USD', 'CRV-USD', 'ETH-USD', 'BTC-USD', 'DAI-USD', 'USDT-USD', 'USDC-USD'],
      }
    ],
    contracts: {
      'AAVE-USD': '0x49899fBd9be6b23d5e4AF697a92dc1E6C695862b',
      'CRV-USD': '0x89BC5048d634859aef743fF2152363c0e83a6a49',
      'ETH-USD': '0x739d71fC66397a28B3A3b7d40eeB865CA05f0185',
      'BTC-USD': '0xf38b25b79A72393Fca2Af88cf948D98c64726273',
      'DAI-USD': '0x2E1640853bB2dD9f47831582665477865F9240DB',
      'USDT-USD': '0x1e73C20c42a7de166868da4c47963d137030492A',
      'USDC-USD': '0xB842f535a88021F95e1a94245Fa549a7f75084Dc',
    }
  },

  zkyoto: {
    chain: astarZkyoto,
    sources: [
      {
        source: 'etherum',
        pairs: ['AAVE-USD', 'CRV-USD', 'ETH-USD', 'BTC-USD', 'DAI-USD', 'USDT-USD', 'USDC-USD'],
      }
    ],
    contracts: {
      'AAVE-USD': '0x92E9b9348949455580EB820ba041f4cAaB998e3f',
      'USDC-USD': '0x1e73C20c42a7de166868da4c47963d137030492A',
      'USDT-USD': '0x2E1640853bB2dD9f47831582665477865F9240DB',
      'DAI-USD': '0xf38b25b79A72393Fca2Af88cf948D98c64726273',
      'BTC-USD': '0xB842f535a88021F95e1a94245Fa549a7f75084Dc',
      'ETH-USD': '0x739d71fC66397a28B3A3b7d40eeB865CA05f0185',
      'CRV-USD': '0x49899fBd9be6b23d5e4AF697a92dc1E6C695862b',
    },
  },

  mapoMakalu: {
    chain: mapoMakalu,
    sources: [
      {
        source: 'etherum',
        pairs: ['ETH-USD', 'BTC-USD', 'USDT-USD', 'USDC-USD'],
      },
    ],
    contracts: {
      'BTC-USD': '0x92E9b9348949455580EB820ba041f4cAaB998e3f',
      'ETH-USD': '0xB842f535a88021F95e1a94245Fa549a7f75084Dc',
      'USDC-USD': '0x1e73C20c42a7de166868da4c47963d137030492A',
      'USDT-USD': '0x2E1640853bB2dD9f47831582665477865F9240DB',
    }
  },
}
