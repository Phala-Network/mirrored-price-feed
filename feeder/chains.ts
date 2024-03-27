import { defineChain, type Chain } from 'viem'

export const tanssiDancebox: Chain = defineChain({
  id: 5678,
  name: 'dancebox-evm-container',
  network: 'tanssi',
  nativeCurrency: {
    name: 'TANGO',
    symbol: 'TANGO',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://fraa-dancebox-3001-rpc.a.dancebox.tanssi.network'],
    },
    public: {
      http: ['https://fraa-dancebox-3001-rpc.a.dancebox.tanssi.network'],
    }
  },
  blockExplorers: {
    default: {
      name: 'Dancebox 3001 Explorer',
      url: 'https://3001-blockscout.a.dancebox.tanssi.network/',
    }
  },
  contracts: {
    multicall3: {
      address: '0x9df28b3B2b937E1429dE36575A2b3E303205ce0e',
      blockCreated: 1537488,
    }
  },
  testnet: true,
})

export const mapRelayChain: Chain = defineChain({
  id: 22776,
  name: 'MAP Relay Chain',
  network: 'mapo',
  nativeCurrency: {
    name: 'MAPO',
    symbol: 'MAPO',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.maplabs.io'],
    },
    public: {
      http: ['https://rpc.maplabs.io'],
    }
  },
  blockExplorers: {
    default: {
      name: 'MAPO SCAN',
      url: 'https://maposcan.io/',
    }
  },
})

export const mapoMakalu: Chain = defineChain({
  id: 212,
  name: 'MAP Makalu Testnet',
  network: 'mapo',
  nativeCurrency: {
    name: 'MAPO',
    symbol: 'MAPO',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.maplabs.io'],
    },
    public: {
      http: ['https://testnet-rpc.maplabs.io'],
    }
  },
  blockExplorers: {
    default: {
      name: 'MAPO SCAN',
      url: 'https://testnet.maposcan.io/',
    }
  },
  contracts: {
    multicall3: {
      address: '0x49899fBd9be6b23d5e4AF697a92dc1E6C695862b',
      blockCreated: 8761684,
    }
  },
  testnet: true,
})
